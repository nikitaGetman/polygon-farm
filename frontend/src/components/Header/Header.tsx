import React, { FC, useCallback } from 'react';
import { Box, Circle, Container, Flex, IconButton, Image, useDisclosure } from '@chakra-ui/react';
import { useAccount, useDisconnect } from 'wagmi';

import { ReactComponent as BurgerIcon } from '@/assets/images/icons/burger.svg';
import Logo from '@/assets/images/logo.svg';
import { WalletMenu } from '@/components/Header/WalletMenu';
import { Menu } from '@/components/Menu/Menu';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useLocalReferrer } from '@/hooks/useLocalReferrer';
import { useNavigateByHash } from '@/hooks/useNavigateByHash';
import { useReferralManager } from '@/hooks/useReferralManager';
import { useSquads } from '@/hooks/useSquads';
import { useStaking } from '@/hooks/useStaking';
import { LANDING_URL } from '@/router';

import './Header.scss';

type HeaderProps = {
  isLandingView?: boolean;
};
export const Header: FC<HeaderProps> = ({ isLandingView }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { setLocalReferrer } = useLocalReferrer();
  const { hasEndingSubscription } = useStaking();
  const { hasEndingReferralSubscription } = useReferralManager();
  const { hasEndingSquadsSubscription } = useSquads();
  const navigate = useNavigateByHash();

  const hasNotification =
    isConnected &&
    (hasEndingSubscription || hasEndingReferralSubscription || hasEndingSquadsSubscription);

  const handleDisconnect = useCallback(() => {
    setLocalReferrer(undefined);
    disconnect();
    navigate('/');
  }, [setLocalReferrer, disconnect, navigate]);

  return (
    <Box className="app-header" padding="13px 0">
      <Container variant="header">
        <Box
          as="a"
          onClick={() => (isLandingView ? navigate('/#top') : window.open(LANDING_URL, '_self'))}
        >
          <Image src={Logo} alt="Logo" height={{ sm: '40px', '2xl': 'unset' }} />
        </Box>

        <Flex>
          {!isLandingView ? (
            isConnected ? (
              <WalletMenu address={address} connector={connector} disconnect={handleDisconnect} />
            ) : (
              <ConnectWalletButton size={{ sm: 'md', '2xl': 'lg' }} />
            )
          ) : null}

          <Box position="relative">
            <IconButton
              ml={{ sm: '10px', xl: '20px' }}
              size={{ sm: 'md', '2xl': 'lg' }}
              variant="secondary"
              aria-label="Burger menu"
              icon={<BurgerIcon width="24px" />}
              onClick={onOpen}
              padding={{ sm: '0' }}
              _hover={{ bgColor: 'green.100' }}
            />
            {hasNotification ? (
              <Circle as="span" size="10px" bg="red" position="absolute" right="-2px" top="-2px" />
            ) : null}
          </Box>
        </Flex>
      </Container>

      <Menu isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};
