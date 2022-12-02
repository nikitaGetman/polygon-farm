import React from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import './Landing.scss';

export const Numbers = () => {
  return (
    <Flex mb="180px" justifyContent="center" flexWrap="wrap">
      <Flex w="100%" justifyContent="center">
        <h4 className="heading">Our numbers</h4>
      </Flex>
      <Flex flexWrap="wrap" justifyContent="space-between" className="number">
        <Flex className="number-item">
          <Text className="number-item__heading">Token Symbol:</Text>
          <Text className="number-item__text">SAV</Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Type Token:</Text>
          <Text className="number-item__text" color="green">
            ERC20
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Chain:</Text>
          <Text className="number-item__text" color="green">
            Polygon
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Max Supply:</Text>
          <Text className="number-item__text" color="green">
            1 000 M
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Total Supply:</Text>
          <Text className="number-item__text" color="green">
            1 000 M
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Circulating Supply:</Text>
          <Text className="number-item__text" color="green">
            1 000 M
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Holders:</Text>
          <Text className="number-item__text" color="green">
            2 309
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Total Value Locked (TVL):</Text>
          <Text className="number-item__text" color="green">
            115 344
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Total Burned:</Text>
          <Text className="number-item__text" color="green">
            5 344
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
