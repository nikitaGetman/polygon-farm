import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useVendorSell } from '@/hooks/useVendorSell';
import { InputAmount } from '../ui/InputAmount/InputAmount';
import { ReactComponent as SavIcon } from '@/assets/images/sav_icon.svg';
import { ReactComponent as UsdtIcon } from '@/assets/images/usdt_icon.svg';
import { ReactComponent as SwapIcon } from '@/assets/images/icons/swap.svg';
import { useSavBalance, useUsdtBalance } from '@/hooks/useTokenBalance';
import { bigNumberToString, makeBigNumber } from '@/utils/number';

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
  useEffect(() => {
    document.title = 'iSaver | Buy tokens';
  }, []);

  const [isTokenSell, setIsTokenSell] = useState(false);
  const [amount, setAmount] = useState<string>();

  const navigate = useNavigate();
  const { buyTokens, sellTokens, isSellAvailable } = useVendorSell();
  const usdtBalance = useUsdtBalance();
  const savBalance = useSavBalance();

  const handleClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleSwap = useCallback(() => {
    if (!amount) return;

    if (isTokenSell) {
      sellTokens.mutateAsync(makeBigNumber(amount)).then(() => setAmount(''));
    } else {
      buyTokens.mutateAsync(makeBigNumber(amount, 6)).then(() => setAmount(''));
    }
  }, [isTokenSell, amount, sellTokens, buyTokens]);

  const toggleSell = useCallback(() => {
    setIsTokenSell((val) => !val);
    setAmount('');
  }, [setIsTokenSell, setAmount]);

  const isLoading = buyTokens.isLoading || sellTokens.isLoading;
  const isSwapDisabled = !amount || (isTokenSell && !isSellAvailable);

  const tokens = useMemo(
    () => (isTokenSell ? [tokenPair[1], tokenPair[0]] : tokenPair),
    [isTokenSell]
  );

  return (
    <Container variant="dashboard" pt="60px">
      <Link onClick={handleClose} textStyle="button" alignSelf="flex-start" mb="40px">
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        Back
      </Link>

      <Box
        bgColor="#213D2F"
        borderRadius="md"
        padding="30px"
        margin="0 auto"
        width="450px"
        boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
      >
        <Flex justifyContent="space-between" alignItems="center" mb="15px">
          <Text as="h2" textStyle="textSansBold" fontSize="26px">
            Exchange
          </Text>
          <CloseButton onClick={handleClose} size="lg" />
        </Flex>

        <Text textStyle="textSansSmall" mb="30px">
          Trade tokens in an instant
        </Text>

        <Box>
          <Text textStyle="textSansBold" mb="5px">
            From
          </Text>
          <InputAmount
            tokenIcon={tokens[0].icon}
            tokenTicker={tokens[0].ticker}
            onChange={setAmount}
            placeholder="0"
            value={amount}
            total={
              isTokenSell
                ? bigNumberToString(savBalance.data || 0)
                : bigNumberToString(usdtBalance.data || 0, 6)
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
            value={amount}
            onChange={setAmount}
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

        <Text mt="30px" textStyle="text1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy
        </Text>
      </Box>
    </Container>
  );
};