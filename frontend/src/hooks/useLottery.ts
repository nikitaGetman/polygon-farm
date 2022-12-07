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
const LOTTERY_IS_CLAIMED_TODAY_REQUEST = 'lottery-is-claimed-today-request';
const LOTTERY_CLAIM_STREAK_REQUEST = 'lottery-claim-streak-request';
const BUY_TICKETS_MUTATION = 'buy-tickets-mutation';
const CLAIM_DAY_MUTATION = 'claim-day-mutation';

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

  const buyTickets = useMutation(
    [BUY_TICKETS_MUTATION],
    async (amount: number) => {
      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        spender: lotteryContract.address,
        requiredAmount: (ticketPrice || BigNumber.from(10).pow(19)).mul(amount),
      });

      const txHash = await lotteryContract.buyTickets(amount);
      success({ title: 'Success', description: `You bought ${amount} lottery tickets`, txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TICKET_BALANCE_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return {
    lotteryContract,
    ticketContract,

    ticketPriceRequest,
    ticketPrice,
    userTotalPrizeRequest,
    userTotalPrize,
    ticketBalanceRequest,
    ticketBalance,

    buyTickets,
  };
};
