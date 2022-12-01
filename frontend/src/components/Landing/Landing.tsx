import React from 'react';
import { Box } from '@chakra-ui/react';
import './Landing.scss';
import { Main } from '@/components/Landing/Main';
import { About } from '@/components/Landing/About';
import { Benefits } from '@/components/Landing/Benefits';
import { Numbers } from '@/components/Landing/Numbers';
import { Plans } from '@/components/Landing/Plans';
import { Banner } from '@/components/Landing/Banner';
import { Lottery } from '@/components/Landing/Lottery';

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
    </>
  );
};
