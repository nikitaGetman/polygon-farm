import React, { useCallback, useState } from 'react';
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

  const lotteries =
    stateFilter === LotteryStatusEnum.current
      ? liveRounds
      : stateFilter === LotteryStatusEnum.upcoming
      ? upcomingRounds
      : finishedRounds;

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
              onDetails={() => navigate(`/lottery/${id + 1}`)}
              onExpire={updateLotteriesState}
            />
          </GridItem>
        ))}

        {stateFilter === LotteryStatusEnum.past && finishedRoundsRequest.hasNextPage ? (
          <Button onClick={() => finishedRoundsRequest.fetchNextPage()}>More</Button>
        ) : null}
      </Grid>
    </Container>
  );
};
