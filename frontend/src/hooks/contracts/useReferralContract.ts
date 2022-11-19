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

  const subscribeToLevel = async (level: number): Promise<string> => {
    const tx = await contract.subscribeToLevel(level);
    await tx.wait();
    return tx.hash;
  };

  const subscribeToAllLevels = async (): Promise<string> => {
    const tx = await contract.subscribeToAllLevels();
    await tx.wait();
    return tx.hash;
  };

  const setMyReferrer = async (referrer: string) => {
    const tx = await contract.setMyReferrer(referrer);
    await tx.wait();
    return tx.hash;
  };

  return {
    contract,
    address: contractAddress,
    getUserInfo,
    subscribeToLevel,
    subscribeToAllLevels,
    setMyReferrer,
  };
};
