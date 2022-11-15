import React from 'react';
import { Text, Box, Flex, Button } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { ReactComponent as PuzzlesIcon } from '@/assets/images/icons/puzzles.svg';
import { ReactComponent as ForkIcon } from '@/assets/images/icons/fork.svg';
import { ReactComponent as PlusIcon } from '@/assets/images/icons/plus.svg';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useAddTokens } from '@/hooks/useAddTokens';
import { bigNumberToString } from '@/utils/number';
import { ReactComponent as BoxIcon } from '@/assets/images/icons/box.svg';
import { useSavBalance, useSavRBalance } from '@/hooks/useTokenBalance';

export const WalletPortfolio = () => {
  const { isConnected } = useAccount();
  const { addSAV, addSAVR } = useAddTokens();

  const { data: savBalance } = useSavBalance();
  const { data: savrBalance } = useSavRBalance();

  return (
    <Flex alignItems="center">
      <Box flex="1 1 600px">
        <Text textStyle="h1" fontSize="90px" lineHeight="99px">
          DASHBOARD
        </Text>
        <Text textStyle="textMedium" fontSize="32px" mt={2}>
          All information about your assets
        </Text>
        <Flex alignItems="center" mt="80px">
          <Text textStyle="textMedium" mr="40px">
            SAV = 00 USDT
          </Text>
          <Text textStyle="textMedium">SAVR = 00 USDT</Text>
        </Flex>
        <Button mt="30px" rightIcon={<BoxIcon />}>
          Buy SAV
        </Button>
      </Box>

      <Box background="rgba(0, 0, 0, 0.2)" borderRadius="md" p="30px" maxW="510px">
        <Text textStyle="textMedium" mb="5">
          Wallet portfolio
        </Text>

        {isConnected ? (
          <>
            <Box h="220px">
              <ForkIcon />
            </Box>
            <Flex mt="17px" justifyContent="space-between">
              <Flex flexWrap="wrap" maxW="200px">
                <Flex alignItems="baseline" color="green.400">
                  <Text mr="2" textStyle="textMedium">
                    {savBalance ? bigNumberToString(savBalance, 18) : '---'}
                  </Text>
                  <Text textStyle="textSansBold">SAV</Text>
                </Flex>
                <Button mt="18px" rightIcon={<PlusIcon />} onClick={addSAV}>
                  Add to wallet
                </Button>
              </Flex>
              <Flex flexWrap="wrap" maxW="200px">
                <Flex alignItems="baseline" color="blue">
                  <Text mr="2" textStyle="textMedium">
                    {savrBalance ? bigNumberToString(savrBalance, 18) : '---'}
                  </Text>
                  <Text textStyle="textSansBold">SAVR</Text>
                </Flex>
                <Button mt="18px" rightIcon={<PlusIcon />} onClick={addSAVR}>
                  Add to wallet
                </Button>
              </Flex>
            </Flex>
          </>
        ) : (
          <>
            <Box
              height="220px"
              color="bgGreen.600"
              transition="all .3s ease"
              _hover={{ color: 'green.500' }}
            >
              <PuzzlesIcon />
            </Box>
            <Flex mt="23px" mb="22px" justifyContent="space-between">
              <Flex>
                <Text mr="2" textStyle="textSansBold">
                  Total Value Locked
                </Text>
                <Text textStyle="text1">0.000</Text>
              </Flex>
              <Flex>
                <Text mr="2" textStyle="textSansBold">
                  Total Claimed
                </Text>
                <Text textStyle="text1">0.000</Text>
              </Flex>
            </Flex>
            <ConnectWalletButton />
          </>
        )}
      </Box>
    </Flex>
  );
};
