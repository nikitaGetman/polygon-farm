import React from 'react';
import { Button, ButtonProps } from '@chakra-ui/react';

import { useConnectWallet } from '@/hooks/useConnectWallet';

export const ConnectWalletButton = (props: ButtonProps) => {
  const { connect } = useConnectWallet();

  return (
    <Button {...props} onClick={() => connect()}>
      Connect wallet
    </Button>
  );
};
