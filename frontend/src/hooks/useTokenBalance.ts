import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useSavContract } from './contracts/useSavContract';
import { useSavRContract } from './contracts/useSavRContract';

export const SAV_BALANCE_REQUEST = 'token-balance-sav';
export const useSavBalance = () => {
  const savContract = useSavContract();
  const { address } = useAccount();

  return useQuery([SAV_BALANCE_REQUEST, { address }], async () => {
    return await savContract.getUserBalance();
  });
};

export const SAVR_BALANCE_REQUEST = 'token-balance-savr';
export const useSavRBalance = () => {
  const savrContract = useSavRContract();
  const { address } = useAccount();

  return useQuery([SAVR_BALANCE_REQUEST, { address }], async () => {
    return await savrContract.getUserBalance();
  });
};
