import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useSavContract } from './contracts/useSavContract';
import { useSavRContract } from './contracts/useSavRContract';

export const useSavBalance = () => {
  const savContract = useSavContract();
  const { address } = useAccount();

  return useQuery(
    ['token-balance-sav', { address }],
    async () => {
      return await savContract.getUserBalance();
    },
    {}
  );
};

export const useSavRBalance = () => {
  const savrContract = useSavRContract();
  const { address } = useAccount();

  return useQuery(
    ['token-balance-savr', { address }],
    async () => {
      return await savrContract.getUserBalance();
    },
    {}
  );
};
