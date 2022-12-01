import React, { FC, useCallback, useState } from 'react';
import { AddIcon, MinusIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, IconButton, Text } from '@chakra-ui/react';

type LotteryEnterProps = {
  maximumAvailableTickets: number;
  isDisabled: boolean;
  onEnter: (tickets: number) => Promise<void>;
};
export const LotteryEnter: FC<LotteryEnterProps> = ({
  maximumAvailableTickets,
  isDisabled,
  onEnter,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState(0);

  const increase = useCallback(() => setTickets(tickets + 1), [setTickets, tickets]);
  const decrease = useCallback(() => setTickets(tickets - 1), [setTickets, tickets]);

  const handleEnter = useCallback(() => {
    setIsLoading(true);
    onEnter(tickets).finally(() => {
      setIsLoading(false);
    });
  }, [setIsLoading, onEnter, tickets]);

  return (
    <Box
      bgColor="bgGreen.50"
      padding="40px"
      borderRadius="md"
      boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
    >
      <Flex mb="40px">
        <Text textStyle="text1">
          You can use a maximum of{' '}
          <Text as="span" color="green.400" textStyle="textBold">
            {maximumAvailableTickets}
          </Text>{' '}
          tickets in this raffle
        </Text>

        <Flex alignItems="center" ml="60px">
          <IconButton
            variant="outlinedShadow"
            aria-label="sub"
            disabled={isDisabled || tickets <= 0}
            onClick={decrease}
          >
            <MinusIcon />
          </IconButton>

          <Text width="80px" textAlign="center" textStyle="textRegular" fontSize="41px">
            {tickets}
          </Text>

          <IconButton
            variant="outlinedShadow"
            aria-label="add"
            disabled={isDisabled || tickets >= maximumAvailableTickets}
            onClick={increase}
          >
            <AddIcon />
          </IconButton>
        </Flex>
      </Flex>

      <Button
        variant="outlinedShadow"
        width="100%"
        isLoading={isLoading}
        isDisabled={isDisabled || !tickets}
        onClick={handleEnter}
      >
        Enter now
      </Button>

      {!isDisabled && tickets > 0 ? (
        <Flex color="error" mt="25px">
          <WarningTwoIcon mr="10px" mt="4px" />
          <Text textStyle="text1">
            Please note, after the bet you will not be able to take your tickets back
          </Text>
        </Flex>
      ) : null}
    </Box>
  );
};
