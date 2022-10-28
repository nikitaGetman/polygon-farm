import React from 'react';
import Logo from '@/assets/images/logo.svg';
import { Button } from '@/components/ui/Button/Button';
import './Header.scss';

export const Header = () => {
  return (
    <div className="app-header">
      <div className="app-header__logo">
        {/* <img src={logo} alt="" /> */}
        <Logo />
      </div>

      <Button>Connect wallet</Button>
      <Button disabled>Connect wallet</Button>
      <Button type="secondary">Test</Button>
    </div>
  );
};
