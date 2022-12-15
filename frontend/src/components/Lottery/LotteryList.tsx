import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  ButtonGroup,
  Center,
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

import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { StatBlock } from '@/components/ui/StatBlock/StatBlock';
import { useLottery } from '@/hooks/useLottery';
import { useLotteryRounds } from '@/hooks/useLotteryRounds';
import { getNextLotteryTimestamp, LotteryStatusEnum } from '@/lib/lottery';
import { getLotteryTitle } from '@/utils/lottery';
import { getReadableAmount } from '@/utils/number';

import { LotteryItem } from './LotteryItem';

export const LotteryList = () => {
  const { isConnected } = useAccount();
  const [stateFilter, setStateFilter] = useState<LotteryStatusEnum>(LotteryStatusEnum.current);
  const navigate = useNavigate();

  const { ticketBalance, userTotalPrize } = useLottery();
  const { upcomingRounds, liveRounds, finishedRounds, activeRoundsRequest, finishedRoundsRequest } =
    useLotteryRounds();

  const updateLotteriesState = useCallback(() => {
    if ([LotteryStatusEnum.upcoming, LotteryStatusEnum.current].includes(stateFilter)) {
      activeRoundsRequest.refetch();
    } else {
      finishedRoundsRequest.refetch();
    }
  }, [stateFilter, activeRoundsRequest, finishedRoundsRequest]);

  const isLoading =
    stateFilter === LotteryStatusEnum.past
      ? finishedRoundsRequest.isLoading
      : activeRoundsRequest.isLoading;

  const loadedStateFilter = useMemo(() => {
    if (stateFilter === LotteryStatusEnum.current && liveRounds.length > 0) return stateFilter;
    if (stateFilter === LotteryStatusEnum.upcoming && upcomingRounds.length > 0) return stateFilter;
    if (stateFilter === LotteryStatusEnum.past && finishedRounds && finishedRounds.length > 0) {
      return stateFilter;
    }

    return (
      (liveRounds.length > 0 && LotteryStatusEnum.current) ||
      (upcomingRounds.length > 0 && LotteryStatusEnum.upcoming) ||
      LotteryStatusEnum.past
    );
  }, [stateFilter, liveRounds, upcomingRounds, finishedRounds]);

  const lotteries =
    loadedStateFilter === LotteryStatusEnum.current
      ? liveRounds
      : loadedStateFilter === LotteryStatusEnum.upcoming
      ? upcomingRounds
      : finishedRounds;

  return (
    <Container variant="dashboard">
      <Flex alignItems="center" gap="2">
        <Heading textStyle="h1">Win big prizes</Heading>
        <Spacer />
        <Box>{!isConnected ? <ConnectWalletButton /> : null}</Box>
      </Flex>
      <Box maxWidth="505px" mt={5}>
        <Text textStyle="text1">
          Join iSaver Raffles gives you a chance to win big prizes! It's easy if you have a Ticket.
        </Text>
      </Box>

      <Flex justifyContent="space-between" my="30px" alignItems="flex-end">
        <ButtonGroup isAttached>
          <Button
            borderRadius="sm"
            disabled={!liveRounds.length}
            variant={loadedStateFilter === LotteryStatusEnum.current ? 'active' : 'inactive'}
            onClick={() => setStateFilter(LotteryStatusEnum.current)}
          >
            Live
          </Button>
          <Button
            borderRadius="sm"
            disabled={!upcomingRounds.length}
            variant={loadedStateFilter === LotteryStatusEnum.upcoming ? 'active' : 'inactive'}
            onClick={() => setStateFilter(LotteryStatusEnum.upcoming)}
          >
            Upcoming
          </Button>
          <Button
            borderRadius="sm"
            variant={loadedStateFilter === LotteryStatusEnum.past ? 'active' : 'inactive'}
            onClick={() => setStateFilter(LotteryStatusEnum.past)}
          >
            Past
          </Button>
        </ButtonGroup>

        <Flex>
          <StatBlock width="260px" title="Your Tickets" value={ticketBalance || '0'} />

          <StatBlock
            width="260px"
            title="Total Raffles Reward"
            value={getReadableAmount(userTotalPrize || 0)}
            currency="SAVR"
          />
        </Flex>
      </Flex>

      <Grid templateColumns="repeat(3, 1fr)" gap="20px">
        {isLoading
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

        {lotteries?.map(({ startTime, status, duration, id }) => (
          <GridItem w="100%" key={id}>
            <LotteryItem
              title={getLotteryTitle(id + 1)}
              status={status}
              timestamp={getNextLotteryTimestamp({ startTime, duration, status }) * 1000}
              onDetails={() => navigate(`/raffle/${id + 1}`)}
              onExpire={updateLotteriesState}
            />
          </GridItem>
        ))}
      </Grid>

      {!isLoading && !lotteries?.length ? (
        <Center mt="60px">
          <Text textStyle="textMedium" opacity={0.3}>
            No Raffle rounds yet
          </Text>
        </Center>
      ) : null}

      {loadedStateFilter === LotteryStatusEnum.past && finishedRoundsRequest.hasNextPage ? (
        <Center mt="10px">
          <Button variant="link" onClick={() => finishedRoundsRequest.fetchNextPage()}>
            Load more
          </Button>
        </Center>
      ) : null}
    </Container>
  );
};
