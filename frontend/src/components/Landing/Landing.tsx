import React from 'react';
import { Box } from '@chakra-ui/react';

import { About } from '@/components/Landing/About';
import { Banner } from '@/components/Landing/Banner';
import { Benefits } from '@/components/Landing/Benefits';
import { Lottery } from '@/components/Landing/Lottery';
import { Main } from '@/components/Landing/Main';
import { Numbers } from '@/components/Landing/Numbers';
import { Plans } from '@/components/Landing/Plans';

import './Landing.scss';

export const Landing = () => {
  return (
    <Box overflowX="hidden">
      <Box
        id="top"
        className="main-container"
        paddingTop={{ sm: '20px', lg: '43px', xl: '55px', '2xl': '100px' }}
      >
        <Main />
      </Box>
      <About />
      <Box className="main-container">
        <Benefits />
        <Numbers />
        <Plans />
      </Box>
      <Box className="main-container" overflow="visible">
        <Lottery />
      </Box>
      <Banner />
    </Box>
  );
};

export default Landing;
