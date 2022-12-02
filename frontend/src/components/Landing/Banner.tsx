import React from 'react';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import Logo from '@/assets/images/logo.svg';
import './Landing.scss';

export const Banner = () => {
  return (
    <Flex justifyContent="center" flexWrap="wrap" className="banner">
      <Box maxW="1260px" m="auto">
        <Box w="100%" className="banner__img-container">
          <img src={Logo} alt="Logo" className="banner__img" />
        </Box>
        <h4 className="banner__heading">No registration, no KYC, no hassle</h4>
        <h5 className="banner__subheading">Just by connecting your wallet</h5>
        <Flex justifyContent="center">
          <Button variant="filledRed" className="banner__btn">
            Get started
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};
