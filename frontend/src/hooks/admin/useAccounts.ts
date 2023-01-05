import { useNetwork } from 'wagmi';

import AccountsLocalhost from '@/config/accounts_hardhat.json';
import AccountsMumbai from '@/config/accounts_mumbai.json';
// import AccountsPolygon from '@/config/accounts_polygon.json';

export const useAccounts = () => {
  const { chain } = useNetwork();

  if (chain?.id === 31337) {
    return AccountsLocalhost;
  }

  return AccountsMumbai;
};
