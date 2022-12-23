import React from 'react';
import { Button, ButtonProps, IconButton } from '@chakra-ui/react';

import { ReactComponent as WalletIcon } from '@/assets/images/icons/wallet_filled.svg';
import { useConnectWallet } from '@/hooks/useConnectWallet';

type ConnectWalletButtonProps = {
  isSmall?: boolean;
};
export const ConnectWalletButton = (props: ButtonProps & ConnectWalletButtonProps) => {
  const { connect } = useConnectWallet();

  if (props.isSmall) {
    return (
      <IconButton
        {...props}
        aria-label="Connect wallet"
        icon={<WalletIcon width="20px" />}
        padding={{ sm: '0' }}
        onClick={() => connect()}
      />
    );
  }

  return (
    <Button {...props} onClick={() => connect()}>
      Connect wallet
    </Button>
  );
};
