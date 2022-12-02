import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import './Landing.scss';
import { ReactComponent as CoinsIcon } from './images/coins.svg';

export const Main = () => {
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      className="main-banner"
    >
      <Flex flexDirection="column" className="main-banner__top">
        <Box>
          <h1 className="main-heading">
            <span className="no-wrap">Build a team.</span>
            <br />
            <span className="color-blue">Earn.</span>
            <span className="color-green">Win.</span>
          </h1>
          <h2 className="main-subheading">On the new platform on Polygon</h2>
        </Box>
        <Box>
          <h5 className="main-text color-green">Up to 7% in Fixed Deposits</h5>
        </Box>
        <Flex className="main-btns">
          <Button variant="secondary">Whitepaper</Button>
          <Button variant="filledRed">Get started</Button>
        </Flex>
      </Flex>
      <Flex
        flexDirection="column"
        alignItems="center"
        position="relative"
        top="-60px"
        className="main-banner__bottom"
      >
        <Box className="coins-text__img">
          <CoinsIcon />
        </Box>
        <Text className="coins-text__primary">500 000 000 SAV</Text>
        <Text className="coins-text__secondary">In staking rewards pool</Text>
      </Flex>
    </Flex>
  );
};
