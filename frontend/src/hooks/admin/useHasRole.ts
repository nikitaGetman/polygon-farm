import { useQuery } from '@tanstack/react-query';
import { useAccount, useContract, useProvider, useSigner } from 'wagmi';

import { AccessControl } from '@/types';

import { ContractsEnum, useContractAbi } from '../contracts/useContractAbi';

const HAS_ROLE_REQUEST = 'has-role-request';
const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';

export const useHasRole = (contractName: Exclude<ContractsEnum, ContractsEnum.Helper>) => {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: contractName,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as AccessControl;

  return useQuery(
    [HAS_ROLE_REQUEST, { contractName, address }],
    () => contract && address && contract.hasRole(DEFAULT_ADMIN_ROLE, address),
    {
      enabled: isConnected,
    }
  );
};
