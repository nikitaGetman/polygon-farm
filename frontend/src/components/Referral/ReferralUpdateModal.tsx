import React, { FC, useMemo, useState } from 'react';
import { ETHER_ADDRESS_REGEX } from '@/utils/address';
import {
  Button,
  CloseButton,
  Flex,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';

type ReferralUpdateModalProps = {
  leader?: string;
  isLoading?: boolean;
  onUpdate: (leader: string) => void;
  onClose: () => void;
};
export const ReferralUpdateModal: FC<ReferralUpdateModalProps> = ({
  leader,
  isLoading,
  onUpdate,
  onClose,
}) => {
  const [localLeader, setLocalLeader] = useState(leader || '');

  const isLeaderValid = useMemo(() => ETHER_ADDRESS_REGEX.test(localLeader), [localLeader]);

  return (
    <Modal isCentered isOpen={true} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent p="40px 40px 32px">
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          <Text textStyle="textSansBold" fontSize="26px">
            Add leader
          </Text>
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Text textStyle="textSansBold" mb="10px" mt="26px">
            Leader's wallet
          </Text>
          <Input
            variant="secondary"
            placeholder="0x..."
            value={localLeader}
            onChange={(e) => setLocalLeader(e.target.value)}
          />

          <Text textStyle="textSansBold"></Text>
        </ModalBody>
        <ModalFooter flexDirection="column">
          <Button
            width="100%"
            variant="outlined"
            onClick={() => onUpdate(localLeader)}
            disabled={!isLeaderValid}
            isLoading={isLoading}
          >
            Add leader
          </Button>

          <Flex mt="20px" alignItems="center" width="100%">
            <WarningTwoIcon mr="10px" />
            The leader cannot be changed after adding
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
