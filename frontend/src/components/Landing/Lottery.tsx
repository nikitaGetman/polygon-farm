import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import LotteryImg from './images/lottery_img.png';
import './Landing.scss';

export const Lottery = () => {
  return (
    <Flex mb="180px" justifyContent="center" flexWrap="wrap" className="lottery">
      <Box maxW="1068px" m="auto">
        <Flex flexDirection="column" alignItems="center" mb="65px">
          <h4 className="heading">Our mini free-to-play</h4>
          <h5 className="subheading">As a first step</h5>
        </Flex>
        <img src={LotteryImg} alt="Lottery" className="lottery__img" />
        <Flex justifyContent="space-between" alignItems="end" mt="16px">
          <Text className="lottery__text">
            Claim puzzle every day to <br /> get a ticket to the raffle
          </Text>
          <Text className="lottery__heading">Win big prizes</Text>
        </Flex>
      </Box>
    </Flex>
  );
};
