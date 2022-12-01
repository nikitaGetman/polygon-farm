import React from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import { Box, Flex, Text } from '@chakra-ui/react';

export const LotteryCountdown = ({ timestamp }: { timestamp: number }) => {
  const { stampStrings } = useCountdown(timestamp);

  return (
    <Flex
      padding="30px"
      bgColor="bgGreen.50"
      boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
      borderRadius="md"
      flexDir="column"
      alignItems="center"
    >
      <Text mb="22px" textStyle="textMedium" textTransform="uppercase">
        Countdown
      </Text>

      <Flex
        mb="23px"
        background="rgba(38, 71, 55, 0.5)"
        boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
        borderRadius="10px"
        padding="15px 5px"
      >
        <TimerStamp value={stampStrings.daysString} label="days" />
        <Box width="1px" bgColor="white" opacity="0.5" />
        <TimerStamp value={stampStrings.hoursString} label="hours" />
        <Box width="1px" bgColor="white" opacity="0.5" />
        <TimerStamp value={stampStrings.minsString} label="min" />
        <Box width="1px" bgColor="white" opacity="0.5" />
        <TimerStamp value={stampStrings.secString} label="sec" />
      </Flex>

      <Text textStyle="button">This raffle will soon be available</Text>
    </Flex>
  );
};

const TimerStamp = ({ value, label }: { value: string; label: string }) => (
  <Flex flexDir="column" justifyContent="space-between" alignItems="center" width="115px">
    <Text textStyle="textRegular" fontSize="26px" opacity="0.5">
      {value || '00'}
    </Text>
    <Text textStyle="button">{label}</Text>
  </Flex>
);
