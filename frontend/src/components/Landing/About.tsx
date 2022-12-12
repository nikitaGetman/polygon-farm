import React from 'react';
import { Box, Flex, Text, useBreakpoint } from '@chakra-ui/react';
import './Landing.scss';
import { ReactComponent as BlueboxIcon } from './images/bluebox.svg';
import { ReactComponent as GreenboxIcon } from './images/greenbox.svg';
import { ReactComponent as BlueboxIconSm } from './images/bluebox_sm.svg';
import { ReactComponent as GreenboxIconSm } from './images/greenbox_sm.svg';

export const About = () => {
  return (
    <Flex className="about-container">
      <Box className="main-container">
        <Flex alignItems="center">
          <Box className="about-container__img" data-atrr={useBreakpoint()}>
            {useBreakpoint() === 'lg' && (
              <>
                <BlueboxIconSm />
              </>
            )}
            {useBreakpoint() !== 'lg' && (
              <>
                <BlueboxIcon />
              </>
            )}
          </Box>
          <Flex className="heading-container" flexWrap="wrap" justifyContent="center" maxW="620px">
            <h4 className="heading">About Isaver</h4>
            <h5 className="subheading">
              Decentralized Finance made easy and accessible for everyone
            </h5>
            <Text className="text" textAlign="center">
              iSaver это DeFi platform, которая позволяет каждому участнику достичь финансового
              успеха. Уже сейчас мы предлагаем стабильные инвестиции через стейкинг-пулы на базе
              наших токенов SAV и SAVR, много-уровненную реферальную программу, дополнительно
              поощряющую активных участников, а так же доступную всем еженедельную лотерею. В
              будущем мы построим экосистему, объединяющую DeFi platform, marketplace and crypto
              game based on Non-Fungible Tokens.
            </Text>
          </Flex>
          <Box className="about-container__img">
            {useBreakpoint() === 'lg' && (
              <>
                <GreenboxIconSm />
              </>
            )}
            {useBreakpoint() !== 'lg' && (
              <>
                <GreenboxIcon />
              </>
            )}
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};
