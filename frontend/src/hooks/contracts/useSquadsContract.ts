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

  const getUserSquadsInfo = async (address: string) => {
    const res = await contract.getUserSquadsInfo(address);
    return res.map(({ plan, squadStatus, members }) => ({
      plan: { ...plan },
      squadStatus: { ...squadStatus },
      members,
    }));
  };

  const subscribe = async (planId: number) => {
    const tx = await contract.subscribe(planId);
    await tx.wait();
    return tx.hash;
  };

  return {
    contract,
    address: contractAddress,
    getUserSquadsInfo,
    subscribe,
  };
};
