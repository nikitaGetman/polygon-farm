import React from 'react';
import logo from '../../assets/images/logo.svg';
import { Button } from '../ui/button/button';
import './Header.scss';

export const Header = () => {
  return (
    <div className="app-header">
      <div className="app-header__logo">
        <img src={logo} alt="" />
      </div>

      <Button>Connect wallet</Button>
      <Button disabled>Connect wallet</Button>
      <Button type="secondary">Test</Button>
    </div>
  );
};
