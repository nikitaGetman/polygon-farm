import React, { FC, useCallback, useState } from 'react';
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
  Spacer,
  Text,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';

import { bigNumberToString } from '@/utils/number';

const boxCommonStyles = {
  bgColor: 'gray.200',
  borderRadius: 'sm',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 20px',
  textStyle: 'textSansBold',
};

type BuyLotteryTicketsModalProps = {
  ticketPrice: BigNumber;
  onClose: () => void;
  onBuy: (amount: number) => Promise<void>;
};
export const BuyLotteryTicketsModal: FC<BuyLotteryTicketsModalProps> = ({
  ticketPrice,
  onClose,
  onBuy,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState<number>();

  const handleUpdate = useCallback(
    (e: any) => {
      const MAX_VALUE = 1_000_000;
      let value = Math.min(Number(e.target.value), MAX_VALUE);

      setAmount(value || undefined);
    },
    [setAmount]
  );

  const handleBuy = useCallback(() => {
    if (!amount) return;
    setIsLoading(true);
    onBuy(amount).finally(() => {
      setIsLoading(false);
    });
  }, [amount, setIsLoading, onBuy]);

  return (
    <Modal isCentered isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="textSansBold" fontSize="26px">
            Buy lottery tickets
          </Text>
          <CloseButton onClick={onClose} size="lg" />
        </ModalHeader>

        <ModalBody>
          <Text mt="26px" mb="10px" textStyle="textSansBold">
            Enter the number of tickets
          </Text>
          <Input
            variant="secondary"
            type="number"
            placeholder="0"
            value={amount}
            onChange={handleUpdate}
          />

          <Text mt="30px" mb="10px" textStyle="textSansBold">
            Price per ticket
          </Text>
          <Box {...boxCommonStyles} mb="30px">
            {bigNumberToString(ticketPrice)}
            <Spacer />
            SAV
          </Box>

          <Text mb="10px" textStyle="textSansBold">
            Total amount
          </Text>
          <Box {...boxCommonStyles} mb="10px">
            {bigNumberToString(ticketPrice.mul(amount || 0))}
            <Spacer />
            SAV
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            width="100%"
            variant="outlined"
            onClick={handleBuy}
            disabled={!amount}
            isLoading={isLoading}
          >
            Buy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
