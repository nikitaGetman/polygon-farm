import React from 'react';
import { Button, Container, IconButton, useDisclosure } from '@chakra-ui/react';
import { Menu } from '@/components/Menu/Menu';
import { ReactComponent as BurgerIcon } from '@/assets/images/icons/burger.svg';
import Logo from '@/assets/images/logo.svg';
import './Header.scss';

export const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="app-header">
      <Container variant="dashboardLayout">
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

      <Menu isOpen={isOpen} onClose={onClose} />
    </div>
  );
};
