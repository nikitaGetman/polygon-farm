import { FC, useCallback, useState } from 'react';
import {
  Box,
  Button,
  CloseButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

type MintRaffleTicketProps = {
  onClose: () => void;
  onSubmit: ({ address, amount }: { address: string; amount: number }) => Promise<void>;
};
export const MintRaffleTicket: FC<MintRaffleTicketProps> = ({ onClose, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState<number>();

  const handleSubmit = useCallback(() => {
    if (!address || !amount) return;

    setIsLoading(true);
    onSubmit({ address, amount }).finally(() => setIsLoading(false));
  }, [address, amount, onSubmit]);

  const isDataValid = address && amount;

  return (
    <Modal isOpen isCentered onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textStyle="textSansBold" fontSize={26}>
          Mint Raffle Tickets
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Address:
            </Text>
            <Input placeholder="0x..." onChange={(e) => setAddress(e.target.value)} />
          </Box>
          <Box mb="20px">
            <Text textStyle="text1" mb="4px">
              Amount of tickets:
            </Text>
            <Input
              type="number"
              placeholder="0"
              onChange={(e) => setAmount(parseInt(e.target.value))}
            />
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            isLoading={isLoading}
            isDisabled={!isDataValid || isLoading}
            onClick={handleSubmit}
          >
            Mint Tickets
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
