import React, { useCallback } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Box, Circle, Container, Flex, IconButton, useDisclosure } from '@chakra-ui/react';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { Menu } from '@/components/Menu/Menu';
import { ReactComponent as BurgerIcon } from '@/assets/images/icons/burger.svg';
import { WalletMenu } from '@/components/Header/WalletMenu';
import Logo from '@/assets/images/logo.svg';
import { useStaking } from '@/hooks/useStaking';
import { useReferralManager } from '@/hooks/useReferralManager';
import { useLocalReferrer } from '@/hooks/useLocalReferrer';
import { useNavigate } from 'react-router-dom';
import { useSquads } from '@/hooks/useSquads';
import './Header.scss';

export const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();
  const { setLocalReferrer } = useLocalReferrer();
  const { hasEndingSubscription } = useStaking();
  const { hasEndingReferralSubscription } = useReferralManager();
  const { hasEndingSquadsSubscription } = useSquads();

  const hasNotification =
    hasEndingSubscription || hasEndingReferralSubscription || hasEndingSquadsSubscription;

  const handleDisconnect = useCallback(() => {
    setLocalReferrer(undefined);
    disconnect();
    navigate('/');
  }, [setLocalReferrer, disconnect, navigate]);

  return (
    <div className="app-header">
      <Container variant="header">
        <div className="app-header__logo">
          <img src={Logo} alt="Logo" />
        </div>

        <Flex>
          {isConnected ? (
            <WalletMenu address={address} connector={connector} disconnect={handleDisconnect} />
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
