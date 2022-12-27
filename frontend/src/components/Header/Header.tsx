import React, { FC, useCallback } from 'react';
import {
  Box,
  Button,
  Circle,
  Container,
  Flex,
  IconButton,
  Image,
  useBreakpoint,
  useDisclosure,
} from '@chakra-ui/react';
import { useAccount, useDisconnect } from 'wagmi';

import { ReactComponent as BurgerIcon } from '@/assets/images/icons/burger.svg';
import Logo from '@/assets/images/logo.svg';
import { WalletMenu } from '@/components/Header/WalletMenu';
import { ReactComponent as ArrowIcon } from '@/components/Landing/images/arrow-right.svg';
import { Menu } from '@/components/Menu/Menu';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useLocalReferrer } from '@/hooks/useLocalReferrer';
import { useNavigateByHash } from '@/hooks/useNavigateByHash';
import { useReferralManager } from '@/hooks/useReferralManager';
import { useSquads } from '@/hooks/useSquads';
import { useStaking } from '@/hooks/useStaking';
import { APP_URL, LANDING_URL } from '@/router';

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
  const bp = useBreakpoint({ ssr: false });

  const hasNotification =
    isConnected &&
    (hasEndingSubscription || hasEndingReferralSubscription || hasEndingSquadsSubscription);

  const handleDisconnect = useCallback(() => {
    setLocalReferrer(undefined);
    disconnect();
    navigate('/');
  }, [setLocalReferrer, disconnect, navigate]);

  const navigateToApp = useCallback(() => {
    window.open(APP_URL, '_self');
  }, []);

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
              <ConnectWalletButton
                isSmall={['sm', 'md', 'lg'].includes(bp)}
                size={{ sm: 'md', '2xl': 'lg' }}
              />
            )
          ) : ['sm', 'md', 'lg'].includes(bp) ? (
            <IconButton
              size="md"
              variant="secondaryFilled"
              aria-label="Open app"
              icon={<ArrowIcon width="24px" />}
              onClick={navigateToApp}
              padding={{ sm: '0' }}
              border="none"
            />
          ) : (
            <Button
              variant="secondaryFilled"
              size={{ sm: 'md', '2xl': 'lg' }}
              width="220px"
              border="none"
              onClick={navigateToApp}
            >
              Dashboard
            </Button>
          )}

          {!isLandingView ? (
            <Box position="relative">
              <IconButton
                ml={{ sm: '10px', xl: '20px' }}
                size={{ sm: 'md', '2xl': 'lg' }}
                variant="secondaryFilled"
                aria-label="Burger menu"
                icon={<BurgerIcon width="24px" />}
                onClick={onOpen}
                padding={{ sm: '0' }}
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
