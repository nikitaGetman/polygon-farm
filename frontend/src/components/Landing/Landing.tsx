import React from 'react';
import { Box } from '@chakra-ui/react';

import { Footer } from '@/components/Footer/Footer';
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
    <>
      <Box className="main-container" paddingTop="60px">
        <Main />
      </Box>
      <About />
      <Box className="main-container">
        <Benefits />
        <Numbers />
        <Plans />
      </Box>
      <Banner />
      <Box className="main-container">
        <Lottery />
      </Box>
      <Footer />
    </>
  );
};
