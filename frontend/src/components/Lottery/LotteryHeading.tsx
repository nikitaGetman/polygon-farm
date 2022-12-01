import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { LotteryStatus } from './LotteryStatus';
import backgroundImage from './assets/lottery_background.svg';
import tokensImage from './assets/tokens.svg';
import { LotteryStatusEnum } from '@/hooks/useLottery';

export const LotteryHeading = ({
  status,
  title,
  totalTickets,
}: {
  status: LotteryStatusEnum;
  title: string;
  totalTickets: number;
}) => {
  return (
    <Box
      position="relative"
      bgImage={backgroundImage}
      borderRadius="md"
      height="200px"
      padding="30px 75px"
    >
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        bgImage={tokensImage}
        bgRepeat="no-repeat"
        bgPosition="left center"
        pointerEvents="none"
      />

      <Flex justifyContent="flex-end" height="100%">
        <Flex flexDirection="column" alignItems="flex-end" justifyContent="space-between">
          <LotteryStatus status={status} />
          <Text textTransform="uppercase" textStyle="heading1">
            {title}
          </Text>
          <Text textStyle="textMedium">Total tickets this round: {totalTickets}</Text>
        </Flex>
      </Flex>
    </Box>
  );
};
