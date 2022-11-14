import React, { FC, useEffect } from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  useClipboard,
} from '@chakra-ui/react';
import { ReactComponent as MetamaskIcon } from '@/assets/images/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from '@/assets/images/icons/walletconnect.svg';
import { ReactComponent as ChevronDownIcon } from '@/assets/images/icons/chevron-down.svg';
import { trimAddress } from '@/utils/address';

const CONNECTOR_ICON: Record<string, any> = {
  MetaMask: <MetamaskIcon />,
  WalletConnect: <WalletConnectIcon />,
};

type Props = {
  address?: string;
  connector?: any;
  disconnect: () => void;
};

const focusStyle = { bgColor: 'green.400' };
const menuItemStyle = {
  textAlign: 'right' as const,
  display: 'block',
  borderRadius: 'sm',
  _hover: focusStyle,
  _focus: focusStyle,
  _active: focusStyle,
};

export const WalletMenu: FC<Props> = ({ connector, disconnect, address }) => {
  const connectorIcon = connector ? CONNECTOR_ICON[connector.name] : undefined;
  const { onCopy, setValue, hasCopied } = useClipboard(address || '');

  useEffect(() => {
    setValue(address || '');
  }, [setValue, address]);

  return (
    <Menu placement="bottom-end">
      <MenuButton as={Button} leftIcon={connectorIcon} rightIcon={<ChevronDownIcon />}>
        {trimAddress(address)}
      </MenuButton>
      <Portal>
        <MenuList bgColor="green.100" minWidth="150px" p="6px 8px" zIndex="60">
          <MenuItem {...menuItemStyle} onClick={onCopy} closeOnSelect={false}>
            {hasCopied ? 'Copied' : 'Copy address'}
          </MenuItem>
          <MenuItem {...menuItemStyle} onClick={() => disconnect()}>
            Log out
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};
