import React, { useCallback } from 'react';
import {
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Text,
  Link,
  Box,
  Flex,
  Divider,
  Circle,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as CrossIcon } from '@/assets/images/icons/cross.svg';
import { ReactComponent as HouseIcon } from '@/assets/images/icons/house.svg';
import { ReactComponent as GraphIcon } from '@/assets/images/icons/graph.svg';
import { ReactComponent as StarsIcon } from '@/assets/images/icons/stars.svg';
import { ReactComponent as GameboyIcon } from '@/assets/images/icons/gameboy.svg';
import { ReactComponent as RocketIcon } from '@/assets/images/icons/rocket.svg';
import { ReactComponent as WalletIcon } from '@/assets/images/icons/wallet.svg';
import { ReactComponent as TabletIcon } from '@/assets/images/icons/tablet.svg';
import { useStaking } from '@/hooks/useStaking';
import { useReferralManager } from '@/hooks/useReferralManager';

export const Menu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { hasEndingSubscription } = useStaking();
  const { hasEndingReferralSubscription } = useReferralManager();
  const navigate = useNavigate();

  const handleNavigate = useCallback(
    (to: string) => {
      navigate(to);
      onClose();
    },
    [navigate, onClose]
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="lg">
      <DrawerOverlay backdropFilter="blur(4.5px)" background="rgba(13, 35, 16, 0.5)" />
      <DrawerContent
        boxShadow="0px 6px 20px rgba(0, 0, 0, 0.25)"
        background="linear-gradient(96.85deg, rgba(35, 157, 113, 0.5) -8.44%, rgba(35, 54, 72, 0.5) 102.66%)"
        backdropFilter="blur(22.5px)"
      >
        <DrawerHeader p="30px 30px" display="flex" justifyContent="space-between">
          <Text textStyle="h2" textTransform="uppercase">
            Menu
          </Text>
          <IconButton
            variant="secondary"
            aria-label="Close burger menu"
            icon={<CrossIcon />}
            onClick={onClose}
            padding="6px"
          />
        </DrawerHeader>

        <DrawerBody>
          <NavMenuItem text="Home" icon={<HouseIcon />} onClick={() => handleNavigate('/')} />
          <NavMenuItem
            text="Staking"
            onClick={() => handleNavigate('/staking')}
            icon={<GraphIcon />}
            hasAlert={hasEndingSubscription}
            textAlert={hasEndingSubscription ? 'Check your subscription!' : undefined}
          />
          <NavMenuItem
            text="Team"
            icon={<StarsIcon />}
            onClick={() => handleNavigate('/team')}
            hasAlert={hasEndingReferralSubscription}
            textAlert={hasEndingReferralSubscription ? 'Check your levels' : undefined}
          />
          <NavMenuItem text="Play everyday" icon={<GameboyIcon />} />
          <NavMenuItem
            text="Lottery"
            icon={<RocketIcon />}
            onClick={() => handleNavigate('/lottery')}
          />
          <Divider mb="30px" borderBottomWidth="2px" borderColor="white" />
          <NavMenuItem text="Buy token" icon={<WalletIcon />} />
          <NavMenuItem text="Whitepaper" icon={<TabletIcon />} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

const NavMenuItem = ({
  text,
  icon,
  hasAlert,
  textAlert,
  disabled,
  subtitle,
  onClick,
}: {
  text: string;
  textAlert?: string;
  subtitle?: string;
  icon: any;
  hasAlert?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => (
  <>
    <Link
      display="flex"
      w="100%"
      alignItems="center"
      mb="30px"
      onClick={onClick}
      _hover={{ color: 'green.400' }}
    >
      <Box
        w="8"
        h="8"
        display="flex"
        alignItems="center"
        justifyContent="center"
        color={disabled ? 'gray' : 'green.400'}
      >
        {icon}
      </Box>
      <Flex ml={5} color={disabled ? 'gray' : 'inherit'}>
        <Flex direction="column">
          <Flex alignItems="center">
            <Text as="span" position="relative" textStyle="menuDefault">
              {text}
              {hasAlert && (
                <Circle
                  as="span"
                  size="10px"
                  bg="red"
                  position="absolute"
                  right="-10px"
                  top="-3px"
                />
              )}
            </Text>
            {textAlert && (
              <Text color="red" ml="25px" position="relative" textStyle="textBold">
                {textAlert}
              </Text>
            )}
          </Flex>
          {subtitle && <Text textStyle="text1">{subtitle}</Text>}
        </Flex>
      </Flex>
    </Link>
  </>
);
