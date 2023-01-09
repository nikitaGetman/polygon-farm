import { useMutation } from '@tanstack/react-query';

import { useTicketContract } from './contracts/useTicketContract';
import { useNotification } from './useNotification';

export const useTickets = () => {
  const ticketContract = useTicketContract();
  const { success, handleError } = useNotification();

  const mintTickets = useMutation(
    ['mint-raffle-tickets'],
    async (props: { address: string; amount: number }) => {
      const txHash = await ticketContract.mintTickets(props);
      success({
        title: 'Success',
        description: `${props.amount} Raffle Tickets has been minted for ${props.address}`,
        txHash,
      });
    },
    { onError: handleError }
  );

  return {
    mintTickets,
  };
};
