import { useMemo } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';

import { useAccounts } from './admin/useAccounts';
import { useContractsAddresses } from './admin/useContractsAddresses';
import { ContractsEnum } from './contracts/useContractAbi';
import { useTokenContract } from './contracts/useTokenContract';

export const useTokenSupply = (token: ContractsEnum.SAV | ContractsEnum.SAVR) => {
  const tokenContract = useTokenContract(token);

  const accounts = useAccounts();
  const contracts = useContractsAddresses();

  const totalSupply = useQuery(['token-total-supply-query', { token }], () =>
    tokenContract.totalSupply()
  );

  const uniqueAddresses = useMemo(() => {
    return Array.from(new Set([...Object.values(accounts), ...Object.values(contracts)]));
  }, [accounts, contracts]);

  const balances = useQueries({
    queries: uniqueAddresses.map((address) => ({
      queryKey: ['circulating-supply', token, address],
      queryFn: () => tokenContract.balanceOf(address),
    })),
  });

  const circulatingSupply = useMemo(() => {
    if (!totalSupply.data) return BigNumber.from(0);
    return balances.reduce((sum, balanceRequest) => {
      if (balanceRequest.data) return sum.sub(balanceRequest.data);
      return sum;
    }, totalSupply.data);
  }, [totalSupply.data, balances]);

  return { totalSupply: totalSupply.data || BigNumber.from(0), circulatingSupply };
};
