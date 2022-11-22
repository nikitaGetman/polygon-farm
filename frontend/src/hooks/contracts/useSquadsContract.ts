import { Squads } from '@/types';
import { useContract, useProvider, useSigner } from 'wagmi';
import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useSquadsContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.Squads,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as Squads;

  const getPlans = async () => {
    return await contract.getPlans();
  };

  const subscribe = async (planId: number) => {
    const tx = await contract.subscribe(planId);
    await tx.wait();
    return tx.hash;
  };

  return {
    contract,
    address: contractAddress,
    subscribe,
    getPlans,
  };
};
