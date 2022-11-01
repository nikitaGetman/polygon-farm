import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Container, IconButton, useDisclosure } from '@chakra-ui/react';
import { ConnectWalletButton } from '@/components/ConnectWalletButton/ConnectWalletButton';
import { Menu } from '@/components/Menu/Menu';
import { ReactComponent as BurgerIcon } from '@/assets/images/icons/burger.svg';
import { WalletMenu } from '@/components/WalletMenu/WalletMenu';
import Logo from '@/assets/images/logo.svg';
import './Header.scss';

export const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div className="app-header">
      <Container variant="header">
        <div className="app-header__logo">
          <img src={Logo} alt="Logo" />
        </div>

        <div className="app-header__buttons">
          {isConnected ? (
            <WalletMenu address={address} connector={connector} disconnect={disconnect} />
          ) : (
            <ConnectWalletButton />
          )}

          <IconButton
            ml={5}
            variant="secondary"
            aria-label="Burger menu"
            icon={<BurgerIcon />}
            onClick={onOpen}
            padding="7px"
          />
        </div>
      </Container>

      <Menu isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
