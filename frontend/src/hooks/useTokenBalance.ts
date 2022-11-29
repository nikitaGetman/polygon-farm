import { getBalanceHistoryFromTransfers } from '@/utils/balance';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { ContractsEnum } from './contracts/useContractAbi';
import { useTokenContract } from './contracts/useTokenContract';
import { useUsdtTokenContract } from './contracts/useUsdtTokenContract';

export const SAV_BALANCE_REQUEST = 'token-balance-sav';
export const useSavBalance = () => {
  const savContract = useTokenContract(ContractsEnum.SAV);
  const { address } = useAccount();

  return useQuery([SAV_BALANCE_REQUEST, { address }], async () => {
    return address ? await savContract.balanceOf(address) : null;
  });
};

export const SAVR_BALANCE_REQUEST = 'token-balance-savr';
export const useSavRBalance = () => {
  const savrContract = useTokenContract(ContractsEnum.SAVR);
  const { address } = useAccount();

  return useQuery([SAVR_BALANCE_REQUEST, { address }], async () => {
    return address ? await savrContract.balanceOf(address) : null;
  });
};

export const USDT_BALANCE_REQUEST = 'token-balance-usdt';
export const useUsdtBalance = () => {
  const usdtContract = useUsdtTokenContract();
  const { address } = useAccount();

  return useQuery([SAVR_BALANCE_REQUEST, { address }], async () => {
    return address ? await usdtContract.balanceOf(address) : null;
  });
};

export const BALANCE_HISTORY_REQUEST = 'token-balance-history';
export const useTokenBalanceHistory = () => {
  const savContract = useTokenContract(ContractsEnum.SAV);
  const savrContract = useTokenContract(ContractsEnum.SAVR);
  const { address } = useAccount();

  return useQuery(
    [SAV_BALANCE_REQUEST, SAVR_BALANCE_REQUEST, BALANCE_HISTORY_REQUEST, { address }],
    async () => {
      if (!address) return null;

      const transfers = await Promise.all([
        savContract.getBalanceHistoryTransfers(address),
        savrContract.getBalanceHistoryTransfers(address),
      ]);

      const balanceHistory = getBalanceHistoryFromTransfers(transfers[0], transfers[1], address);

      return balanceHistory;
    }
  );
};
