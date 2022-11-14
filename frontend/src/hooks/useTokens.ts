import { useMutation } from '@tanstack/react-query';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useSavContract } from './contracts/useSavContract';
import { useSavRContract } from './contracts/useSavRContract';
import { useNotification } from './useNotification';

export enum TOKENS {
  SAV = 'SAV',
  SAVR = 'SAVR',
}

const INCREASE_TOKEN_ALLOWANCE_MUTATION = 'increase-allowance';
export const useTokens = () => {
  const savToken = useSavContract();
  const savRToken = useSavRContract();
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
        await tokenContract.approve(spender, BigNumber.from(allowAmount));
        success('Approved!');
      }
    },
    {
      onError: () => {
        error('Something went wrong!');
      },
    }
  );

  return { savToken, savRToken, increaseAllowanceIfRequired };
};
