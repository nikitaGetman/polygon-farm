import React from 'react';
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
  Divider,
  Circle,
} from '@chakra-ui/react';
import { ReactComponent as CrossIcon } from '@/assets/images/icons/cross.svg';
import { ReactComponent as HouseIcon } from '@/assets/images/icons/house.svg';
import { ReactComponent as GraphIcon } from '@/assets/images/icons/graph.svg';
import { ReactComponent as StarsIcon } from '@/assets/images/icons/stars.svg';
import { ReactComponent as GameboyIcon } from '@/assets/images/icons/gameboy.svg';
import { ReactComponent as RocketIcon } from '@/assets/images/icons/rocket.svg';
import { ReactComponent as WalletIcon } from '@/assets/images/icons/wallet.svg';
import { ReactComponent as TabletIcon } from '@/assets/images/icons/tablet.svg';

export const Menu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
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
          <NavMenuItem text="Home" icon={<HouseIcon />} />
          <NavMenuItem
            text="Staking"
            icon={<GraphIcon />}
            hasAlert
            textAlert="Check your subscription!"
          />
          <NavMenuItem text="Team" icon={<StarsIcon />} />
          <NavMenuItem
            text="Play everyday"
            icon={<GameboyIcon />}
            disabled
            subtitle="Coming soon"
          />
          <NavMenuItem text="Lottery" icon={<RocketIcon />} />
          <Divider mb="30px" borderBottomWidth="2px" borderColor="white"></Divider>
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
}: {
  text: string;
  textAlert?: string;
  subtitle?: string;
  icon: any;
  hasAlert?: boolean;
  disabled?: boolean;
}) => (
  <>
    <Link
      display="flex"
      w="100%"
      alignItems="center"
      color={disabled ? 'gray' : 'green.400'}
      mb="30px"
      _hover={{ textDecoration: 'none' }}
    >
      <Box w="8" h="8" display="flex" alignItems="center" justifyContent="center">
        {icon}
      </Box>
      <Text
        ml={5}
        textStyle="menuDefault"
        color={disabled ? 'gray' : 'white'}
        display="flex"
        flexWrap="wrap"
      >
        <Text position="relative">
          {hasAlert && <Circle size="10px" bg="red" position="absolute" right="-7px" top="-3px" />}
          {text}
        </Text>
        {subtitle && (
          <>
            <Text textStyle="menuSubtitle" w="100%">
              {subtitle}
            </Text>
          </>
        )}
        {hasAlert && (
          <>
            <Text color={'red'} ml="25px" position="relative">
              {textAlert}
            </Text>
          </>
        )}
      </Text>
    </Link>
  </>
);
