import { Chain, useNetwork } from 'wagmi';

import Contracts from '@/config/contracts.json';
import { ChainIDsEnum } from '@/config/index';

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

  //   TODO: fix TS return type
  let chainId = process.env.NODE_ENV === 'production' ? ChainIDsEnum.mumbai : ChainIDsEnum.hardhat;
  if (chain?.network === 'maticmum') {
    chainId = ChainIDsEnum.mumbai;
  }

  const contractData = chainId ? (Contracts as any)[chainId][0].contracts[contract] : null;

  return { ...contractData, chain };
};
