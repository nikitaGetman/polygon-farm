import { useMemo } from 'react';
import { useAccount, useQuery, useQueryClient } from 'wagmi';

import { useLotteryContract } from './contracts/useLotteryContract';
import { useTicketContract } from './contracts/useTicketContract';
import { useConnectWallet } from './useConnectWallet';
import { useNotification } from './useNotification';
import { useTokens } from './useTokens';

export enum LotteryStatusEnum {
  upcoming = 'upcoming',
  current = 'live',
  past = 'past',
}

const TICKET_BALANCE_REQUEST = 'ticket-balance-request';
const LOTTERY_TICKET_PRICE_REQUEST = 'lottery-ticket-price-request';
const LOTTERY_WINNER_PRIZE_REQUEST = 'lottery-winner-prize-request';
const LOTTERY_ROUND_REQUEST = 'lottery-round-request';
const LOTTERY_ACTIVE_ROUNDS_REQUEST = 'lottery-active-round-request';
const LOTTERY_LAST_FINISHED_ROUNDS_REQUEST = 'lottery-finished-rounds-request';
const LOTTERY_IS_CLAIMED_TODAY_REQUEST = 'lottery-is-claimed-today-request';
const LOTTERY_CLAIM_STREAK_REQUEST = 'lottery-claim-streak-request';
const ENTRY_LOTTERY_MUTATION = 'entry-lottery-mutation';
const BUY_TICKETS_MUTATION = 'buy-tickets-mutation';
const CLAIM_DAY_MUTATION = 'claim-day-mutation';

export const useLottery = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const lotteryContract = useLotteryContract();
  const ticketContract = useTicketContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();
  const { connect } = useConnectWallet();

  const ticketPriceRequest = useQuery([LOTTERY_TICKET_PRICE_REQUEST], async () => {
    return await lotteryContract.getTicketPrice();
  });
  const ticketPrice = useMemo(() => ticketPriceRequest.data, [ticketPriceRequest]);

  const userTotalPrizeRequest = useQuery([LOTTERY_WINNER_PRIZE_REQUEST, { account }], async () => {
    return account ? await lotteryContract.getWinnerTotalPrize(account) : null;
  });
  const userTotalPrize = useMemo(() => userTotalPrizeRequest.data, [userTotalPrizeRequest]);

  const ticketBalanceRequest = useQuery([TICKET_BALANCE_REQUEST, { account }], async () => {
    return account ? await ticketContract.balanceOf(account) : null;
  });
  const ticketBalance = useMemo(
    () => ticketBalanceRequest.data?.toNumber(),
    [ticketBalanceRequest]
  );

  // ...

  return {
    lotteryContract,
    ticketContract,

    ticketPriceRequest,
    ticketPrice,
    userTotalPrizeRequest,
    userTotalPrize,
    ticketBalanceRequest,
    ticketBalance,
  };
};
