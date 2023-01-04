import { useQuery } from '@tanstack/react-query';
import { utils } from 'ethers';
import { useAccount, useContract, useProvider, useSigner } from 'wagmi';

import { AccessControl } from '@/types';

import { ContractsEnum, useContractAbi } from '../contracts/useContractAbi';

const HAS_ROLE_REQUEST = 'has-role-request';

type Role = 'admin' | 'operator';

const ROLES: Record<Role, string> = {
  admin: '0x0000000000000000000000000000000000000000000000000000000000000000',
  operator: utils.keccak256(utils.toUtf8Bytes('OPERATOR_ROLE')),
};

export const useHasRole = (
  contractName: Exclude<ContractsEnum, ContractsEnum.Helper>,
  requiredRole: Role = 'admin'
) => {
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

  const role = ROLES[requiredRole];

  return useQuery(
    [HAS_ROLE_REQUEST, { contractName, address }],
    () => contract && address && contract.hasRole(role, address),
    {
      enabled: isConnected,
    }
  );
};
