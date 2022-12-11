import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import { AddIcon, MinusIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, IconButton, Input, Text } from '@chakra-ui/react';

type LotteryEnterProps = {
  maximumAvailableTickets: number;
  userEnteredTickets?: number;
  userTickets?: number;
  isDisabled: boolean;
  onEnter: (tickets: number) => Promise<void>;
};
export const LotteryEnter: FC<LotteryEnterProps> = ({
  maximumAvailableTickets,
  userEnteredTickets,
  userTickets,
  isDisabled,
  onEnter,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tickets, setTickets] = useState(0);

  const leftTickets = userEnteredTickets
    ? maximumAvailableTickets - userEnteredTickets
    : maximumAvailableTickets;

  const increase = () => setTickets((prev) => prev + 1);
  const decrease = () => setTickets((prev) => prev - 1);
  const handleTicketsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const leftTrimmed = Math.min(value, leftTickets);
    const userBalanceTrimmed =
      userTickets !== undefined ? Math.min(userTickets, leftTrimmed) : leftTrimmed;
    setTickets(userBalanceTrimmed);
  };

  const handleEnter = useCallback(() => {
    setIsLoading(true);
    onEnter(tickets)
      .then(() => {
        setTickets(0);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setIsLoading, onEnter, tickets]);

  const canIncrease = userTickets ? tickets < leftTickets && tickets < userTickets : false;

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
          Tickets in this Raffle {userEnteredTickets ? `(${leftTickets} left)` : null}
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

          <Input
            value={tickets}
            variant="transparent"
            width="80px"
            textAlign="center"
            textStyle="textRegular"
            fontSize="41px"
            onChange={handleTicketsChange}
          />

          <IconButton
            variant="outlinedShadow"
            aria-label="add"
            disabled={isDisabled || !canIncrease}
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
            Please note, after the bet you will not be able to take your Tickets back
          </Text>
        </Flex>
      ) : null}
    </Box>
  );
};
