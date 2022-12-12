import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumberish } from 'ethers';
import { useAccount } from 'wagmi';

import { parseLotteryFormat } from '@/lib/lottery';

import { useLotteryContract } from './contracts/useLotteryContract';
import { useTicketContract } from './contracts/useTicketContract';
import { useConnectWallet } from './useConnectWallet';
import { TICKET_BALANCE_REQUEST } from './useLottery';
import { useNotification } from './useNotification';

export const LOTTERY_ROUND_REQUEST = 'lottery-round-request';
export const LOTTERY_ROUND_USER_TICKETS_REQUEST = 'lottery-round-user-tickets-request';
const ENTRY_LOTTERY_MUTATION = 'entry-lottery-mutation';

export const useLotteryRoundById = (id?: BigNumberish) => {
  const { address } = useAccount();
  const lotteryContract = useLotteryContract();
  const ticketContract = useTicketContract();
  const queryClient = useQueryClient();
  const { connect } = useConnectWallet();
  const { success, handleError } = useNotification();

  const enabled = id !== undefined;

  const fetchRoundRequest = useQuery({
    queryKey: [LOTTERY_ROUND_REQUEST, { id }],
    queryFn: async () => {
      return await lotteryContract.getRound(id as number);
    },
    enabled,
    select: (data) => parseLotteryFormat(data),
  });

  const userRoundEntryRequest = useQuery({
    queryKey: [LOTTERY_ROUND_USER_TICKETS_REQUEST, { id, address }],
    queryFn: async () => lotteryContract.getUserRoundEntry(address, id as number),
    enabled: enabled && Boolean(address),
    select: (data) => data?.toNumber(),
  });

  const entryLottery = useMutation(
    [ENTRY_LOTTERY_MUTATION],
    async ({ roundId, tickets }: { roundId: BigNumberish; tickets: BigNumberish }) => {
      if (!address) {
        connect();
        return;
      }
      const isApproved = await ticketContract.isApprovedForAll(address, lotteryContract.address);
      if (!isApproved) {
        const approveTx = await ticketContract.setApprovalForAll(lotteryContract.address, true);
        success({ title: 'Approved', txHash: approveTx });
      }

      const txHash = await lotteryContract.entryLottery(roundId, tickets);
      success({ title: 'Success', description: `You entered with ${tickets} tickets`, txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [TICKET_BALANCE_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [LOTTERY_ROUND_USER_TICKETS_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return { fetchRoundRequest, round: fetchRoundRequest.data, userRoundEntryRequest, entryLottery };
};
