import { useAppStateContext } from '@/contexts/AppContext';
import { useCallback } from 'react';

export const useConnectWallet = () => {
  const { openConnectModal } = useAppStateContext();

  const handleConnect = useCallback(() => openConnectModal(), [openConnectModal]);

  return { connect: handleConnect };
};
