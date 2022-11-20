import React, { FC, useMemo, useState } from 'react';
import { ETHER_ADDRESS_REGEX } from '@/utils/address';
import {
  Button,
  CloseButton,
  Input,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
} from '@chakra-ui/react';

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
    <Modal isCentered isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          <Text textStyle="textSansBold" fontSize="26px">
            Add leader
          </Text>
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Text textStyle="textSansBold" mb="10px">
            Leader address:
          </Text>
          <Input
            variant="secondary"
            placeholder="0x..."
            value={localLeader}
            onChange={(e) => setLocalLeader(e.target.value)}
          />
          <UnorderedList mt="12px">
            <ListItem>The leader cannot be changed after submitting</ListItem>
          </UnorderedList>
          <Text textStyle="textSansBold"></Text>
        </ModalBody>
        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            onClick={() => onUpdate(localLeader)}
            disabled={!isLeaderValid}
            isLoading={isLoading}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
