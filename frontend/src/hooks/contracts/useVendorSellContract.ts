import { BigNumberish } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { VendorSell } from '@/types';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useVendorSellContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.VendorSell,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as VendorSell;

  const getSwapRate = () => {
    return contract.swapRate();
  };

  const getSellTokenCommission = () => {
    return contract.sellTokenCommission();
  };

  const getDivider = () => {
    return contract.DIVIDER();
  };

  const isSellAvailable = () => {
    return contract.isSellAvailable();
  };

  const buyTokens = async (spendAmount: BigNumberish) => {
    const tx = await contract.buyTokens(spendAmount);
    return waitForTransaction(tx);
  };

  const sellTokens = async (sellAmount: BigNumberish) => {
    const tx = await contract.sellTokens(sellAmount);
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    getSwapRate,
    getSellTokenCommission,
    getDivider,
    isSellAvailable,
    buyTokens,
    sellTokens,
  };
};
