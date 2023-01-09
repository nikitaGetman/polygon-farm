import React from 'react';
import { Box, Button, Flex, useBreakpoint } from '@chakra-ui/react';

import { CoinImage } from '@/components/Landing/CoinImage';
import { APP_URL, WHITEPAPER_URL } from '@/router';

import './Landing.scss';

export const Main = () => {
  const bp = useBreakpoint({ ssr: false });
  const isSm = bp === 'sm' || bp === 'md';

  return (
    <Flex
      justifyContent="center"
      mx="auto"
      className="main-banner"
      maxWidth={{ lg: '800px', xl: '980px', '2xl': 'unset' }}
    >
      <Flex flexDirection="column" className="main-banner__top" flexGrow={1}>
        <Box>
          <h1 className="main-heading">
            <span>Build a team.</span>
            <br /> <span className="color-blue">Earn.</span>{' '}
            <span className="color-green">Win.</span>
          </h1>
          <h2 className="main-subheading">On the new platform on Polygon</h2>
        </Box>
        <Box>
          <h5 className="main-text color-green">Up to 30% in Fixed Deposits</h5>
        </Box>
        {isSm && <CoinImage />}
        <Flex className="main-btns" gap={{ sm: '10px', '2xl': 5 }} flexWrap="wrap">
          <Button
            as="a"
            href={WHITEPAPER_URL}
            target="_blank"
            variant="secondary"
            fontSize={{ sm: '12px', '2xl': 'unset' }}
            width={{ sm: '145px', md: '220px', lg: '145px', xl: '225px' }}
          >
            Whitepaper
          </Button>
          <Button
            as="a"
            href={APP_URL}
            variant="filledRed"
            fontSize={{ sm: '12px', '2xl': 'unset' }}
            width={{ sm: '145px', md: '220px', lg: '145px', xl: '225px' }}
          >
            Get started
          </Button>
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
