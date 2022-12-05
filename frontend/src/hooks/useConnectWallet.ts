import { useCallback } from 'react';

import { useAppStateContext } from '@/contexts/AppContext';

export const useConnectWallet = () => {
  const { openConnectModal } = useAppStateContext();

  const handleConnect = useCallback(() => openConnectModal(), [openConnectModal]);

  return { connect: handleConnect };
};
