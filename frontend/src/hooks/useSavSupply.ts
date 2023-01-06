import { useMemo } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';

import { useAccounts } from './admin/useAccounts';
import { useContractsAddresses } from './admin/useContractsAddresses';
import { ContractsEnum } from './contracts/useContractAbi';
import { useTokenContract } from './contracts/useTokenContract';

export const useSavSupply = () => {
  const savContract = useTokenContract(ContractsEnum.SAV);

  const accounts = useAccounts();
  const contracts = useContractsAddresses();

  const totalSupply = useQuery(['sav-total-supply-query'], () => savContract.totalSupply());

  const balances = useQueries({
    queries: [...Object.values(accounts), ...Object.values(contracts)].map((address) => ({
      queryKey: ['circulating-supply', address],
      queryFn: () => savContract.balanceOf(address),
    })),
  });

  const circulatingSupply = useMemo(() => {
    if (!totalSupply.data) return 0;
    return balances.reduce((sum, balanceRequest) => {
      if (balanceRequest.data) return sum.sub(balanceRequest.data);
      return sum;
    }, totalSupply.data);
  }, [totalSupply.data, balances]);

  return { totalSupply: totalSupply.data || 0, circulatingSupply };
};
