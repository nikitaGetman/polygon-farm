import React from 'react';
import { Flex, Text } from '@chakra-ui/react';

import { ReactComponent as BankIcon } from './images/b_bank.svg';
import { ReactComponent as BurnIcon } from './images/b_burn.svg';
import { ReactComponent as PeopleIcon } from './images/b_people.svg';
import { ReactComponent as ScalesIcon } from './images/b_scales.svg';

import './Landing.scss';

export const Benefits = () => {
  return (
    <Flex
      justifyContent="center"
      flexWrap="wrap"
      className="benefit"
      flexDirection="column"
      alignItems="center"
    >
      <h4 className="heading">Our benefits</h4>
      <Flex justifyContent="center" className="benefit-container">
        <Flex className="icons-card card--shadow">
          <BankIcon />
          <Text className="icons-card__heading">Stable Passive Income</Text>
          <Text className="icons-card__text">
            All our stacking pools have fixed interest rates. You will always know exactly your
            profit and plan for the future.
          </Text>
        </Flex>
        <Flex className="icons-card card--shadow">
          <ScalesIcon />
          <Text className="icons-card__heading">Pegged to USDT&nbsp;1&nbsp;:&nbsp;1</Text>
          <Text className="icons-card__text">
            The rate of our tokens is tied to the stablecoin. No volatile assets. No risk of losing
            value of staked tokens.
          </Text>
        </Flex>
        <Flex className="icons-card card--shadow">
          <BurnIcon />
          <Text className="icons-card__heading">Deflationary tokenomik</Text>
          <Text className="icons-card__text">
            Payment of all fees and subscriptions burns tokens. This will support the exchange rate
            even after listing on DEX in the future.
          </Text>
        </Flex>
        <Flex className="icons-card card--shadow">
          <PeopleIcon />
          <Text className="icons-card__heading">Multi-type Referral Program</Text>
          <Text className="icons-card__text">
            We offer 10-levels marketing to all users. You can invite your friends and earn up to
            100% from your friends' earnings.
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
