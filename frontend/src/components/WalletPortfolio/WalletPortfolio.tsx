import React from 'react';
import { Text, Box, Flex, Button } from '@chakra-ui/react';
import { useAccount, useDisconnect } from 'wagmi';
import './WalletPortfolio.scss';
import { ReactComponent as PuzzlesIcon } from '@/assets/images/icons/puzzles.svg';
import { ReactComponent as ForkIcon } from '@/assets/images/icons/fork.svg';
import { ReactComponent as PlusIcon } from '@/assets/images/icons/plus.svg';
import { ConnectWalletButton } from '@/components/ConnectWalletButton/ConnectWalletButton';

export const WalletPortfolio = () => {
  const { isConnected } = useAccount();
  return (
    <Box background="rgba(0, 0, 0, 0.2)" borderRadius="10px" flex="1 1 510px" p="30px" maxW="510px">
      <Text textStyle="textMedium" mb="5">
        Wallet portfolio
      </Text>
      {isConnected && (
        <>
          <Box h="220px">
            <ForkIcon />
          </Box>
          <Flex mt="23px" justifyContent="space-between">
            <Flex flexWrap="wrap" maxW="200px">
              <Flex alignItems="center" color="blue">
                <Text mr="2" textStyle="textMedium">
                  0.000
                </Text>
                <Text textStyle="textList">SAV</Text>
              </Flex>
              <Button mt="5" rightIcon={<PlusIcon />}>
                Add to wallet
              </Button>
            </Flex>
            <Flex flexWrap="wrap" maxW="200px">
              <Flex alignItems="center" color="green.400">
                <Text mr="2" textStyle="textMedium">
                  0.000
                </Text>
                <Text textStyle="textList">SAVR </Text>
              </Flex>
              <Button mt="5" rightIcon={<PlusIcon />}>
                Add to wallet
              </Button>
            </Flex>
          </Flex>
        </>
      )}
      {!isConnected && (
        <>
          <Box h="220px" color="#1A725C" transition="all .3s ease" _hover={{ color: 'green.200' }}>
            <PuzzlesIcon />
          </Box>
          <Flex mt="23px" mb="22px" justifyContent="space-between">
            <Flex>
              <Text mr="2" textStyle="textList">
                Total Value Locked
              </Text>
              <Text textStyle="text1">0.000</Text>
            </Flex>
            <Flex>
              <Text mr="2" textStyle="textList">
                Total Claimed
              </Text>
              <Text textStyle="text1">0.000</Text>
            </Flex>
          </Flex>
          <ConnectWalletButton></ConnectWalletButton>
        </>
      )}
    </Box>
  );
};
