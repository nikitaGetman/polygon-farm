import React, { FC, useMemo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { BigNumberish } from 'ethers';

import { beautifyAmount, bigNumberToString } from '@/utils/number';

import prizeBackground from './assets/prize_background.svg';

import './lottery.scss';

type LotteryDescriptionProps = {
  prize: BigNumberish;
  prizeForLevel: number[];
  winnersForLevel: number[];
};
export const LotteryDescription: FC<LotteryDescriptionProps> = ({
  prize,
  prizeForLevel,
  winnersForLevel,
}) => {
  const totalWinners = useMemo(
    () => winnersForLevel.reduce((acc, winners) => acc + winners, 0),
    [winnersForLevel]
  );

  return (
    <Box bgColor="bgGreen.50" boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)" borderRadius="md">
      <Box
        padding={{
          sm: '38px 10px 40px',
          md: '60px 10px 45px',
          lg: '42px 10px 34px',
          xl: '55px 10px 45px',
          '2xl': '70px 56px 56px',
        }}
        bgImage={prizeBackground}
        bgPosition="top left"
        bgSize="cover"
      >
        <Flex flexDirection="column">
          <Text
            mb={{ sm: '24px', md: '20px', lg: '14px', xl: '30px', '2xl': '32px' }}
            textStyle="heading1"
            fontSize={{ sm: '29px', md: '49px', lg: '29px', xl: '49px', '2xl': '72px' }}
            lineHeight={{ sm: '22px', md: '42px', lg: '22px', xl: '42px', '2xl': '65px' }}
            textAlign="center"
            fontWeight="900"
            color="white"
            textShadow="0px 4px 10px rgba(0, 0, 0, 0.71)"
            textTransform="uppercase"
          >
            Prize pot
          </Text>

          <Text
            textAlign="center"
            fontWeight="900"
            color="blue"
            textShadow="0px 4px 10px rgba(0, 0, 0, 0.71)"
            fontSize={{ sm: '33px', md: '55px', lg: '33px', xl: '55px', '2xl': '80px' }}
            lineHeight={{ sm: '22px', md: '42px', lg: '22px', xl: '42px', '2xl': '65px' }}
          >
            {beautifyAmount(bigNumberToString(prize, { precision: 0 }), '', true)}
            <Text
              as="span"
              fontSize={{ sm: '25px', md: '37px', lg: '25px', xl: '37px', '2xl': '46px' }}
            >
              SAVR
            </Text>
          </Text>
        </Flex>
      </Box>
      <Flex flexDirection="column" padding={{ sm: '30px 20px', '2xl': '40px 20px' }}>
        <Text
          mb={{ sm: '18px', '2xl': '26px' }}
          fontSize={{ sm: '18px', '2xl': '26px' }}
          textStyle="textMedium"
          textTransform="uppercase"
        >
          <>Total winners: {totalWinners}</>
        </Text>

        <table className="lottery-description__table">
          <thead>
            <tr>
              <th>Levels</th>
              <th>Winners</th>
              <th>% prize pot</th>
            </tr>
          </thead>
          <tbody>
            {winnersForLevel.map((winners, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{winners}</td>
                <td>{prizeForLevel[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Flex>
    </Box>
  );
};
