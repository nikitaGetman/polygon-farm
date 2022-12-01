import React, { FC } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import { BigNumberish } from 'ethers';
import prizeBackground from './assets/prize_background.svg';

type LotteryDescriptionProps = {
  prize: BigNumberish;
};
export const LotteryDescription: FC<LotteryDescriptionProps> = ({ prize }) => {
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
            100 000
            <Text as="span" ml="15px" fontSize="46px">
              SAVR
            </Text>
          </Text>
        </Flex>
      </Box>
      <Flex flexDirection="column" padding="40px">
        <Text mb="30px" textStyle="h3" textTransform="uppercase">
          Raffle details
        </Text>

        <Text mb="15px" textStyle="textSemiBold" fontSize="16px" textTransform="uppercase">
          Наименование
        </Text>
        <Text mb="15px" textStyle="textSemiBold" fontSize="16px" textTransform="uppercase">
          Наименование
        </Text>
        <Text mb="15px" textStyle="textSemiBold" fontSize="16px" textTransform="uppercase">
          Наименование
        </Text>
        <Text textStyle="textSemiBold" fontSize="16px" textTransform="uppercase">
          Наименование
        </Text>
      </Flex>
    </Box>
  );
};
