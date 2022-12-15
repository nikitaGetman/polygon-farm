import React from 'react';
import { Box, Button, Flex, useBreakpoint } from '@chakra-ui/react';

import { CoinImage } from '@/components/Landing/CoinImage';

import './Landing.scss';

export const Main = () => {
  const bp = useBreakpoint();
  const isSm = bp === 'sm' || bp === 'md';

  return (
    <Flex justifyContent="space-between" alignItems="center" className="main-banner">
      <Flex flexDirection="column" className="main-banner__top">
        <Box>
          <h1 className="main-heading">
            <span>Build a team.</span>
            <br />
            <span className="color-blue">Earn.</span>
            <span className="color-green">Win.</span>
          </h1>
          <h2 className="main-subheading">On the new platform on Polygon</h2>
        </Box>
        <Box>
          <h5 className="main-text color-green">Up to 7% in Fixed Deposits</h5>
        </Box>
        {isSm && <CoinImage />}
        <Flex className="main-btns" gap={{ sm: 4, xl: 10 }} flexWrap="wrap">
          <Box>
            <Button as="a" href="https://isaver.gitbook.io/isaver" variant="secondary">
              Whitepaper
            </Button>
          </Box>
          <Box>
            <Button as="a" href="https://app.isaver.io" variant="filledRed">
              Get started
            </Button>
          </Box>
        </Flex>
      </Flex>
      <Flex
        flexDirection="column"
        alignItems="center"
        position="relative"
        className="main-banner__bottom"
        flexGrow={1}
      >
        {!isSm && <CoinImage />}
      </Flex>
    </Flex>
  );
};
