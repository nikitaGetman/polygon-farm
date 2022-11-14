import React, { FC, useCallback, useEffect } from 'react';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { useAccount, useConnect } from 'wagmi';
import { ReactComponent as MetamaskIcon } from '@/assets/images/icons/metamask.svg';
import { ReactComponent as WalletConnectIcon } from '@/assets/images/icons/walletconnect.svg';

type ConnectWalletModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const getIcon = (connectorId: string) => {
  if (connectorId === 'metaMask') return <MetamaskIcon />;
  if (connectorId === 'walletConnect') return <WalletConnectIcon />;

  return null;
};

export const ConnectWalletModal: FC<ConnectWalletModalProps> = ({ onClose, isOpen }) => {
  const {
    connect,
    connectors,
    error: connectError,
    isLoading: isConnectLoading,
    pendingConnector,
  } = useConnect();

  const { isConnected } = useAccount();

  //   Close modal on connection
  useEffect(() => {
    if (isConnected && isOpen) onClose();
  }, [isConnected, onClose, isOpen]);

  const handleConnect = useCallback(
    async (connector: any) => {
      connect({ connector });
    },
    [connect]
  );

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader justifyContent="center">
          <Text textStyle="textBold">Connect to a wallet</Text>
          <ModalCloseButton onClick={onClose} size="lg" right="20px" top="20px" />
        </ModalHeader>
        <ModalBody>
          {connectError && (
            <Text color="error" textAlign="center" textStyle="textBold">
              {connectError.message}
            </Text>
          )}
          {connectors.map((c) => (
            <ConnectButton
              key={c.id}
              text={c.name}
              icon={getIcon(c.id)}
              onClick={() => handleConnect(c)}
              isLoading={isConnectLoading && pendingConnector?.id === c.id}
            />
          ))}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

type ConnectButtonProps = {
  text: string;
  icon: any;
  isLoading?: boolean;
  onClick: () => void;
};
const ConnectButton: FC<ConnectButtonProps> = ({ text, icon, onClick, isLoading }) => {
  return (
    <Button
      background="linear-gradient(96.85deg, rgba(35, 157, 113, 0.54) -8.44%, rgba(35, 54, 72, 0.54) 102.66%)"
      boxShadow="0px 6px 20px rgba(0, 0, 0, 0.25)"
      backdropFilter="blur(22.5px)"
      borderRadius="md"
      w="100%"
      mt="10px"
      p="20px"
      size="xl"
      onClick={onClick}
      isLoading={isLoading}
    >
      <Flex justifyContent="space-between" alignItems="center" w="100%">
        {icon}
        {text}
      </Flex>
    </Button>
  );
};
