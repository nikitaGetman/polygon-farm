import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useAccount } from 'wagmi';

import { bigNumberToString } from '@/utils/number';

import { TOKENS } from './contracts/useTokenContract';
import { useUsdtTokenContract } from './contracts/useUsdtTokenContract';
import { useVendorSellContract } from './contracts/useVendorSellContract';
import { useConnectWallet } from './useConnectWallet';
import { useNotification } from './useNotification';
import { SAV_BALANCE_REQUEST, USDT_BALANCE_REQUEST } from './useTokenBalance';
import { useTokens } from './useTokens';

const SWAP_RATE_REQUEST = 'swap-rate-request';
const SELL_COMMISSION_REQUEST = 'sell-commission-request';
const SELL_AVAILABLE_REQUEST = 'sell-available-request';
const BUY_TOKENS_MUTATION = 'buy-tokens-mutation';
const SELL_TOKENS_MUTATION = 'sell-tokens-mutation';

export const CONTRACT_DIVIDER = 1000;
export const useVendorSellControl = () => {
  const vendorSellContract = useVendorSellContract();
  const queryClient = useQueryClient();
  const { success, handleError } = useNotification();

  const isSellAvailableRequest = useQuery([SELL_AVAILABLE_REQUEST], async () => {
    return await vendorSellContract.isSellAvailable();
  });

  const sellCommissionRequest = useQuery([SELL_COMMISSION_REQUEST], async () => {
    return await vendorSellContract.getSellTokenCommission();
  });

  const isSellAvailable = useMemo(() => {
    return isSellAvailableRequest.data?.valueOf();
  }, [isSellAvailableRequest.data]);

  const sellCommission = useMemo(() => {
    return sellCommissionRequest.data
      ? sellCommissionRequest.data.toNumber() / CONTRACT_DIVIDER
      : null;
  }, [sellCommissionRequest.data]);

  const updateSellFee = useMutation(
    ['update-sell-fee'],
    async (fee: number) => {
      const txHash = await vendorSellContract.updateSellFee((fee / 100) * CONTRACT_DIVIDER);
      success({ title: 'Success', description: 'Sell fee updated', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([SELL_COMMISSION_REQUEST]);
      },
      onError: handleError,
    }
  );

  const enableSell = useMutation(
    ['enable-sell'],
    async () => {
      const txHash = await vendorSellContract.enableSell();
      success({ title: 'Success', description: 'SAV token sell enabled', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([SELL_AVAILABLE_REQUEST]);
      },
      onError: handleError,
    }
  );

  const disableSell = useMutation(
    ['disable-sell'],
    async () => {
      const txHash = await vendorSellContract.disableSell();
      success({ title: 'Success', description: 'SAV token sell disabled', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([SELL_AVAILABLE_REQUEST]);
      },
      onError: handleError,
    }
  );

  return {
    sellCommissionRequest,
    sellCommission,
    isSellAvailableRequest,
    isSellAvailable,
    updateSellFee,
    enableSell,
    disableSell,
  };
};

export const useVendorSell = () => {
  const { address: account } = useAccount();
  const queryClient = useQueryClient();
  const vendorSellContract = useVendorSellContract();
  const usdtContract = useUsdtTokenContract();
  const tokens = useTokens();
  const { sellCommissionRequest, sellCommission, isSellAvailableRequest, isSellAvailable } =
    useVendorSellControl();
  const { success, handleError } = useNotification();

  const { connect } = useConnectWallet();

  const swapRateRequest = useQuery([SWAP_RATE_REQUEST], async () => {
    return await vendorSellContract.getSwapRate();
  });

  const swapRate = useMemo(() => {
    return swapRateRequest.data ? swapRateRequest.data.toNumber() / CONTRACT_DIVIDER : null;
  }, [swapRateRequest.data]);

  const getTokenSellEquivalent = useCallback(
    (_tokenAmount: string) => {
      if (sellCommission !== null && swapRate !== null) {
        const tokenAmount = parseFloat(_tokenAmount);
        const amountWithFee = tokenAmount * swapRate;
        const fee = tokenAmount * sellCommission;
        return amountWithFee - fee;
      }
      return undefined;
    },
    [sellCommission, swapRate]
  );
  const getTokenBuyEquivalent = useCallback(
    (_tokenAmount: string) => {
      if (sellCommission !== null && swapRate !== null) {
        const tokenAmountWithoutFee = parseFloat(_tokenAmount);
        const amountWithFee = tokenAmountWithoutFee / (1 - sellCommission);
        const amount = amountWithFee / swapRate;
        return amount;
      }
      return undefined;
    },
    [sellCommission, swapRate]
  );

  const buyTokens = useMutation(
    [BUY_TOKENS_MUTATION],
    async (spendAmount: BigNumberish) => {
      if (!account) {
        connect();
        return;
      }

      const allowance = await usdtContract.allowance(account, vendorSellContract.address);

      if (allowance.lt(spendAmount)) {
        const txHash = await usdtContract.approve(
          vendorSellContract.address,
          BigNumber.from(ethers.constants.MaxUint256)
        );
        success({ title: 'Approved', txHash });
      }

      const spendAmountString = bigNumberToString(spendAmount, {
        decimals: 6,
      });

      const txHash = await vendorSellContract.buyTokens(spendAmount);
      success({
        title: 'Success',
        description: `You exchanged ${spendAmountString} USDT to ${spendAmountString} SAV`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USDT_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  const sellTokens = useMutation(
    [SELL_TOKENS_MUTATION],
    async (sellAmount: BigNumberish) => {
      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        spender: vendorSellContract.address,
        requiredAmount: sellAmount,
      });

      const txHash = await vendorSellContract.sellTokens(sellAmount);
      const usdtAmount = getTokenSellEquivalent(bigNumberToString(sellAmount)) || 0;
      success({
        title: 'Success',
        description: `You exchanged ${bigNumberToString(sellAmount)} SAV to ${usdtAmount} USDT`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USDT_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return {
    vendorSellContract,
    swapRateRequest,
    swapRate,
    sellCommissionRequest,
    sellCommission,
    isSellAvailableRequest,
    isSellAvailable,
    getTokenSellEquivalent,
    getTokenBuyEquivalent,
    buyTokens,
    sellTokens,
  };
};
