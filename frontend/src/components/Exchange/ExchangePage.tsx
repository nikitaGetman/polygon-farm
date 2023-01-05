import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  CloseButton,
  Container,
  Flex,
  IconButton,
  Link,
  Text,
} from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { ReactComponent as SwapIcon } from '@/assets/images/icons/swap.svg';
import { ReactComponent as SavIcon } from '@/assets/images/sav_icon.svg';
import { ReactComponent as UsdtIcon } from '@/assets/images/usdt_icon.svg';
import { useDocumentTitle, useMetaDescription } from '@/hooks/useMeta';
import { useSavBalance, useUsdtBalance } from '@/hooks/useTokenBalance';
import { useVendorSell } from '@/hooks/useVendorSell';
import { bigNumberToString, makeBigNumber } from '@/utils/number';

import { InputAmount } from '../ui/InputAmount/InputAmount';

const tokenPair = [
  {
    icon: (
      <Box m="3px 4px 3px 0">
        <UsdtIcon width="26px" />
      </Box>
    ),
    ticker: 'USDT',
  },
  {
    icon: <SavIcon width="32px" />,
    ticker: 'SAV',
  },
];
export const ExchangePage = () => {
  useDocumentTitle('iSaver | Buy SAV');
  useMetaDescription(
    'Exchange your USDT to SAV and discover all the possibilities of iSaver DeFi platform. The rate of our tokens is tied to the stablecoin. No volatile assets. No risk of losing value of stacked tokens.'
  );

  const [isTokenSell, setIsTokenSell] = useState(false);
  const [amount, setAmount] = useState<string>();
  const [sellAmount, setSellAmount] = useState<string>();

  const { address } = useAccount();
  const navigate = useNavigate();
  const {
    buyTokens,
    sellTokens,
    isSellAvailable,
    getTokenSellEquivalent,
    getTokenBuyEquivalent,
    sellCommission,
  } = useVendorSell();
  const usdtBalance = useUsdtBalance(address);
  const savBalance = useSavBalance(address);

  const handleClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const resetState = useCallback(() => {
    setAmount('');
    setSellAmount('');
  }, [setAmount, setSellAmount]);

  const handleSwap = useCallback(() => {
    if (!amount) return;

    if (isTokenSell) {
      sellTokens.mutateAsync(makeBigNumber(amount)).then(resetState);
    } else {
      buyTokens.mutateAsync(makeBigNumber(amount, 6)).then(resetState);
    }
  }, [isTokenSell, amount, sellTokens, buyTokens, resetState]);

  const toggleSell = useCallback(() => {
    setIsTokenSell((val) => !val);
    resetState();
  }, [setIsTokenSell, resetState]);

  const isLoading = buyTokens.isLoading || sellTokens.isLoading;
  const isSwapDisabled = !amount || parseFloat(amount) === 0 || (isTokenSell && !isSellAvailable);

  const tokens = useMemo(
    () => (isTokenSell ? [tokenPair[1], tokenPair[0]] : tokenPair),
    [isTokenSell]
  );

  const handleAmountChange = useCallback(
    (amount?: string) => {
      if (isTokenSell && amount) {
        const res = getTokenSellEquivalent(amount);
        setSellAmount(res ? res.toString() : undefined);
      } else {
        setSellAmount(amount);
      }
      setAmount(amount);
    },
    [getTokenSellEquivalent, isTokenSell]
  );

  const handleSellAmountChange = useCallback(
    (amount?: string) => {
      if (isTokenSell && amount) {
        const res = getTokenBuyEquivalent(amount);
        setAmount(res ? res.toString() : undefined);
      } else {
        setAmount(amount);
      }
      setSellAmount(amount);
    },
    [getTokenBuyEquivalent, isTokenSell]
  );

  return (
    <Container variant="dashboard" mt={{ sm: '30px', xl: '60px' }} mb="200px">
      <Link
        onClick={handleClose}
        textStyle="button"
        alignSelf="flex-start"
        mb={{ sm: '30px', xl: '40px' }}
      >
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        Back
      </Link>

      <Box
        bgColor="#213D2F"
        borderRadius="md"
        padding="30px"
        margin="0 auto"
        maxWidth="450px"
        boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
      >
        <Flex justifyContent="space-between" alignItems="center" mb="15px">
          <Text as="h2" textStyle="textSansBold" fontSize="26px">
            Exchange
          </Text>
          <CloseButton onClick={handleClose} size="lg" />
        </Flex>

        <Text textStyle="textSansBold" mb="30px" fontSize="16px">
          Please use only Polygon (MATIC) network
        </Text>

        <Box>
          <Text textStyle="textSansBold" mb="5px">
            From
          </Text>
          <InputAmount
            tokenIcon={tokens[0].icon}
            tokenTicker={tokens[0].ticker}
            onChange={handleAmountChange}
            placeholder="0"
            value={amount}
            total={
              isTokenSell
                ? bigNumberToString(savBalance.data || 0)
                : bigNumberToString(usdtBalance.data || 0, { decimals: 6 })
            }
          />
        </Box>

        <Flex justifyContent="center">
          <IconButton
            bgColor="bgGreen.800"
            _hover={{ bgColor: 'gray.200' }}
            border="none"
            isRound
            size="sm"
            aria-label="swap"
            icon={<SwapIcon />}
            onClick={toggleSell}
          />
        </Flex>

        <Box mb="16px">
          <Text textStyle="textSansBold">To</Text>
          <InputAmount
            placeholder="0"
            tokenIcon={tokens[1].icon}
            tokenTicker={tokens[1].ticker}
            value={sellAmount}
            onChange={handleSellAmountChange}
          />
        </Box>

        <Button
          width="100%"
          variant="outlined"
          onClick={handleSwap}
          disabled={isSwapDisabled || isLoading}
          isLoading={isLoading}
        >
          Confirm
        </Button>

        {isTokenSell ? (
          <Text mt="30px" textStyle="text1">
            {isSellAvailable ? (
              <>Token sell fee is {(sellCommission || 0) * 100}%</>
            ) : (
              <>
                The exchange is not available.
                <br />
                Contact your Leader or email us at{' '}
                <Link color="blue" href="mailto:exchange@isaver.io">
                  exchange@isaver.io
                </Link>{' '}
                with your wallet and the amount to be exchanged. Your exchange will be processed
                within 2 business days after verification.
              </>
            )}
          </Text>
        ) : null}
      </Box>
    </Container>
  );
};
