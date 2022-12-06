import React, { useCallback, useEffect, useMemo } from 'react';
import { Link as RouterLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Container, Grid, GridItem, Link, useDisclosure } from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { CenteredSpinner } from '@/components/ui/CenteredSpinner/CenteredSpinner';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
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

export const LotteryPage = () => {
  useDocumentTitle('iSaver | Lottery');

  const { id } = useParams();
  const roundId = useMemo(() => (id ? parseInt(id) - 1 : undefined), [id]);
  const { isConnected } = useAccount();
  const { connect } = useConnectWallet();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Buy Ticket modal
  const navigate = useNavigate();
  const { ticketBalance } = useLottery();
  const {
    round,
    entryLottery,
    fetchRoundRequest: { refetch, isFetched },
    userRoundEntryRequest: { data: userEnteredTickets },
  } = useLotteryRoundById(roundId);
  const { ticketPrice, buyTickets } = useLottery();

  // Redirect to dashboard if round not found
  useEffect(() => {
    if ((isFetched && !round) || !id) {
      navigate('/');
    }
  }, [isFetched, round, navigate, id]);

  const handleOpenTicketModal = useCallback(() => {
    if (!isConnected) {
      connect();
    } else {
      onOpen();
    }
  }, [isConnected, connect, onOpen]);

  const handleEnterLottery = useCallback(
    (tickets: number) => {
      return entryLottery.mutateAsync({ roundId: roundId ?? -1, tickets });
    },
    [entryLottery, roundId]
  );

  const isUpcoming = round?.status === LotteryStatusEnum.upcoming;
  const isActive = round?.status === LotteryStatusEnum.current;
  const isSoldOut = round?.status === LotteryStatusEnum.soldOut;
  const isPast = round?.status === LotteryStatusEnum.past;

  const totalPrize = useMemo(() => {
    if (round) {
      return round.initialPrize.add(round.tokensForOneTicket.mul(round.totalTickets));
    } else return BigNumber.from(0);
  }, [round]);

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
            {!isPast ? (
              <Box mb="20px">
                <LotteryCountdown
                  startTime={round.startTime}
                  duration={round.duration}
                  onExpire={refetch}
                />
              </Box>
            ) : null}

            <Box mb="60px">
              <LotteryDescription
                prize={totalPrize}
                winnersForLevel={round.winnersForLevel}
                prizeForLevel={round.prizeForLevel}
              />
            </Box>
          </GridItem>

          <GridItem colSpan={1}>
            <Box mb="20px">
              <LotteryTickets
                tickets={ticketBalance || 0}
                showEntered={!isUpcoming}
                isClosed={isSoldOut || isPast}
                enteredTickets={userEnteredTickets}
                onBuyClick={handleOpenTicketModal}
              />
            </Box>

            {isUpcoming || isActive ? (
              <Box mb="60px">
                <LotteryEnter
                  maximumAvailableTickets={round.maxTicketsFromOneMember}
                  userEnteredTickets={userEnteredTickets}
                  isDisabled={!isActive}
                  onEnter={handleEnterLottery}
                />
              </Box>
            ) : null}
          </GridItem>
        </Grid>
      ) : (
        <Box height="500px" position="relative">
          <CenteredSpinner background="transparent" />
        </Box>
      )}

      {isOpen ? (
        <BuyLotteryTicketsModal
          ticketPrice={ticketPrice}
          onBuy={buyTickets.mutateAsync}
          onClose={onClose}
        />
      ) : null}
    </Container>
  );
};
