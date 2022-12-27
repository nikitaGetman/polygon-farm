import React from 'react';
import { Box, Text } from '@chakra-ui/react';

import { ReactComponent as CoinsIcon } from './images/coins.svg';

import './Landing.scss';

export const CoinImage = () => {
  return (
    <Box width={{ xl: '100%' }} minWidth={{ base: '240px' }} textAlign="center">
      <Box
        className="coins-text__img"
        width={{ xl: '100%' }}
        height={{ sm: '300px', md: '300px', lg: '230px', xl: '310px', '2xl': '450px' }}
      >
        <CoinsIcon />
      </Box>
      <Text className="coins-text__primary">500 000 000 SAV</Text>
      <Text className="coins-text__secondary">In staking rewards pool</Text>
    </Box>
  );
};
