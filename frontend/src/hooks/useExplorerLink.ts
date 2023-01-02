import { useMemo } from 'react';
import { chain, useNetwork } from 'wagmi';

export const useExplorerLink = (hash?: string) => {
  const { chain: currentChain } = useNetwork();

  return useMemo(() => {
    if (!hash) return '';

    if (currentChain?.id === chain.polygon.id) {
      return `https://polygonscan.com/tx/${hash}`;
    }

    return `https://mumbai.polygonscan.com/tx/${hash}`;
  }, [hash, currentChain]);
};
