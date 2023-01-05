import { Chain, useNetwork } from 'wagmi';

import Contracts from '@/config/contracts.json';

import { useChainId } from './useChainId';

export enum ContractsEnum {
  'SAV' = 'Token1',
  'SAVR' = 'Token2',
  'Staking' = 'Staking',
  'ReferralManager' = 'ReferralManager',
  'Squads' = 'Squads',
  'Helper' = 'Helper',
  'VendorSell' = 'VendorSell',
  'Lottery' = 'Lottery',
  'Ticket' = 'Ticket',
  'TokenVesting' = 'TokenVesting',
}

type ContractAbi = {
  address: `0x${string}`;
  abi: any;
};

export const useContractAbi = ({
  contract,
}: {
  contract: ContractsEnum;
}): ContractAbi & { chain: Chain } => {
  const { chain } = useNetwork();

  const chainId = useChainId();

  //   TODO: fix TS return type
  const contractData = (Contracts as any)[chainId][0].contracts[contract];

  return { ...contractData, chain };
};
