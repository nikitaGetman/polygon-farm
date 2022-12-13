import React, { FC, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Circle, Container, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { useAccount, useDisconnect } from 'wagmi';

import { ReactComponent as BurgerIcon } from '@/assets/images/icons/burger.svg';
import Logo from '@/assets/images/logo.svg';
import LogoSmall from '@/assets/images/logo_small.svg';
import { WalletMenu } from '@/components/Header/WalletMenu';
import { Menu } from '@/components/Menu/Menu';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useLocalReferrer } from '@/hooks/useLocalReferrer';
import { useReferralManager } from '@/hooks/useReferralManager';
import { useSquads } from '@/hooks/useSquads';
import { useStaking } from '@/hooks/useStaking';

import './Header.scss';

type HeaderProps = {
  isLandingView?: boolean;
};
export const Header: FC<HeaderProps> = ({ isLandingView }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const { setLocalReferrer } = useLocalReferrer();
  const { hasEndingSubscription } = useStaking();
  const { hasEndingReferralSubscription } = useReferralManager();
  const { hasEndingSquadsSubscription } = useSquads();

  const hasNotification =
    isConnected &&
    (hasEndingSubscription || hasEndingReferralSubscription || hasEndingSquadsSubscription);

  const handleDisconnect = useCallback(() => {
    setLocalReferrer(undefined);
    disconnect();
    navigate('/');
  }, [setLocalReferrer, disconnect, navigate]);

  return (
    <Box className="app-header" padding={isLandingView ? '18px 0' : '13px 0'}>
      <Container variant="header">
        <Link to="/">
          <img src={isLandingView ? LogoSmall : Logo} alt="Logo" />
        </Link>

        <Flex>
          {isLandingView ? (
            <Button as="a" mr="20px" variant="secondary" href="https://app.isaver.io">
              Dashboard
            </Button>
          ) : null}

          {isConnected ? (
            <WalletMenu address={address} connector={connector} disconnect={handleDisconnect} />
          ) : (
            <ConnectWalletButton />
          )}

          {!isLandingView ? (
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
                <Circle
                  as="span"
                  size="10px"
                  bg="red"
                  position="absolute"
                  right="-2px"
                  top="-2px"
                />
              ) : null}
            </Box>
          ) : null}
        </Flex>
      </Container>

      <Menu isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};
