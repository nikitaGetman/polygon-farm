import React, { FC, useMemo } from 'react';
import { Box, Button, Divider, Text, useBreakpoint } from '@chakra-ui/react';

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

  const bp = useBreakpoint({ ssr: false });
  const isSm = ['sm', 'lg', 'xl'].includes(bp);

  return (
    <Box
      padding="20px"
      backgroundColor="rgba(38, 71, 55, 0.5)"
      borderRadius="md"
      boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
    >
      <LotteryStatus status={status} isSmall={isSm} />

      <Text
        mt={isSm ? '20px' : '26px'}
        mb="10px"
        textStyle="text"
        fontSize={isSm ? '18px' : '26px'}
        fontWeight={isSm ? '700' : '500'}
        textTransform="uppercase"
      >
        {title}
      </Text>

      <Text
        mb={isSm ? '20px' : '35px'}
        textStyle="textRegular"
        textTransform="uppercase"
        fontSize={isSm ? '12px' : '18px'}
        fontWeight={isSm ? '600' : '400'}
      >
        Countdown:
        <Box as="span" ml="24px">
          {elapsedTimeString}
        </Box>
      </Text>

      <Divider mb={isSm ? '20px' : '24px'} bgColor="white" opacity="1" borderColor="white" />

      <Button width="100%" onClick={onDetails}>
        See details
      </Button>
    </Box>
  );
};
