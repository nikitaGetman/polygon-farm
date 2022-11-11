import { Chain, useNetwork } from 'wagmi';
import { ChainIDsEnum } from '@/config/index';
import Contracts from '@/config/contracts.json';

export enum ContractsEnum {
  'SAV' = 'Token1',
  'SAVR' = 'Token2',
  'Staking' = 'Staking',
  'ReferralManager' = 'ReferralManager',
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
  let chainId = ChainIDsEnum.hardhat; // default is hardhat chain ID
  if (chain?.network === 'maticmum') {
    chainId = ChainIDsEnum.mumbai;
  }

  const contractData = chainId ? (Contracts as any)[chainId][0].contracts[contract] : null;

  return { ...contractData, chain };
};
