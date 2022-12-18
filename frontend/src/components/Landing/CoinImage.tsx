import React from 'react';
import { Box, Text } from '@chakra-ui/react';

import { ReactComponent as CoinsIcon } from './images/coins.svg';

import './Landing.scss';

export const CoinImage = () => {
  return (
    <Box width="100%" minWidth="240px" textAlign="center">
      <Box className="coins-text__img" width="100%" height="100%">
        <CoinsIcon />
      </Box>
      <Text className="coins-text__primary">500 000 000 SAV</Text>
      <Text className="coins-text__secondary">In staking rewards pool</Text>
    </Box>
  );
};
