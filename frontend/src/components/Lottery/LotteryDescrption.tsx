import React, { FC, useMemo } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { BigNumberish } from 'ethers';

import { bigNumberToString } from '@/utils/number';

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
      <Box padding="70px 56px 56px" bgImage={prizeBackground} bgPosition="top left" bgSize="cover">
        <Flex flexDirection="column">
          <Text
            mb="32px"
            textStyle="heading1"
            fontSize="72px"
            textAlign="center"
            fontWeight="900"
            color="white"
            textShadow="0px 4px 10px rgba(0, 0, 0, 0.71)"
            textTransform="uppercase"
            lineHeight="65px"
          >
            Prize pot
          </Text>

          <Text
            fontSize="80px"
            textAlign="center"
            fontWeight="900"
            color="blue"
            textShadow="0px 4px 10px rgba(0, 0, 0, 0.71)"
            lineHeight="65px"
          >
            {bigNumberToString(prize, { precision: 0 })}
            <Text as="span" ml="15px" fontSize="46px">
              SAVR
            </Text>
          </Text>
        </Flex>
      </Box>
      <Flex flexDirection="column" padding="40px">
        <Text mb="26px" textStyle="textMedium" textTransform="uppercase">
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
