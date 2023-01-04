import React, { useMemo } from 'react';
import { Box, Text } from '@chakra-ui/react';

import { LotteryStatusEnum } from '@/lib/lottery';

export const LotteryStatus = ({
  status,
  isSmall,
  noBorder,
}: {
  status: LotteryStatusEnum;
  isSmall?: boolean;
  noBorder?: boolean;
}) => {
  const statusColor = useMemo(() => {
    if (status === LotteryStatusEnum.upcoming) return 'yellow.200';
    if (status === LotteryStatusEnum.current) return 'green.400';
    if (status === LotteryStatusEnum.soldOut) return 'red';
    if (status === LotteryStatusEnum.closed) return 'red';
    return 'white';
  }, [status]);

  if (noBorder) {
    return (
      <Text textStyle="button" color={statusColor}>
        {status}
      </Text>
    );
  }

  return (
    <Box
      display="inline-block"
      padding={isSmall ? '6px 30px' : '10px 30px'}
      border="2px solid"
      borderColor={statusColor}
      borderRadius="md"
      textStyle="button"
      fontSize={isSmall ? '12px' : undefined}
      color={statusColor}
    >
      {status}
    </Box>
  );
};
