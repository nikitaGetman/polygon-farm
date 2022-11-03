import { useQuery } from '@tanstack/react-query';
import { useStakingContract } from './contracts/useStakingContract';

export const useStakingInfo = () => {
  const contract = useStakingContract();

  return useQuery(
    ['staking-info'],
    async () => {
      return await contract.getContractInfo();
    },
    {}
  );
};
