import React from 'react';
import { useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button } from '@chakra-ui/react';

export const ConnectWalletButton = () => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  return <Button onClick={() => connect()}>Connect wallet</Button>;
};
