import React from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Box, Circle, Container, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { Menu } from '@/components/Menu/Menu';
import { ReactComponent as BurgerIcon } from '@/assets/images/icons/burger.svg';
import { WalletMenu } from '@/components/Header/WalletMenu';
import Logo from '@/assets/images/logo.svg';
import './Header.scss';
import { useStaking } from '@/hooks/useStaking';
import { useReferralManager } from '@/hooks/useReferralManager';

export const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { hasEndingSubscription } = useStaking();
  const { hasEndingReferralSubscription } = useReferralManager();

  const hasNotification = hasEndingSubscription || hasEndingReferralSubscription;

  return (
    <div className="app-header">
      <Container variant="header">
        <div className="app-header__logo">
          <img src={Logo} alt="Logo" />
        </div>

        <Flex>
          {isConnected ? (
            <WalletMenu address={address} connector={connector} disconnect={disconnect} />
          ) : (
            <ConnectWalletButton />
          )}

          <Box position="relative">
            <IconButton
              ml={5}
              variant="secondary"
              aria-label="Burger menu"
              icon={<BurgerIcon />}
              onClick={onOpen}
              padding="7px"
            />
            {hasNotification ? (
              <Circle as="span" size="10px" bg="red" position="absolute" right="-2px" top="-2px" />
            ) : null}
          </Box>
        </Flex>
      </Container>

      <Menu isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
