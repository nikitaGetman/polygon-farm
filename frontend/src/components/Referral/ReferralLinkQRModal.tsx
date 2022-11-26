import React, { FC } from 'react';
import {
  Box,
  CloseButton,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { ReactComponent as SavIcon } from '@/assets/images/sav_icon.svg';
import QRCode from 'react-qr-code';

type ReferralLinkQRModalProps = {
  link: string;
  onClose: () => void;
};
export const ReferralLinkQRModal: FC<ReferralLinkQRModalProps> = ({ link, onClose }) => {
  return (
    <Modal isCentered isOpen={true} onClose={onClose} size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          <Flex alignItems="center">
            <SavIcon width="32px" />

            <Text textStyle="textSansBold" fontSize="26px" ml="6px">
              iSaver
            </Text>
          </Flex>
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Text mb="12px" textAlign="center">
            Register now. Earn crypto together!
          </Text>
          <Box bgColor="white" borderRadius="sm" p="20px">
            <QRCode
              size={256}
              style={{
                height: 'auto',
                maxWidth: '100%',
                width: '100%',
              }}
              fgColor="#1f3e2c"
              value={link}
              viewBox={'0 0 256 256'}
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};