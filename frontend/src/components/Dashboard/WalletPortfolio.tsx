import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { ReactComponent as BoxIcon } from '@/assets/images/icons/box.svg';
import { ReactComponent as PlusIcon } from '@/assets/images/icons/plus.svg';
import { ReactComponent as PuzzlesIcon } from '@/assets/images/icons/puzzles.svg';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useAddTokens } from '@/hooks/useAddTokens';
import { useStaking } from '@/hooks/useStaking';
import { useSavBalance, useSavRBalance, useTokenBalanceHistory } from '@/hooks/useTokenBalance';
import { bigNumberToString, getReadableAmount } from '@/utils/number';

import { BalanceHistoryChart } from './BalanceChart';

const buttonProps = {
  mt: { sm: '20px', md: '10px', lg: '15px', xl: '10px', '2xl': '20px' },
  rightIcon: <PlusIcon />,
  size: { sm: 'xl', xl: 'md', '2xl': 'xl' },
  fontSize: { xl: '12px', '2xl': 'unset' },
  width: { sm: '100%', md: '200px', xl: '160px', '2xl': '200px' },
};

export const WalletPortfolio = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { addSAV, addSAVR } = useAddTokens();

  const { data: savBalance } = useSavBalance();
  const { data: savrBalance } = useSavRBalance();

  const { balanceHistory } = useTokenBalanceHistory();

  const { tvl, totalClaimed } = useStaking();

  return (
    <Flex alignItems={{ sm: 'stretch', xl: 'center' }} direction={{ sm: 'column', xl: 'row' }}>
      <Box flexGrow="1" mb={{ sm: '45px', xl: 'unset' }}>
        <Text textStyle="h1" as="h1" fontSize={{ sm: '38px', xl: '52px', '2xl': '90px' }}>
          DASHBOARD
        </Text>
        <Text textStyle="textMedium" fontSize={{ sm: '16px', xl: '18px', '2xl': '32px' }} mt="10px">
          All information about your assets
        </Text>
        <Flex
          alignItems="center"
          textStyle="textMedium"
          mt={{ sm: '30px', xl: '50px', '2xl': '80px' }}
          fontSize={{ sm: '16px', md: '18px', '2xl': '26px' }}
          fontWeight={{ sm: '600', md: '700', xl: '500' }}
        >
          <Text mr="40px">SAV = 1 USDT</Text>
          <Text>SAVR = 1 USDT</Text>
        </Flex>
        <Button
          mt="30px"
          width={{ sm: '100%', xl: 'unset' }}
          rightIcon={<BoxIcon />}
          onClick={() => navigate('/exchange')}
        >
          Buy SAV
        </Button>
      </Box>

      <Box
        background="rgba(0, 0, 0, 0.2)"
        borderRadius="md"
        padding={{ sm: '30px 10px', md: '24px 10px', lg: '30px 20px', xl: '20px', '2xl': '30px' }}
        flexGrow="1"
        maxW={{ sm: '100%', xl: '380px', '2xl': '510px' }}
      >
        <Text
          fontSize={{ sm: '18px', xl: '22px', '2xl': '26px' }}
          fontWeight={{ sm: '400', xl: '500' }}
          mb="20px"
          textTransform="uppercase"
        >
          Wallet portfolio
        </Text>

        {isConnected ? (
          <>
            <Box h="220px" overflow="hidden">
              {balanceHistory.length ? (
                <BalanceHistoryChart data={balanceHistory} />
              ) : (
                <Box color="bgGreen.600">
                  <PuzzlesIcon />
                </Box>
              )}
            </Box>
            <Flex mt="15px" justifyContent="space-between" direction={{ sm: 'column', md: 'row' }}>
              <Flex flexWrap="wrap" width={{ sm: '100%', md: '50%' }}>
                <Flex alignItems="baseline" color="green.400" textStyle="textSansBold" width="100%">
                  <Text
                    mr="1"
                    textStyle="textMedium"
                    minWidth="0"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    overflow="hidden"
                  >
                    {savBalance ? bigNumberToString(savBalance) : '---'}
                  </Text>
                  SAV
                </Flex>
                <Button {...buttonProps} onClick={addSAV}>
                  Add to wallet
                </Button>
              </Flex>
              <Flex
                flexWrap="wrap"
                width={{ sm: '100%', md: '50%' }}
                mt={{ sm: '30px', md: 'unset' }}
              >
                <Flex alignItems="baseline" color="blue" textStyle="textSansBold" width="100%">
                  <Text
                    mr="1"
                    textStyle="textMedium"
                    minWidth="0"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    overflow="hidden"
                  >
                    {savrBalance ? bigNumberToString(savrBalance) : '---'}
                  </Text>
                  SAVR
                </Flex>
                <Button {...buttonProps} onClick={addSAVR}>
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
            <Flex
              gap={2}
              direction={{ sm: 'column', md: 'row' }}
              margin={{ sm: '12px 0 20px', md: '15px 0', '2xl': '20px 0' }}
              textStyle={{ sm: 'textSansSmall', '2xl': 'textSansBold' }}
            >
              <Flex alignItems="baseline" width="50%" whiteSpace="nowrap">
                <Text mr="8px">Total Value Locked</Text>
                <Text fontSize="18px" fontWeight="500">
                  {getReadableAmount(tvl || 0, { precision: 3 })}
                </Text>
              </Flex>
              <Flex
                alignItems="baseline"
                width="50%"
                justifyContent={{ sm: 'flex-start', xl: 'flex-end' }}
              >
                <Text mr="8px">Total Claimed</Text>
                <Text fontSize="18px" fontWeight="500">
                  {getReadableAmount(totalClaimed || 0, { precision: 3 })}
                </Text>
              </Flex>
            </Flex>

            <ConnectWalletButton width={{ sm: '100%', xl: 'unset' }} size="lg" />
          </>
        )}
      </Box>
    </Flex>
  );
};
