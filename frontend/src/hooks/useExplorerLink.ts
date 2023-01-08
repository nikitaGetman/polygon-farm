import { useMemo } from 'react';
import { useNetwork } from 'wagmi';
import { polygon } from 'wagmi/chains';

export const useExplorerLink = (hash?: string, isAddress?: boolean) => {
  const { chain: currentChain } = useNetwork();

  return useMemo(() => {
    if (!hash) return '';

    const type = isAddress ? 'address' : 'tx';

    if (currentChain?.id === polygon.id) {
      return `https://polygonscan.com/${type}/${hash}`;
    }

    return `https://mumbai.polygonscan.com/${type}/${hash}`;
  }, [hash, currentChain, isAddress]);
};
