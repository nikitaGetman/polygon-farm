import React from 'react';
import {
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Text,
} from '@chakra-ui/react';
import { ReactComponent as CrossIcon } from '@/assets/images/icons/cross.svg';

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

        <DrawerBody></DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
