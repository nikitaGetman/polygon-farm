import React from 'react';

import { useAppStateContext } from '@/contexts/AppContext';
import { useSwitchNetworkToSupported } from '@/hooks/useSwitchNetworkToSupported';

import { ConnectWalletModal } from './ConnectWalletModal';

export const Modals = () => {
  const { state, closeConnectModal } = useAppStateContext();
  useSwitchNetworkToSupported();

  return (
    <ConnectWalletModal isOpen={state.isConnectWalletModalVisible} onClose={closeConnectModal} />
  );
};
