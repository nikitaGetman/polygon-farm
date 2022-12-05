import React, { useCallback } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Container, Grid, GridItem, Link, useDisclosure } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { CenteredSpinner } from '@/components/ui/CenteredSpinner/CenteredSpinner';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useLottery } from '@/hooks/useLottery';
import { useLotteryRoundById } from '@/hooks/useLotteryRoundById';
import { LotteryStatusEnum } from '@/lib/lottery';
import { getLotteryTitle } from '@/utils/lottery';

import { BuyLotteryTicketsModal } from './BuyLotteryTicketsModal';
import { LotteryCountdown } from './LotteryCountdown';
import { LotteryDescription } from './LotteryDescrption';
import { LotteryEnter } from './LotteryEnter';
import { LotteryHeading } from './LotteryHeading';
import { LotteryTickets } from './LotteryTickets';

const lottery = {
  status: LotteryStatusEnum.upcoming,
  title: 'Regular Ref 31',
  totalTickets: 1000,
  timestamp: Date.now() + 86400_000,

  prize: BigNumber.from(10).pow(18).mul(100_000),
  ticketPrice: BigNumber.from(10).pow(18).mul(5),
};

export const LotteryPage = () => {
  let { id } = useParams();
  const { isConnected } = useAccount();
  const { connect } = useConnectWallet();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Buy Ticket modal

  const handleOpenTicketModal = useCallback(() => {
    if (!isConnected) {
      connect();
    } else {
      onOpen();
    }
  }, [isConnected, connect, onOpen]);

  const { round } = useLotteryRoundById(id ? parseInt(id) - 1 : id);
  const { buyTickets } = useLottery();

  const { ticketBalance } = useLottery();

  return (
    <Container variant="dashboard" pt="40px">
      <Link as={RouterLink} to="/" textStyle="button" alignSelf="flex-start" mb="30px">
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        All Raffles
      </Link>

      {round ? (
        <Grid gridTemplateColumns="1fr 1fr" gap="20px">
          <GridItem colSpan={2}>
            <LotteryHeading
              status={round.status}
              totalTickets={round.totalTickets}
              title={getLotteryTitle(id)}
            />
          </GridItem>

          <GridItem colSpan={1}>
            <Box mb="20px">
              <LotteryCountdown timestamp={lottery.timestamp} />
            </Box>

            <Box mb="60px">
              <LotteryDescription prize={lottery.prize} />
            </Box>
          </GridItem>

          <GridItem colSpan={1}>
            <Box mb="20px">
              <LotteryTickets
                tickets={ticketBalance || 0}
                showEntered={false}
                enteredTickets={0}
                onBuyClick={handleOpenTicketModal}
              />
            </Box>

            <Box mb="60px">
              <LotteryEnter
                maximumAvailableTickets={10}
                isDisabled={true}
                onEnter={() => Promise.resolve()}
              />
            </Box>
          </GridItem>
        </Grid>
      ) : (
        <Box height="500px" position="relative">
          <CenteredSpinner background="transparent" />
        </Box>
      )}

      {isOpen ? (
        <BuyLotteryTicketsModal
          ticketPrice={lottery.ticketPrice}
          onBuy={buyTickets.mutateAsync}
          onClose={onClose}
        />
      ) : null}
    </Container>
  );
};
