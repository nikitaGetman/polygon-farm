import { BigNumber } from 'ethers';

import { Lottery } from '@/types';

export enum LotteryStatusEnum {
  upcoming = 'upcoming',
  current = 'live',
  soldOut = 'sold out',
  past = 'past',
}

export type LotteryRoundType = Lottery.RoundStruct & {
  id: number;
  startTime: number;
  duration: number;
  maxTicketsFromOneMember: number;
  totalTickets: number;
  winnersForLevel: number[];
  prizeForLevel: number[];
  status: LotteryStatusEnum;
};

export const parseLotteryFormat = (round: Lottery.RoundStruct): LotteryRoundType => {
  const startTime = BigNumber.from(round.startTime).toNumber();
  const duration = BigNumber.from(round.duration).toNumber();
  return {
    ...round,
    id: BigNumber.from(round.id).toNumber(),
    startTime,
    duration,
    maxTicketsFromOneMember: BigNumber.from(round.maxTicketsFromOneMember).toNumber(),
    totalTickets: BigNumber.from(round.totalTickets).toNumber(),
    winnersForLevel: round.winnersForLevel.map((winner) => BigNumber.from(winner).toNumber()),
    prizeForLevel: round.prizeForLevel.map((prize) => BigNumber.from(prize).toNumber()),
    status: getLotteryStatus({ startTime, duration, isFinished: true }),
  };
};

export const getLotteryStatus = ({
  startTime,
  duration,
  isFinished,
}: {
  startTime: number;
  duration: number;
  isFinished: boolean;
}) => {
  const currentTime = Date.now() / 1000;
  if (currentTime < startTime) return LotteryStatusEnum.upcoming;
  if (currentTime < startTime + duration) return LotteryStatusEnum.current;
  if (!isFinished) return LotteryStatusEnum.soldOut;
  return LotteryStatusEnum.past;
};
