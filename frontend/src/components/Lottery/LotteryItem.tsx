import React, { FC, useMemo } from 'react';
import { Box, Button, Divider, Text } from '@chakra-ui/react';

import { useCountdown } from '@/hooks/useCountdown';
import { LotteryStatusEnum } from '@/lib/lottery';

import { LotteryStatus } from './LotteryStatus';

type LotteryItemProps = {
  status: LotteryStatusEnum;
  title: string;
  timestamp: number;
  onDetails: () => void;
  onExpire?: () => void;
};
export const LotteryItem: FC<LotteryItemProps> = ({
  status,
  title,
  timestamp,
  onDetails,
  onExpire,
}) => {
  const { stampStrings } = useCountdown(timestamp, onExpire);

  const elapsedTimeString = useMemo(() => {
    const { daysString, hoursString, minsString, secString } = stampStrings;
    return `${daysString}d-${hoursString}h-${minsString}m-${secString}s`;
  }, [stampStrings]);

  return (
    <Box
      padding="20px"
      backgroundColor="rgba(38, 71, 55, 0.5)"
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
