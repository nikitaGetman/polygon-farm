import React from 'react';
import { Box, Flex, Input, InputGroup, InputRightElement, Link, Text } from '@chakra-ui/react';
import Logo from '@/assets/images/logo.svg';
import { ReactComponent as TelegramIcon } from '@/components/Landing/images/tg.svg';
import { ReactComponent as TwitterIcon } from '@/components/Landing/images/twitter.svg';
import { ReactComponent as DiscordIcon } from '@/components/Landing/images/discord.svg';
import { ReactComponent as SavIcon } from '@/components/Landing/images/sav.svg';
import { ReactComponent as SavrIcon } from '@/components/Landing/images/savr.svg';
import { ReactComponent as ArrowIcon } from '@/components/Landing/images/arrow-left.svg';
import './Footer.scss';

export const Footer = () => {
  return (
    <div className="app-footer">
      <Box className="footer">
        <Flex className="footer-top" justifyContent="space-between" alignItems="center">
          <Flex className="footer-top__left">
            <img src={Logo} alt="logo" />
          </Flex>
          <Flex className="footer-top__right">
            <Flex className="mail-list" flexDirection="column">
              <Text className="mail-list__heading">Join our mailing list</Text>
              <Text className="mail-list__subheading">Subscribe for updates and new features</Text>
              <InputGroup>
                <Input placeholder="Your email" variant="mailing" />
                <InputRightElement mr="0" children={<ArrowIcon />} />
              </InputGroup>
            </Flex>
            <Flex className="sav-container">
              <Box>
                <Flex className="sav-container__item" alignItems="center">
                  <SavIcon />
                  <Text ml="12px">1 SAV = 1 USDT</Text>
                </Flex>
                <Flex className="sav-container__item" alignItems="center">
                  <SavrIcon />
                  <Text ml="12px">1 SAVR = 1 USDT</Text>
                </Flex>
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <Box className="footer-bottom">
          <Flex className="footer-bottom__container" flexWrap="wrap" justifyContent="space-between">
            <Box className="footer-bottom__left">
              <Text className="footer-heading">Disclaimer</Text>
              <Text className="footer-text">
                The contents and opinions of this website are those of iSaver. iSaver is not
                responsible for any of your crypto losses. Please do not construe any of the above
                statements as to financial advice. Cryptocurrency investment is subject to high
                market risk!
              </Text>
            </Box>
            <Flex className="footer-bottom__right" flexDirection="column" pt="10px">
              <Text className="contact-heading">Contact us</Text>
              <Flex className="contact-icons">
                <TelegramIcon />
                <TwitterIcon />
                <DiscordIcon />
              </Flex>
              <Link className="contact-mail" href="mailto:isaver@gmail.com">
                isaver@gmail.com
              </Link>
            </Flex>
          </Flex>
        </Box>
      </Box>
    </div>
  );
};
