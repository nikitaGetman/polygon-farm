import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { useAccount } from 'wagmi';

import { parseLotteryFormat } from '@/lib/lottery';
import { bigNumberToString } from '@/utils/number';

import { CreateLotteryProps, useLotteryContract } from './contracts/useLotteryContract';
import { useTicketContract } from './contracts/useTicketContract';
import { TOKENS } from './contracts/useTokenContract';
import { useNotification } from './useNotification';
import { SAV_BALANCE_REQUEST } from './useTokenBalance';
import { useTokens } from './useTokens';

export const TICKET_BALANCE_REQUEST = 'ticket-balance-request';
const LOTTERY_ROUNDS_REQUEST = 'lottery-rounds-request';
const LOTTERY_TICKET_PRICE_REQUEST = 'lottery-ticket-price-request';
const LOTTERY_WINNER_PRIZE_REQUEST = 'lottery-winner-prize-request';
const LOTTERY_CLAIM_PERIOD_REQUEST = 'lottery-claim-period-request';
const LOTTERY_IS_CLAIMED_TODAY_REQUEST = 'lottery-is-claimed-today-request';
const LOTTERY_GET_LAST_CLAIM_REQUEST = 'lottery-get-last-claim-request';
const LOTTERY_CLAIM_STREAK_REQUEST = 'lottery-claim-streak-request';
const LOTTERY_IS_MINT_AVAILABLE_REQUEST = 'lottery-is-mint-available-request';
const BUY_TICKETS_MUTATION = 'buy-tickets-mutation';
const CLAIM_DAY_MUTATION = 'claim-day-mutation';
const MINT_TICKET_MUTATION = 'mint-ticket-mutation';

export const useLotteryControl = () => {
  const lotteryContract = useLotteryContract();
  const queryClient = useQueryClient();
  const { success, handleError } = useNotification();

  const roundsRequest = useQuery(
    [LOTTERY_ROUNDS_REQUEST],
    async () => {
      return await lotteryContract.getRounds();
    },
    { select: (data) => data.map(parseLotteryFormat).sort((a, b) => b.id - a.id) }
  );

  const ticketPriceRequest = useQuery([LOTTERY_TICKET_PRICE_REQUEST], async () => {
    return await lotteryContract.getTicketPrice();
  });

  const ticketPrice = useMemo(
    () => ticketPriceRequest.data || BigNumber.from(0),
    [ticketPriceRequest.data]
  );

  const updateTicketPrice = useMutation(
    ['update-ticket-price'],
    async (price: number) => {
      const priceBN = parseEther(price.toString());

      const txHash = await lotteryContract.updateTicketPrice(priceBN);
      success({
        title: 'Success',
        description: `Ticket price changed to ${bigNumberToString(priceBN)} SAV`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LOTTERY_TICKET_PRICE_REQUEST]);
      },
      onError: handleError,
    }
  );

  const finishLotteryRound = useMutation(
    ['finish-lottery-round'],
    async ({ roundId, pk }: { roundId: number; pk: string[][] }) => {
      const txHash = await lotteryContract.finishLotteryRound(roundId, pk);
      success({
        title: 'Success',
        description: `Raffle round ${
          roundId + 1
        } is closed. Oracle will fullfil round with random word in about 2 minutes.`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LOTTERY_ROUNDS_REQUEST]);
      },
      onError: handleError,
    }
  );

  const manuallyGetWinners = useMutation(
    ['get-lottery-round-winners'],
    async (roundId: number) => {
      const txHash = await lotteryContract.manuallyGetWinners(roundId);
      success({
        title: 'Success',
        description: `Raffle round ${roundId + 1} is finished. Winners are determined.`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LOTTERY_ROUNDS_REQUEST]);
      },
      onError: handleError,
    }
  );

  const createLotteryRound = useMutation(
    ['create-lottery-round'],
    async (props: CreateLotteryProps) => {
      const txHash = await lotteryContract.createLotteryRound(props);
      success({ title: 'Success', description: 'Raffle round has been created', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LOTTERY_ROUNDS_REQUEST]);
      },
      onError: handleError,
    }
  );

  return {
    ticketPriceRequest,
    ticketPrice,
    roundsRequest,
    updateTicketPrice,
    finishLotteryRound,
    manuallyGetWinners,
    createLotteryRound,
  };
};

const claimStreakForTicket = 5;
export const useLottery = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const lotteryContract = useLotteryContract();
  const { ticketPriceRequest, ticketPrice } = useLotteryControl();
  const ticketContract = useTicketContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();

  const userTotalPrizeRequest = useQuery([LOTTERY_WINNER_PRIZE_REQUEST, { account }], async () => {
    return account ? await lotteryContract.getWinnerTotalPrize(account) : null;
  });
  const userTotalPrize = useMemo(() => userTotalPrizeRequest.data, [userTotalPrizeRequest.data]);

  const ticketBalanceRequest = useQuery([TICKET_BALANCE_REQUEST, { account }], async () => {
    return account ? await ticketContract.balanceOf(account) : null;
  });
  const ticketBalance = useMemo(
    () => ticketBalanceRequest.data?.toNumber(),
    [ticketBalanceRequest.data]
  );

  const claimPeriod = useQuery(
    [LOTTERY_CLAIM_PERIOD_REQUEST],
    () => lotteryContract.getClaimPeriod(),
    { select: (data) => data.toNumber() }
  );

  const isClaimAvailable = useQuery(
    [LOTTERY_IS_CLAIMED_TODAY_REQUEST, { account }],
    () => lotteryContract.isClaimAvailable(account),
    { enabled: Boolean(account) }
  );

  const claimStreak = useQuery(
    [LOTTERY_CLAIM_STREAK_REQUEST, { account }],
    () => lotteryContract.getClaimStreak(account),
    {
      enabled: Boolean(account),
      select: (data) => data.toNumber(),
    }
  );

  const lastClaim = useQuery(
    [LOTTERY_GET_LAST_CLAIM_REQUEST, { account }],
    () => lotteryContract.getLastClaimTime(account),
    {
      enabled: Boolean(account),
      select: (data) => data.toNumber(),
    }
  );

  const isMintAvailable = useQuery(
    [LOTTERY_IS_MINT_AVAILABLE_REQUEST, { account }],
    () => lotteryContract.isMintAvailable(account),
    { enabled: Boolean(account) }
  );

  const claimDay = useMutation(
    [CLAIM_DAY_MUTATION],
    async () => {
      const txHash = await lotteryContract.claimDay();
      success({ title: 'Success', description: 'You have claimed for today', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [LOTTERY_IS_CLAIMED_TODAY_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_CLAIM_STREAK_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_GET_LAST_CLAIM_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_IS_MINT_AVAILABLE_REQUEST] });
      },
      onError: handleError,
    }
  );

  const mintMyTicket = useMutation(
    [MINT_TICKET_MUTATION],
    async () => {
      const txHash = await lotteryContract.mintMyTicket();
      success({ title: 'Success', description: 'You have minted Raffle Ticket', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TICKET_BALANCE_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_IS_CLAIMED_TODAY_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_CLAIM_STREAK_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_GET_LAST_CLAIM_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_IS_MINT_AVAILABLE_REQUEST] });
      },
      onError: handleError,
    }
  );

  const buyTickets = useMutation(
    [BUY_TICKETS_MUTATION],
    async (amount: number) => {
      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        spender: lotteryContract.address,
        requiredAmount: (ticketPrice || BigNumber.from(10).pow(19)).mul(amount),
      });

      const txHash = await lotteryContract.buyTickets(amount);
      success({ title: 'Success', description: `You bought ${amount} Raffle Tickets`, txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TICKET_BALANCE_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: handleError,
    }
  );

  return {
    lotteryContract,
    ticketContract,

    claimPeriod,
    claimStreakForTicket,
    isClaimAvailable,
    claimStreak,
    lastClaim,
    isMintAvailable,
    ticketPriceRequest,
    ticketPrice,
    userTotalPrizeRequest,
    userTotalPrize,
    ticketBalanceRequest,
    ticketBalance,

    buyTickets,
    claimDay,
    mintMyTicket,
  };
};
