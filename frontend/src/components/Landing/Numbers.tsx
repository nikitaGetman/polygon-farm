import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';

import { ContractsEnum } from '@/hooks/contracts/useContractAbi';
import { useTokenContract } from '@/hooks/contracts/useTokenContract';
import { useSavTokenBurn } from '@/hooks/useSavTokenBurn';
import { useStaking } from '@/hooks/useStaking';
import { beautifyAmount, bigNumberToString, getReadableAmount } from '@/utils/number';

import './Landing.scss';

const maxSupply = BigNumber.from(10).pow(18).mul(1_000_000_000);
export const Numbers = () => {
  const { tvl } = useStaking();
  const savBurned = useSavTokenBurn();

  const savToken = useTokenContract(ContractsEnum.SAV);

  const totalSupply = useQuery(['sav-total-supply-query'], async () => {
    return await savToken.totalSupply();
  });

  const circulatingSupply = savBurned.data ? maxSupply.sub(savBurned.data) : maxSupply;

  return (
    <Flex mb={{ sm: '80px', xl: '100px', '2xl': '190px' }} justifyContent="center" flexWrap="wrap">
      <Flex w="100%" justifyContent="center">
        <h4 className="heading">Our numbers</h4>
      </Flex>
      <Flex flexWrap="wrap" justifyContent="space-between" className="number">
        <Flex className="number-item">
          <Text className="number-item__heading">Token Symbol</Text>
          <Text className="number-item__text" color="green.400">
            SAV
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Type Token</Text>
          <Text className="number-item__text" color="green.400">
            ERC20
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Chain</Text>
          <Text className="number-item__text" color="green.400" textTransform="capitalize">
            Polygon
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Max Supply</Text>
          <Text className="number-item__text" color="green.400">
            {getReadableAmount(maxSupply, { precision: 0, prettify: true })}
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Total Supply</Text>
          <Text className="number-item__text" color="green.400">
            {getReadableAmount(totalSupply.data || maxSupply, { precision: 0, prettify: true })}
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Circulating Supply</Text>
          <Text className="number-item__text" color="green.400">
            {getReadableAmount(circulatingSupply, { precision: 0, prettify: true })}
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Holders</Text>
          <Text className="number-item__text" color="green.400">
            {'> 1 K'}
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Total Value Locked</Text>
          <Text className="number-item__text" color="green.400">
            {beautifyAmount(bigNumberToString(tvl || 0, { precision: 0 }), '', true)}
          </Text>
        </Flex>
        <Flex className="number-item">
          <Text className="number-item__heading">Total Burned</Text>
          <Text className="number-item__text" color="green.400">
            {beautifyAmount(bigNumberToString(savBurned.data || 0, { precision: 0 }), '', true)}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
