import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import './Landing.scss';
import { ReactComponent as CoinsIcon } from './images/coins.svg';

export const CoinImage = () => {
  return (
    <>
      <Box className="coins-text__img">
        <CoinsIcon />
      </Box>
      <Text className="coins-text__primary">500 000 000 SAV</Text>
      <Text className="coins-text__secondary">In staking rewards pool</Text>
    </>
  );
};
