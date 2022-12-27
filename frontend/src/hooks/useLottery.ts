import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { useLotteryContract } from './contracts/useLotteryContract';
import { useTicketContract } from './contracts/useTicketContract';
import { useNotification } from './useNotification';
import { SAV_BALANCE_REQUEST } from './useTokenBalance';
import { TOKENS, useTokens } from './useTokens';

export const TICKET_BALANCE_REQUEST = 'ticket-balance-request';
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

const claimStreakForTicket = 5;
export const useLottery = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const lotteryContract = useLotteryContract();
  const ticketContract = useTicketContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();

  const ticketPriceRequest = useQuery([LOTTERY_TICKET_PRICE_REQUEST], async () => {
    return await lotteryContract.getTicketPrice();
  });
  const ticketPrice = useMemo(
    () => ticketPriceRequest.data || BigNumber.from(0),
    [ticketPriceRequest.data]
  );

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

  const isClaimedToday = useQuery(
    [LOTTERY_IS_CLAIMED_TODAY_REQUEST, { account }],
    () => lotteryContract.isClaimedToday(account),
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
    isClaimedToday,
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
