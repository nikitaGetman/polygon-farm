import React from 'react';
import { useAppStateContext } from '@/contexts/AppContext';
import { ConnectWalletModal } from './ConnectWalletModal';
import { useSwitchNetworkToSupported } from '@/hooks/useSwitchNetworkToSupported';

export const Modals = () => {
  const { state, closeConnectModal } = useAppStateContext();
  useSwitchNetworkToSupported();

  return (
    <ConnectWalletModal isOpen={state.isConnectWalletModalVisible} onClose={closeConnectModal} />
  );
};
