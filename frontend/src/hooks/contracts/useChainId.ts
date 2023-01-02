import { useNetwork } from 'wagmi';

import { ChainIDsEnum } from '@/config/index';

export const useChainId = () => {
  const { chain } = useNetwork();

  let chainId = process.env.NODE_ENV === 'production' ? ChainIDsEnum.mumbai : ChainIDsEnum.hardhat;
  if (chain?.network === 'maticmum') {
    chainId = ChainIDsEnum.mumbai;
  }

  return chainId;
};
