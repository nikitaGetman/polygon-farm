import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

import { useCountdown } from '@/hooks/useCountdown';

const SHOW_RESULT_DELAY = 600; // 10 mins
export const LotteryCountdown = ({
  startTime,
  duration,
  onExpire,
}: {
  startTime: number;
  duration: number;
  onExpire?: () => void;
}) => {
  const currentTime = Date.now() / 1000;

  const { stamps: startTimeStamps } = useCountdown(startTime * 1000, onExpire);
  const { stamps: endTimeStamps } = useCountdown((startTime + duration) * 1000, onExpire);
  const { stamps: resultTimeStamps } = useCountdown(
    (startTime + duration + SHOW_RESULT_DELAY) * 1000,
    onExpire
  );

  const isStarted = startTime < currentTime;
  const isFinished = startTime + duration < currentTime;

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
        {!isFinished ? 'Countdown' : 'Announcing winners in'}
      </Text>

      {!isStarted ? (
        <>
          <Box mb="23px">
            <Timer {...startTimeStamps} />
          </Box>
          <Text textStyle="button">This raffle will soon be available</Text>
        </>
      ) : null}

      {isStarted && !isFinished ? (
        <>
          <Box mb="50px">
            <Timer {...endTimeStamps} highlight />
          </Box>
          <Text mb="16px" textStyle="button">
            announcing winners in
          </Text>
          <Box mb="20px">
            <Timer {...resultTimeStamps} highlight />
          </Box>
        </>
      ) : null}

      {isFinished ? (
        <Box mb="20px">
          <Timer {...resultTimeStamps} highlight />
        </Box>
      ) : null}
    </Flex>
  );
};

const Timer = ({
  days,
  hours,
  minutes,
  seconds,
  highlight,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  highlight?: boolean;
}) => {
  return (
    <Flex
      background="rgba(38, 71, 55, 0.5)"
      boxShadow={
        highlight ? '0px 9px 19px rgba(107, 201, 91, 0.33)' : '0px 6px 11px rgba(0, 0, 0, 0.25)'
      }
      border={highlight ? '2px solid' : undefined}
      borderColor="green.400"
      borderRadius="10px"
      padding="15px 5px"
    >
      <TimerStamp value={days} label="days" />
      <Box width="1px" bgColor="white" opacity="0.5" />
      <TimerStamp value={hours} label="hours" />
      <Box width="1px" bgColor="white" opacity="0.5" />
      <TimerStamp value={minutes} label="min" />
      <Box width="1px" bgColor="white" opacity="0.5" />
      <TimerStamp value={seconds} label="sec" />
    </Flex>
  );
};

const TimerStamp = ({ value, label }: { value: number; label: string }) => (
  <Flex flexDir="column" justifyContent="space-between" alignItems="center" width="115px">
    <Text textStyle="textRegular" fontSize="26px" opacity="0.5">
      {value.toString().padStart(2, '0') || '00'}
    </Text>
    <Text textStyle="button">{label}</Text>
  </Flex>
);
