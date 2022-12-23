import React from 'react';
import { Box, Flex, Text, useBreakpoint } from '@chakra-ui/react';

import { ReactComponent as BlueboxIcon } from './images/bluebox.svg';
import { ReactComponent as GreenboxIcon } from './images/greenbox.svg';

import './Landing.scss';

export const About = () => {
  const bp = useBreakpoint({ ssr: false });
  const isXl = bp === 'xl';

  return (
    <Flex className="about-container">
      <Flex alignItems="center" width="100%" justifyContent="center">
        <Box className="about-container__img" data-atrr={useBreakpoint()}>
          <BlueboxIcon height={isXl ? '304px' : '594px'} />
        </Box>
        <Flex className="heading-container" flexWrap="wrap" justifyContent="center" maxW="820px">
          <h4 className="heading">About Isaver</h4>
          <h5 className="subheading">
            Decentralized Finance made easy and accessible for everyone
          </h5>
          <Text className="text" textAlign="center">
            iSaver is a DeFi platform which allows users to get a financial success. We offer the
            stable investments through Staking pools based on our tokens SAV and SAVR. Multi-level
            Referral Program additionally rewards active participants. Our weekly Raffles are
            available for everyone. In the future we are planning to build the ecosystem, which will
            include DeFi platform, marketplace and crypto game based on Non-Fungible Tokens (NFTs).
          </Text>
        </Flex>
        <Box className="about-container__img">
          <GreenboxIcon height={isXl ? '304px' : '605px'} />
        </Box>
      </Flex>
    </Flex>
  );
};
