import React, { FC } from 'react';
import './button.scss';

type Props = {
  type?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
};
export const Button: FC<Props> = ({ type = 'primary', disabled, children, onClick }) => {
  return (
    <button className={`ui-button ui-button--${type}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
