import React, { FC, useMemo } from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import { LotteryStatusEnum } from '@/hooks/useLottery';
import { Box, Button, Divider, Text } from '@chakra-ui/react';
import { LotteryStatus } from './LotteryStatus';

type LotteryItemProps = {
  status: LotteryStatusEnum;
  title: string;
  timestamp: number;
  onDetails: () => void;
};
export const LotteryItem: FC<LotteryItemProps> = ({ status, title, timestamp, onDetails }) => {
  const { stampStrings } = useCountdown(timestamp);

  const elapsedTimeString = useMemo(() => {
    return `${stampStrings.daysString}d-${stampStrings.hoursString}h\
    -${stampStrings.minsString}m-${stampStrings.secString}s`;
  }, [stampStrings]);

  return (
    <Box
      padding="20px"
      backgroundColor="bgGreen.200"
      borderRadius="md"
      boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
    >
      <LotteryStatus status={status} />

      <Text mt="26px" mb="10px" textStyle="textMedium" textTransform="uppercase">
        {title}
      </Text>

      <Text mb="35px" textStyle="textRegular">
        Countdown:{' '}
        <Box as="span" ml="23px">
          {elapsedTimeString}
        </Box>
      </Text>

      <Divider mb="24px" bgColor="white" opacity="1" borderColor="white" />

      <Button width="100%" onClick={onDetails}>
        See details
      </Button>
    </Box>
  );
};
