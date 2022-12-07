import { useMemo } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { LotteryRoundType, LotteryStatusEnum, parseLotteryFormat } from '@/lib/lottery';
import { ILottery } from '@/types';

import { useLotteryContract } from './contracts/useLotteryContract';

export const LOTTERY_ACTIVE_ROUNDS_REQUEST = 'lottery-active-round-request';
export const LOTTERY_LAST_FINISHED_ROUNDS_REQUEST = 'lottery-finished-rounds-request';

const FETCH_LIMIT = 6;
export const useLotteryRounds = () => {
  const lotteryContract = useLotteryContract();

  const activeRoundsRequest = useQuery(
    [LOTTERY_ACTIVE_ROUNDS_REQUEST],
    async () => {
      return lotteryContract.getActiveRounds();
    },
    { select: (data) => data.map(parseLotteryFormat).sort((a, b) => b.id - a.id) }
  );
  const finishedRoundsRequest = useInfiniteQuery({
    queryKey: [LOTTERY_LAST_FINISHED_ROUNDS_REQUEST],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await lotteryContract.getLastFinishedRounds(
        FETCH_LIMIT,
        FETCH_LIMIT * pageParam
      );
      return {
        data,
        nextCursor: data.length < FETCH_LIMIT ? undefined : pageParam + 1,
      };
    },
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
  });

  const { upcomingRounds, liveRounds } = useMemo(() => {
    return (activeRoundsRequest.data || []).reduce(
      (acc, round) => {
        if (round.status === LotteryStatusEnum.upcoming) {
          acc.upcomingRounds.push(round);
        } else {
          acc.liveRounds.push(round);
        }
        return acc;
      },
      { liveRounds: [] as LotteryRoundType[], upcomingRounds: [] as LotteryRoundType[] }
    );
  }, [activeRoundsRequest.data]);

  const finishedRounds = useMemo(() => {
    return finishedRoundsRequest.data?.pages
      .reduce((acc, { data }) => {
        acc.push(...data);
        return acc;
      }, [] as ILottery.RoundStructOutput[])
      .map((data) => parseLotteryFormat(data))
      .sort((a, b) => b.id - a.id);
  }, [finishedRoundsRequest.data]);

  return {
    activeRoundsRequest,
    finishedRoundsRequest,
    upcomingRounds,
    liveRounds,
    finishedRounds,
  };
};
