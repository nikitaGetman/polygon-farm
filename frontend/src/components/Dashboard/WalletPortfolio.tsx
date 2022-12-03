import React from 'react';
import { Text, Box, Flex, Button } from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { ReactComponent as PuzzlesIcon } from '@/assets/images/icons/puzzles.svg';
import { ReactComponent as PlusIcon } from '@/assets/images/icons/plus.svg';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useAddTokens } from '@/hooks/useAddTokens';
import { bigNumberToString, getReadableAmount } from '@/utils/number';
import { ReactComponent as BoxIcon } from '@/assets/images/icons/box.svg';
import { useSavBalance, useTokenBalanceHistory, useSavRBalance } from '@/hooks/useTokenBalance';
import { useStaking } from '@/hooks/useStaking';
import { BalanceHistoryChart } from './BalanceChart';
import { useNavigate } from 'react-router-dom';

export const WalletPortfolio = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { addSAV, addSAVR } = useAddTokens();

  const { data: savBalance } = useSavBalance();
  const { data: savrBalance } = useSavRBalance();

  const { balanceHistory } = useTokenBalanceHistory();

  const { tvl, totalClaimed } = useStaking();

  return (
    <Flex alignItems="center">
      <Box flex="1 1 600px">
        <Text textStyle="h1" as="h1" fontSize="90px" lineHeight="99px">
          DASHBOARD
        </Text>
        <Text textStyle="textMedium" fontSize="32px" mt={2}>
          All information about your assets
        </Text>
        <Flex alignItems="center" mt="80px">
          <Text textStyle="textMedium" mr="40px">
            SAV = 1 USDT
          </Text>
          <Text textStyle="textMedium">SAVR = 1 USDT</Text>
        </Flex>
        <Button mt="30px" rightIcon={<BoxIcon />} onClick={() => navigate('/exchange')}>
          Buy SAV
        </Button>
      </Box>

      <Box background="rgba(0, 0, 0, 0.2)" borderRadius="md" p="30px" maxW="510px" flexGrow="1">
        <Text textStyle="textMedium" mb="5" textTransform="uppercase">
          Wallet portfolio
        </Text>

        {isConnected ? (
          <>
            <Box h="220px">
              {balanceHistory.length ? (
                <BalanceHistoryChart data={balanceHistory} />
              ) : (
                <Box color="bgGreen.600">
                  <PuzzlesIcon />
                </Box>
              )}
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
            <Box color="bgGreen.600" transition="all .3s ease" _hover={{ color: 'green.500' }}>
              <PuzzlesIcon />
            </Box>
            <Flex mt="23px" mb="22px" justifyContent="space-between">
              <Flex>
                <Text mr="2" textStyle="textSansBold">
                  Total Value Locked
                </Text>
                <Text textStyle="text1">{getReadableAmount(tvl || 0, { precision: 3 })}</Text>
              </Flex>
              <Flex>
                <Text mr="2" textStyle="textSansBold">
                  Total Claimed
                </Text>
                <Text textStyle="text1">
                  {getReadableAmount(totalClaimed || 0, { precision: 3 })}
                </Text>
              </Flex>
            </Flex>
            <ConnectWalletButton />
          </>
        )}
      </Box>
    </Flex>
  );
};
