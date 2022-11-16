import { ReferralManager } from '@/types';
import { useContract, useProvider, useSigner } from 'wagmi';
import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useReferralContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.ReferralManager,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as ReferralManager;

  const getUserInfo = async (address: string) => {
    return contract.getUserInfo(address);
  };

  const subscribeToLevel = async (level: number) => {
    const tx = await contract.subscribeToLevel(level);
    await tx.wait();
  };

  const subscribeToAllLevels = async () => {
    const tx = await contract.subscribeToAllLevels();
    await tx.wait();
  };

  return {
    contract,
    address: contractAddress,
    getUserInfo,
    subscribeToLevel,
    subscribeToAllLevels,
  };
};
