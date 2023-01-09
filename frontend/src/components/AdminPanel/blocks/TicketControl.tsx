import { Button, useDisclosure } from '@chakra-ui/react';

import { useLotteryControl } from '@/hooks/useLottery';
import { useTickets } from '@/hooks/useTickets';
import { bigNumberToString } from '@/utils/number';

import { AdminSection } from '../common/AdminSection';
import { ControlField } from '../common/ControlField';
import { MintRaffleTicket } from '../common/MintRaffleTicket';

export const TicketControl = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mintTickets } = useTickets();
  const { ticketPriceRequest, updateTicketPrice } = useLotteryControl();

  return (
    <AdminSection title="Raffle Ticket">
      <>
        <ControlField
          label="Raffle Ticket price"
          value={ticketPriceRequest.data ? bigNumberToString(ticketPriceRequest.data) : null}
          onSubmit={updateTicketPrice.mutateAsync}
        />

        <Button size="sm" onClick={onOpen}>
          Mint tickets
        </Button>

        {isOpen ? <MintRaffleTicket onClose={onClose} onSubmit={mintTickets.mutateAsync} /> : null}
      </>
    </AdminSection>
  );
};
