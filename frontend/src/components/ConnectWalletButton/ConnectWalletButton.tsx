import React from 'react';
import { useConnect, useAccount } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button } from '@chakra-ui/react';

export const ConnectWalletButton = () => {
  const { isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  // TODO: add toast for info and edge cases
  return <Button onClick={() => !isConnected && connect()}>Connect wallet</Button>;
};
