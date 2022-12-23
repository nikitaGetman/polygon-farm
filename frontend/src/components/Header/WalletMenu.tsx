import React, { FC, useEffect } from 'react';
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  useBreakpoint,
  useClipboard,
} from '@chakra-ui/react';

import { ReactComponent as ChevronDownIcon } from '@/assets/images/icons/chevron-down.svg';
import { ReactComponent as MetamaskIcon } from '@/assets/images/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from '@/assets/images/icons/walletconnect.svg';
import { useNotification } from '@/hooks/useNotification';
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
  bgColor: 'transparent',
  _hover: focusStyle,
  _focus: focusStyle,
  _active: focusStyle,
};

export const WalletMenu: FC<Props> = ({ connector, disconnect, address }) => {
  const connectorIcon = connector ? CONNECTOR_ICON[connector.name] : undefined;
  const { onCopy, setValue, hasCopied } = useClipboard(address || '');

  const { success } = useNotification();
  useEffect(() => {
    if (hasCopied) {
      success({ title: 'Copied!' });
    }
  }, [hasCopied, success]);

  useEffect(() => {
    setValue(address || '');
  }, [setValue, address]);

  const bp = useBreakpoint({ ssr: false });
  const isFullView = bp === '2xl' || bp === 'xl';

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={Button}
        leftIcon={isFullView ? connectorIcon : undefined}
        rightIcon={isFullView ? <ChevronDownIcon /> : undefined}
        size={{ sm: 'md', '2xl': 'lg' }}
        padding={{ sm: '10px', xl: '20px' }}
        textTransform="lowercase"
      >
        {isFullView ? trimAddress(address) : connectorIcon}
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
