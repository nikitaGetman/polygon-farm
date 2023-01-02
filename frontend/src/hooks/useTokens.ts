import { useMutation } from '@tanstack/react-query';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useAccount } from 'wagmi';

import { ContractsEnum } from './contracts/useContractAbi';
import { TOKENS, useTokenContract } from './contracts/useTokenContract';
import { useConnectWallet } from './useConnectWallet';
import { useNotification } from './useNotification';

const INCREASE_TOKEN_ALLOWANCE_MUTATION = 'increase-allowance';
export const useTokens = () => {
  const savToken = useTokenContract(ContractsEnum.SAV);
  const savRToken = useTokenContract(ContractsEnum.SAVR);
  const { success } = useNotification();
  const { address } = useAccount();
  const { connect } = useConnectWallet();

  const increaseAllowanceIfRequired = useMutation(
    [INCREASE_TOKEN_ALLOWANCE_MUTATION],
    async ({
      token,
      spender,
      requiredAmount,
      allow,
    }: {
      token: TOKENS;
      spender: string;
      requiredAmount: BigNumberish;
      allow?: BigNumberish;
    }) => {
      if (!address) {
        connect();
        return;
      }
      const tokenContract = token === TOKENS.SAVR ? savRToken : savToken;
      const allowance = await tokenContract.allowance(address, spender);

      const allowAmount = allow || ethers.constants.MaxUint256;

      if (allowance.lt(requiredAmount)) {
        const txHash = await tokenContract.approve(spender, BigNumber.from(allowAmount));
        success({ title: 'Approved', txHash });
      }
    }
  );

  return { savToken, savRToken, increaseAllowanceIfRequired };
};
