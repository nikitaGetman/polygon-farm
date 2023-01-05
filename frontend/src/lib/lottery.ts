import { BigNumber } from 'ethers';

import { Helper, ILottery } from '@/types';

export enum LotteryStatusEnum {
  upcoming = 'upcoming',
  current = 'live',
  soldOut = 'sold out',
  closed = 'closed',
  past = 'past',
}

type LotteryRoundOverload = {
  id: number;
  startTime: number;
  duration: number;
  maxTicketsFromOneMember: number;
  totalTickets: number;
  winnersForLevel: number[];
  prizeForLevel: number[];
  status: LotteryStatusEnum;
};

export type LotteryRoundType = Omit<ILottery.RoundStructOutput, keyof LotteryRoundOverload> &
  LotteryRoundOverload;

export const parseLotteryFormat = (round: ILottery.RoundStructOutput): LotteryRoundType => {
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
    status: getLotteryStatus({ startTime, duration, isFinished: round.isFinished }),
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
  if (isFinished) return LotteryStatusEnum.past;
  if (currentTime < startTime) return LotteryStatusEnum.upcoming;
  if (currentTime < startTime + duration) return LotteryStatusEnum.current;
  return LotteryStatusEnum.soldOut;
};

export const getNextLotteryTimestamp = ({
  status,
  startTime,
  duration,
}: Pick<LotteryRoundType, 'status' | 'startTime' | 'duration'>) => {
  return status === LotteryStatusEnum.current ? startTime + duration : startTime;
};

export type LotteryWinners = {
  level: number;
  address: string;
  tickets: number;
  prize: BigNumber;
};
export const calculateLotteryWinnersPrize = (
  winners: Helper.LotteryWinnersWithTicketsStructOutput[],
  round?: LotteryRoundType
): LotteryWinners[] => {
  if (!round) return [];

  return winners.map((winner) => ({
    level: winner.level.toNumber(),
    address: winner.winnerAddress,
    tickets: winner.enteredTickets.toNumber(),
    prize: getWinnerPrize(
      winner.level.toNumber(),
      round.winnersForLevel,
      round.prizeForLevel,
      round.totalPrize
    ),
  }));
};

const getWinnerPrize = (
  level: number,
  winnersForLevel: number[],
  prizeForLevel: number[],
  totalPrize: BigNumber
) => {
  const levelPrize = totalPrize.mul(prizeForLevel[level]).div(100);
  const winnerPrize = levelPrize.div(winnersForLevel[level]);

  return winnerPrize;
};
