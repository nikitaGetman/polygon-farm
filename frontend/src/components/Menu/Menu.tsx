import React, { useCallback } from 'react';
import {
  Box,
  Circle,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Link,
  Text,
} from '@chakra-ui/react';

import { ReactComponent as CrossIcon } from '@/assets/images/icons/cross.svg';
import { ReactComponent as GameboyIcon } from '@/assets/images/icons/gameboy.svg';
import { ReactComponent as GraphIcon } from '@/assets/images/icons/graph.svg';
import { ReactComponent as HouseIcon } from '@/assets/images/icons/house.svg';
import { ReactComponent as RocketIcon } from '@/assets/images/icons/rocket.svg';
import { ReactComponent as StarsIcon } from '@/assets/images/icons/stars.svg';
import { ReactComponent as TabletIcon } from '@/assets/images/icons/tablet.svg';
import { ReactComponent as WalletIcon } from '@/assets/images/icons/wallet.svg';
import { useNavigateByHash } from '@/hooks/useNavigateByHash';
import { useReferralManager } from '@/hooks/useReferralManager';
import { useSquads } from '@/hooks/useSquads';
import { useStaking } from '@/hooks/useStaking';

export const Menu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { hasEndingSubscription } = useStaking();
  const { hasEndingReferralSubscription } = useReferralManager();
  const { hasEndingSquadsSubscription } = useSquads();
  const navigate = useNavigateByHash();

  const handleNavigate = useCallback(
    (to: string) => {
      navigate(to);
      onClose();
    },
    [navigate, onClose]
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} size="lg">
      <DrawerOverlay background="rgba(13, 35, 16, 0.5)" />
      <DrawerContent
        boxShadow="0px 6px 20px rgba(0, 0, 0, 0.25)"
        background="linear-gradient(96.85deg, #1a7b58 -8.44%, #1b3339 100%)"
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
            hasAlert={hasEndingReferralSubscription || hasEndingSquadsSubscription}
            textAlert={
              hasEndingReferralSubscription
                ? 'Check your levels'
                : hasEndingSquadsSubscription
                ? 'Check your squads'
                : undefined
            }
          />
          <NavMenuItem
            text="Play everyday"
            onClick={() => handleNavigate('/#claim-ticket')}
            icon={<GameboyIcon />}
          />
          <NavMenuItem
            text="Raffles"
            icon={<RocketIcon />}
            onClick={() => handleNavigate('/#raffles')}
          />
          <Divider mb="30px" borderBottomWidth="2px" borderColor="white" />
          <NavMenuItem
            text="Buy SAV"
            icon={<WalletIcon />}
            onClick={() => handleNavigate('/exchange')}
          />
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
              {hasAlert ? (
                <Circle
                  as="span"
                  size="10px"
                  bg="red"
                  position="absolute"
                  right="-10px"
                  top="-3px"
                />
              ) : null}
            </Text>
            {textAlert ? (
              <Text color="red" ml="25px" position="relative" textStyle="textBold">
                {textAlert}
              </Text>
            ) : null}
          </Flex>
          {subtitle ? <Text textStyle="text1">{subtitle}</Text> : null}
        </Flex>
      </Flex>
    </Link>
  </>
);
