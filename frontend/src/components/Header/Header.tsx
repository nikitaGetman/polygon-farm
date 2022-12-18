import React, { FC, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowForwardIcon } from '@chakra-ui/icons';
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
import LogoSmall from '@/assets/images/logo_small.svg';
import { WalletMenu } from '@/components/Header/WalletMenu';
import { Menu } from '@/components/Menu/Menu';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useConnectWallet } from '@/hooks/useConnectWallet';
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
  const { connect } = useConnectWallet();
  const navigate = useNavigate();
  const { setLocalReferrer } = useLocalReferrer();
  const { hasEndingSubscription } = useStaking();
  const { hasEndingReferralSubscription } = useReferralManager();
  const { hasEndingSquadsSubscription } = useSquads();
  const bp = useBreakpoint({ ssr: false });

  const isSm = ['sm', 'md', 'lg'].includes(bp);

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
          <Image
            src={isLandingView ? LogoSmall : Logo}
            alt="Logo"
            height={{ sm: '40px', '2xl': 'unset' }}
          />
        </Link>

        <Flex>
          {isLandingView ? (
            <Button
              as="a"
              mr="20px"
              variant="secondary"
              href="https://app.isaver.io"
              size={{ sm: 'md', '2xl': 'lg' }}
            >
              Dashboard
            </Button>
          ) : null}

          {isConnected ? (
            <WalletMenu address={address} connector={connector} disconnect={handleDisconnect} />
          ) : isSm ? (
            <IconButton
              aria-label="Connect wallet"
              icon={<ArrowForwardIcon />}
              onClick={connect}
              size="md"
            />
          ) : (
            <ConnectWalletButton size={{ sm: 'md', '2xl': 'lg' }} />
          )}

          {!isLandingView ? (
            <Box position="relative">
              <IconButton
                ml={{ sm: '10px', xl: '20px' }}
                size={{ sm: 'md', '2xl': 'lg' }}
                variant="secondary"
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
