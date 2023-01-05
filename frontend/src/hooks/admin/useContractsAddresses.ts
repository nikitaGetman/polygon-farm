import Contracts from '@/config/contracts.json';
import { ContractsEnum } from '@/hooks/contracts/useContractAbi';

import { useChainId } from '../contracts/useChainId';

export const useContractsAddresses = () => {
  let chainId = useChainId();

  const { contracts } = (Contracts as any)[chainId][0];

  const data = Object.entries(contracts).reduce((acc, [key, value]) => {
    acc[key as ContractsEnum] = (value as any).address;
    return acc;
  }, {} as Record<ContractsEnum, string>);

  return data;
};
