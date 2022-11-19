import { Helper } from '@/types';
import { useContract, useProvider, useSigner } from 'wagmi';
import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useHelperContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.Helper,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as Helper;

  const getReferralsFullInfoByLevel = async (user: string, level: number) => {
    const res = await contract.getUserReferralsFullInfoByLevel(user, level);
    return res.map((r) => ({ ...r }));
  };

  return {
    contract,
    address: contractAddress,
    getReferralsFullInfoByLevel,
  };
};
