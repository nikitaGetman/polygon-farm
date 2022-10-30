import React from 'react';
import {
  Button,
  Container,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ReactComponent as BurgerIcon } from '@/assets/images/icons/burger.svg';
import { ReactComponent as CrossIcon } from '@/assets/images/icons/cross.svg';
import Logo from '@/assets/images/logo.svg';
import './Header.scss';

export const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="app-header">
      <Container>
        <div className="app-header__logo">
          <img src={Logo} alt="Logo" />
        </div>

        <div className="app-header__buttons">
          <Button mr={5}>Connect wallet</Button>
          <IconButton
            variant="secondary"
            aria-label="Burger menu"
            icon={<BurgerIcon />}
            onClick={onOpen}
            padding="7px"
          />
        </div>
      </Container>

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
    </div>
  );
};
