import React, { FC } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import puzzlePattern from './assets/puzzle_pattern.svg';

type LotteryTicketsProps = {
  showEntered: boolean;
  enteredTickets?: number;
  tickets: number;
  onBuyClick: () => void;
};
export const LotteryTickets: FC<LotteryTicketsProps> = ({
  showEntered,
  enteredTickets,
  tickets,
  onBuyClick,
}) => {
  return (
    <Box
      bgColor="bgGreen.50"
      boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
      borderRadius="md"
      overflow="hidden"
    >
      {showEntered ? (
        <Box
          bgColor={!enteredTickets ? 'gray.200' : '#1b5b52'}
          textAlign="center"
          padding="23px"
          textStyle="h3"
          textTransform="uppercase"
        >
          {!enteredTickets ? (
            'Tickets not placed'
          ) : (
            <>
              You have placed{' '}
              <Text as="span" color="green.400">
                {enteredTickets}
              </Text>{' '}
              tickets
            </>
          )}
        </Box>
      ) : null}

      <Box padding="36px 40px" bgImage={puzzlePattern} bgSize="cover">
        <Flex alignItems="center">
          <Text textStyle="h3">Your tickets:</Text>
          <Text ml="20px" lineHeight="50px" textStyle="textRegular" fontSize="55px">
            {tickets}
          </Text>
          <Button ml="auto" onClick={onBuyClick}>
            Buy tickets
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
