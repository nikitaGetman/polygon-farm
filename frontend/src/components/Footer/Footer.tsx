import React, { useCallback, useRef, useState } from 'react';
import { Box, Flex, Input, InputGroup, InputRightElement, Link, Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import Logo from '@/assets/images/logo.svg';
import { ReactComponent as ArrowIcon } from '@/components/Landing/images/arrow-right.svg';
import { ReactComponent as DiscordIcon } from '@/components/Landing/images/discord.svg';
import { ReactComponent as SavIcon } from '@/components/Landing/images/sav.svg';
import { ReactComponent as SavrIcon } from '@/components/Landing/images/savr.svg';
import { ReactComponent as TelegramIcon } from '@/components/Landing/images/tg.svg';
import { ReactComponent as TwitterIcon } from '@/components/Landing/images/twitter.svg';
import { validateEmail } from '@/utils/email';
import { sendDataMessage } from '@/utils/sendDataMessage';

import './Footer.scss';

export const Footer = () => {
  const { address } = useAccount();
  const [email, setEmail] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const submitEmail = useCallback(
    (e: any) => {
      e.preventDefault();
      if (email && validateEmail(email)) {
        const message = `Пользователь оставил Email: ${email}\nКошелек: ${
          address || '<i>не авторизован</i>'
        }`;
        sendDataMessage(message);
        setEmail('');
        inputRef.current?.blur();
      }
    },
    [email, address, setEmail]
  );

  return (
    <Box className="footer">
      <Flex className="footer-top">
        <Flex className="footer-top__left">
          <img src={Logo} alt="logo" />
        </Flex>
        <Flex className="footer-top__right">
          <Flex className="mail-list" flexDirection="column">
            <Text className="mail-list__heading">Join our mailing list</Text>
            <Text className="mail-list__subheading">Subscribe for updates and new features</Text>
            <form onSubmit={submitEmail}>
              <InputGroup>
                <Input
                  ref={inputRef}
                  className="mail-list__input"
                  placeholder="Your email"
                  variant="mailing"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <InputRightElement
                  mr="0"
                  pr="16px"
                  width="60px"
                  cursor="pointer"
                  children={<ArrowIcon width="100%" />}
                  onClick={submitEmail}
                />
              </InputGroup>
            </form>
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
              The contents and opinions of this website are those of iSaver.
              <br />
              iSaver is not responsible for any of your crypto losses. Please do not construe any of
              the above statements as to financial advice. Cryptocurrency investment is subject to
              high market risk!
            </Text>
          </Box>
          <Flex className="footer-bottom__right" flexDirection="column" pt="10px">
            <Text className="contact-heading">Contact us</Text>
            {/* <Flex className="contact-icons">
              <a href="#" target="_blank">
                <TelegramIcon />
              </a>
              <a href="#" target="_blank">
                <TwitterIcon />
              </a>
              <a href="#" target="_blank">
                <DiscordIcon />
              </a>
            </Flex> */}
            <Link className="contact-mail" href="mailto:hello@isaver.io ">
              hello@isaver.io
            </Link>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
