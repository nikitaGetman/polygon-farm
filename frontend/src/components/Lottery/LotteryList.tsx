import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Skeleton,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { LotteryStatusEnum, useLottery } from '@/hooks/useLottery';
import { getReadableAmount } from '@/utils/number';

import { ConnectWalletButton } from '../ui/ConnectWalletButton/ConnectWalletButton';
import { StatBlock } from '../ui/StatBlock/StatBlock';

import { LotteryItem } from './LotteryItem';

const lotteries: any[] = [
  {
    id: 30,
    title: 'Ultra raffle 030 + 1day',
    timestamp: Date.now() + 86_400_000,
    status: LotteryStatusEnum.upcoming,
  },
  {
    id: 31,
    title: 'Ultra raffle 031',
    timestamp: Date.now() + 1000_000,
    status: LotteryStatusEnum.current,
  },
  {
    id: 32,
    title: 'Ultra raffle 032',
    timestamp: Date.now() - 1000_000,
    status: LotteryStatusEnum.past,
  },
];

export const LotteryList = () => {
  const { isConnected } = useAccount();
  const [stateFilter, setStateFilter] = useState<LotteryStatusEnum>(LotteryStatusEnum.current);
  const navigate = useNavigate();

  const { ticketBalance, userTotalPrize } = useLottery();

  return (
    <Container variant="dashboard">
      <Flex alignItems="center" gap="2">
        <Heading textStyle="h1">Win big prizes</Heading>
        <Spacer />
        <Box>{!isConnected ? <ConnectWalletButton /> : null}</Box>
      </Flex>
      <Box maxWidth="505px" mt={5}>
        <Text textStyle="text1">
          Join iSaver Raffles gives you a chance to win big prizes! It's easy if you have a ticket.
        </Text>
      </Box>

      <Flex justifyContent="space-between" my="30px" alignItems="flex-end">
        <ButtonGroup isAttached>
          <Button
            borderRadius="sm"
            variant={stateFilter === LotteryStatusEnum.current ? 'active' : 'inactive'}
            onClick={() => setStateFilter(LotteryStatusEnum.current)}
          >
            Live
          </Button>
          <Button
            borderRadius="sm"
            variant={stateFilter === LotteryStatusEnum.upcoming ? 'active' : 'inactive'}
            onClick={() => setStateFilter(LotteryStatusEnum.upcoming)}
          >
            Upcoming
          </Button>
          <Button
            borderRadius="sm"
            variant={stateFilter === LotteryStatusEnum.past ? 'active' : 'inactive'}
            onClick={() => setStateFilter(LotteryStatusEnum.past)}
          >
            Past
          </Button>
        </ButtonGroup>

        <Flex>
          <StatBlock width="260px">
            <Box textStyle="text1" mb="10px">
              Your tickets
            </Box>
            <Box textStyle="text1">
              <Box as="span" textStyle="textSansBold" fontSize="26px" mr="6px">
                {ticketBalance || '0'}
              </Box>
            </Box>
          </StatBlock>
          <StatBlock width="260px">
            <Box textStyle="text1" mb="10px">
              Total Raffles Reward
            </Box>
            <Box textStyle="text1">
              <Box as="span" textStyle="textSansBold" fontSize="26px" mr="6px">
                {getReadableAmount(userTotalPrize || 0)}
              </Box>
              SAVR
            </Box>
          </StatBlock>
        </Flex>
      </Flex>

      <Grid templateColumns="repeat(3, 1fr)" gap="20px">
        {!lotteries.length
          ? Array.from({ length: 3 }).map((_, index) => (
              <GridItem w="100%" key={index}>
                <Skeleton
                  height="287px"
                  borderRadius="md"
                  startColor="gray.200"
                  endColor="bgGreen.200"
                />
              </GridItem>
            ))
          : null}

        {lotteries.map(({ id, title, status, timestamp }) => (
          <GridItem w="100%" key={id}>
            <LotteryItem
              title={title}
              status={status}
              timestamp={timestamp}
              onDetails={() => navigate(`/lottery/${id}`)}
            />
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};
