import React from 'react';
import { Box, Flex, Text, useBreakpoint } from '@chakra-ui/react';

import { LotteryStatusEnum } from '@/lib/lottery';

import backgroundImage from './assets/lottery_background.svg';
import tokensImage from './assets/tokens.svg';
import { LotteryStatus } from './LotteryStatus';

export const LotteryHeading = ({
  status,
  title,
  totalTickets,
}: {
  status: LotteryStatusEnum;
  title: string;
  totalTickets: number;
}) => {
  const bp = useBreakpoint();
  const isSmallStatus = ['sm', 'md', 'lg'].includes(bp);

  return (
    <Box
      position="relative"
      borderRadius="md"
      bgSize="cover"
      height={{ sm: '130px', xl: '150px', '2xl': '200px' }}
      padding={{ sm: '20px', xl: '20px 60px', '2xl': '30px 75px' }}
      background={{
        sm: 'linear-gradient(96.85deg, #20735B -8.44%, #1A3435 102.66%)',
        xl: `url(${backgroundImage})`,
      }}
      boxShadow={{ sm: '0px 6px 20px rgba(0, 0, 0, 0.25)', xl: 'unset' }}
    >
      <Box
        position="absolute"
        top="0"
        display={{ sm: 'none', lg: 'block' }}
        left={{ sm: '-20px', xl: '0' }}
        width={{ sm: '80%', xl: '70%' }}
        height="100%"
        bgImage={tokensImage}
        bgSize="cover"
        bgRepeat="no-repeat"
        bgPosition="left center"
        pointerEvents="none"
      />

      <Flex
        height="100%"
        position="relative"
        flexDirection="column"
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <Box alignSelf={{ sm: 'flex-start', lg: 'flex-end' }}>
          <LotteryStatus status={status} isSmall={isSmallStatus} />
        </Box>

        <Text textTransform="uppercase" textStyle="h3" fontSize={{ sm: '18px', '2xl': '38px' }}>
          {title}
        </Text>

        <Text textStyle="textSansSmall" fontSize={{ '2xl': '26px' }}>
          Total Tickets this round: {totalTickets}
        </Text>
      </Flex>
    </Box>
  );
};
