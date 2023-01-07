import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

import { useCountdown } from '@/hooks/useCountdown';

const SHOW_RESULT_DELAY = 10800; // 180 mins
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
      padding={{ sm: '20px 10px', md: '20px', lg: '20px 10px', xl: '20px', '2xl': '30px' }}
      bgColor="bgGreen.50"
      boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
      borderRadius="md"
      flexDir="column"
      alignItems="center"
    >
      <Text
        mb="20px"
        textStyle="textBold"
        fontSize={{ sm: '18px', '2xl': '26px' }}
        textTransform="uppercase"
      >
        {!isFinished ? 'Countdown' : 'Announcing winners in'}
      </Text>

      {!isStarted ? (
        <>
          <Box mb="20px">
            <Timer {...startTimeStamps} />
          </Box>
          <Text textStyle="button" fontSize={{ sm: '12px', '2xl': '16px' }}>
            This Raffle will soon be available
          </Text>
        </>
      ) : null}

      {isStarted && !isFinished ? (
        <>
          <Box mb={{ sm: '40px', '2xl': '50px' }}>
            <Timer {...endTimeStamps} highlight />
          </Box>
          <Text mb="16px" textStyle="button" fontSize={{ sm: '12px', '2xl': '16px' }}>
            Announcing winners in
          </Text>
          <Box mb={{ sm: '10px', '2xl': '20px' }}>
            <Timer {...resultTimeStamps} highlight />
          </Box>
        </>
      ) : null}

      {isFinished ? (
        <Box mb={{ sm: '10px', '2xl': '20px' }}>
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
      padding={{ sm: '12px 5px', '2xl': '15px 5px' }}
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
  <Flex
    direction="column"
    justifyContent="space-between"
    alignItems="center"
    width={{ sm: '68px', md: '96px', lg: '64px', xl: '100px', '2xl': '115px' }}
  >
    <Text
      textStyle="textRegular"
      opacity="0.5"
      fontSize={{ sm: '18px', '2xl': '26px' }}
      fontWeight={{ sm: '500', '2xl': '400' }}
    >
      {value.toString().padStart(2, '0') || '00'}
    </Text>
    <Text textStyle="button" fontSize={{ sm: '12px', '2xl': '16px' }}>
      {label}
    </Text>
  </Flex>
);
