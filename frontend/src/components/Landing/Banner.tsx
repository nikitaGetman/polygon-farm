import React from 'react';
import { Box, Button, Flex } from '@chakra-ui/react';

import { APP_URL } from '@/router';

import './Landing.scss';

export const Banner = () => {
  return (
    <Flex justifyContent="center" flexWrap="wrap" className="banner">
      <Box maxW="1260px" m="auto">
        <h4 className="banner__heading">No registration, no KYC, no hassle</h4>
        <h5 className="banner__subheading">Just by connecting your wallet</h5>
        <Flex justifyContent="center">
          <Button as="a" href={APP_URL} variant="filledRed" className="banner__btn">
            Get started
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};
