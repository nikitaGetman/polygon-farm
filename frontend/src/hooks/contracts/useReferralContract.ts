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

  return {
    contract,
    address: contractAddress,
    getUserInfo,
  };
};
