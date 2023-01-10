import { useNetwork } from 'wagmi';

import AccountsLocalhost from '@/config/accounts_hardhat.json';
import AccountsMainnet from '@/config/accounts_mainnet.json';
import AccountsMumbai from '@/config/accounts_mumbai.json';

export const useAccounts = () => {
  const { chain } = useNetwork();

  if (chain?.id === 137 || process.env.NODE_ENV === 'production') {
    return AccountsMainnet;
  }
  if (chain?.id === 31337) {
    return AccountsLocalhost;
  }

  return AccountsMumbai;
};
