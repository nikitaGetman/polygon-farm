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

type UpdateLeaderModalProps = {
  leader?: string;
  onUpdate: (leader: string) => void;
  onClose: () => void;
};
export const UpdateLeaderModal: FC<UpdateLeaderModalProps> = ({ leader, onUpdate, onClose }) => {
  const [localLeader, setLocalLeader] = useState(leader || '');

  const isLeaderValid = useMemo(
    () => !localLeader || ETHER_ADDRESS_REGEX.test(localLeader),
    [localLeader]
  );

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
          <Text textStyle="textSansBold" mb="4px">
            Leader address:
          </Text>
          <Input
            variant="secondary"
            placeholder="0x Leader address"
            value={localLeader}
            onChange={(e) => setLocalLeader(e.target.value)}
          />
          <UnorderedList mt="12px">
            <ListItem>Leader will be saved after your next deposit</ListItem>
            <ListItem>Leader cannot be changed after it is saved upon deposit</ListItem>
          </UnorderedList>
          <Text textStyle="textSansBold"></Text>
        </ModalBody>
        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            onClick={() => onUpdate(localLeader)}
            disabled={!isLeaderValid}
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
