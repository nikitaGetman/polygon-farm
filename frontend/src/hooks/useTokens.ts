import { tryToGetErrorData } from '@/utils/error';
import { useMutation } from '@tanstack/react-query';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { ContractsEnum } from './contracts/useContractAbi';
import { useTokenContract } from './contracts/useTokenContract';
import { useNotification } from './useNotification';

export enum TOKENS {
  SAV = 'SAV',
  SAVR = 'SAVR',
}

const INCREASE_TOKEN_ALLOWANCE_MUTATION = 'increase-allowance';
export const useTokens = () => {
  const savToken = useTokenContract(ContractsEnum.SAV);
  const savRToken = useTokenContract(ContractsEnum.SAVR);
  const { success, error } = useNotification();

  const increaseAllowanceIfRequired = useMutation(
    [INCREASE_TOKEN_ALLOWANCE_MUTATION],
    async ({
      token,
      owner,
      spender,
      requiredAmount,
      allow,
    }: {
      token: TOKENS;
      owner: string;
      spender: string;
      requiredAmount: BigNumberish;
      allow?: BigNumberish;
    }) => {
      const tokenContract = token === TOKENS.SAVR ? savRToken : savToken;
      const allowance = await tokenContract.allowance(owner, spender);

      const allowAmount = allow || ethers.constants.MaxUint256;

      if (allowance.lt(requiredAmount)) {
        const txHash = await tokenContract.approve(spender, BigNumber.from(allowAmount));
        success({ title: 'Approved!', txHash });
      }
    },
    {
      onError: (err) => {
        const errData = tryToGetErrorData(err);
        error(errData);
      },
    }
  );

  return { savToken, savRToken, increaseAllowanceIfRequired };
};
