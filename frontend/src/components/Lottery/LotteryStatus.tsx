import React, { useMemo } from 'react';
import { Box } from '@chakra-ui/react';

import { LotteryStatusEnum } from '@/lib/lottery';

export const LotteryStatus = ({ status }: { status: LotteryStatusEnum }) => {
  const statusColor = useMemo(() => {
    if (status === LotteryStatusEnum.upcoming) return 'yellow.200';
    if (status === LotteryStatusEnum.current) return 'green.400';
    if (status === LotteryStatusEnum.soldOut) return 'red';
    return 'grey.00';
  }, [status]);

  return (
    <Box
      display="inline-block"
      padding="10px 30px"
      border="2px solid"
      borderColor={statusColor}
      borderRadius="md"
      textStyle="button"
      color={statusColor}
    >
      {status}
    </Box>
  );
};
