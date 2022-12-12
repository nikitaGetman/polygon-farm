import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import './Landing.scss';
import { ReactComponent as BankIcon } from './images/b_bank.svg';
import { ReactComponent as ScalesIcon } from './images/b_scales.svg';
import { ReactComponent as BurnIcon } from './images/b_burn.svg';
import { ReactComponent as PeopleIcon } from './images/b_people.svg';

export const Benefits = () => {
  return (
    <Flex justifyContent="center" flexWrap="wrap" className="benefit">
      <h4 className="heading">Our benefits</h4>
      <Flex justifyContent="space-between" className="benefit-container">
        <Flex className="icons-card card--shadow">
          <BankIcon />
          <Text className="icons-card__heading">
            Stable Passive <br /> Income
          </Text>
          <Text className="icons-card__text">
            All our stacking pools have fixed interest rates. You will always know exactly your
            profit and plan for the future.
          </Text>
        </Flex>
        <Flex className="icons-card card--shadow">
          <ScalesIcon />
          <Text className="icons-card__heading">
            Pegged to <br /> USDT 1 : 1
          </Text>
          <Text className="icons-card__text">
            The rate of our tokens is tied to the stablecoin. No volatile assets. No risk of losing
            value of staked tokens.
          </Text>
        </Flex>
        <Flex className="icons-card card--shadow">
          <BurnIcon />
          <Text className="icons-card__heading">
            Deflationary <br /> tokenomik
          </Text>
          <Text className="icons-card__text">
            Payment of all fees and subscriptions burns tokens. This will support the exchange rate
            even after listing on DEX in the future.
          </Text>
        </Flex>
        <Flex className="icons-card card--shadow">
          <PeopleIcon />
          <Text className="icons-card__heading">
            Multi-type Referral <br /> Program
          </Text>
          <Text className="icons-card__text">
            We offer 10-level marketing to all users. You can invite your friends and earn up to
            100% from your friends' earnings.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
