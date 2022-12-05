import React from 'react';
import { Button } from '@chakra-ui/react';

import { useConnectWallet } from '@/hooks/useConnectWallet';

export const ConnectWalletButton = () => {
  const { connect } = useConnectWallet();

  return <Button onClick={() => connect()}>Connect wallet</Button>;
};
