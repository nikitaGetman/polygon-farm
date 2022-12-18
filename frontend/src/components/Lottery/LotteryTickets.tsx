import React, { FC } from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import puzzlePattern from './assets/puzzle_pattern.svg';

type LotteryTicketsProps = {
  showEntered: boolean;
  isClosed: boolean;
  enteredTickets?: number;
  tickets: number;
  onBuyClick: () => void;
};
export const LotteryTickets: FC<LotteryTicketsProps> = ({
  showEntered,
  isClosed,
  enteredTickets,
  tickets,
  onBuyClick,
}) => {
  const isClosedEmpty = isClosed && !enteredTickets;
  return (
    <Box
      bgColor="bgGreen.50"
      boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
      borderRadius="md"
      overflow="hidden"
    >
      {showEntered ? (
        <Box
          bgColor={isClosedEmpty ? 'gray.200' : '#1b5b52'}
          textAlign="center"
          textStyle="text1"
          textTransform="uppercase"
          padding={{ sm: '18px', md: '15px', lg: '18px', xl: '15px', '2xl': '23px' }}
          fontSize={{ sm: '12px', md: '16px', lg: '12px', xl: '16px', '2xl': '26px' }}
          fontWeight={{ sm: '600', '2xl': '700' }}
        >
          {isClosedEmpty ? (
            'Tickets not placed'
          ) : (
            <>
              You have placed{' '}
              <Text as="span" color="green.400">
                {enteredTickets}
              </Text>{' '}
              Tickets
            </>
          )}
        </Box>
      ) : null}

      <Box
        padding={{ sm: '13px 10px 20px', '2xl': '36px 40px' }}
        bgImage={puzzlePattern}
        bgSize="cover"
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          direction={{ sm: 'column', '2xl': 'row' }}
        >
          <Flex alignItems="center">
            <Text
              textStyle="text1"
              fontSize={{ sm: '16px', '2xl': '26px' }}
              fontWeight={{ sm: '500', '2xl': '600' }}
            >
              Your Tickets:
            </Text>
            <Text
              textStyle="text1"
              ml={{ sm: '15px', '2xl': '20px' }}
              lineHeight={{ sm: '20px', '2xl': '50px' }}
              fontSize={{ sm: '26px', '2xl': '55px' }}
              fontWeight={{ sm: '500', '2xl': '400' }}
            >
              {tickets}
            </Text>
          </Flex>
          <Button
            width={{ sm: '100%', '2xl': 'unset' }}
            mt={{ sm: '15px', '2xl': 'unset' }}
            onClick={onBuyClick}
          >
            Buy Tickets
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};
