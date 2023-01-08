import React, { useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Link,
  useBreakpoint,
  useDisclosure,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { CenteredSpinner } from '@/components/ui/CenteredSpinner/CenteredSpinner';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useHelperLotteryRoundWinners } from '@/hooks/useHelper';
import { useLottery } from '@/hooks/useLottery';
import { useLotteryRoundById } from '@/hooks/useLotteryRoundById';
import { useDocumentTitle, useMetaDescription } from '@/hooks/useMeta';
import { useNavigateByHash } from '@/hooks/useNavigateByHash';
import { LotteryStatusEnum } from '@/lib/lottery';
import { getLotteryTitle } from '@/utils/lottery';

import { BuyLotteryTicketsModal } from './BuyLotteryTicketsModal';
import { LotteryCountdown } from './LotteryCountdown';
import { LotteryDescription } from './LotteryDescrption';
import { LotteryEnter } from './LotteryEnter';
import { LotteryHeading } from './LotteryHeading';
import { LotterySummary } from './LotterySummary';
import { LotteryTickets } from './LotteryTickets';

export const LotteryPage = () => {
  const { id } = useParams();

  useDocumentTitle(id ? `iSaver | Raffles - Ultra Raffle ${id}` : 'iSaver | Raffles');
  useMetaDescription(
    'iSaver Raffles joining gives you a chance to win big prizes! It`s easy, if you have a Ticket.'
  );

  const roundId = useMemo(() => (id ? parseInt(id) - 1 : undefined), [id]);
  const { isConnected, address } = useAccount();
  const { connect } = useConnectWallet();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Buy Ticket modal
  const navigate = useNavigateByHash();
  const { ticketBalance } = useLottery();
  const {
    round,
    entryLottery,
    fetchRoundRequest: { refetch, isFetched },
    userRoundEntryRequest: { data: userEnteredTickets },
  } = useLotteryRoundById(roundId);
  const { ticketPrice, buyTickets } = useLottery();
  const bp = useBreakpoint({ ssr: false });
  const isSm = ['sm', 'md'].includes(bp);

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

  const roundWinners = useHelperLotteryRoundWinners(isPast ? roundId : undefined);

  const totalPrize = useMemo(() => {
    if (round) {
      return round.initialPrize.add(round.tokensForOneTicket.mul(round.totalTickets));
    } else return BigNumber.from(0);
  }, [round]);

  const userPrize = useMemo(
    () => roundWinners?.data?.find((winner) => winner.address === address)?.prize,
    [roundWinners.data, address]
  );
  return (
    <Container variant="dashboard">
      <Link
        onClick={() => navigate('/#raffles')}
        textStyle="button"
        alignSelf="flex-start"
        my={{ sm: '20px', xl: '30px' }}
      >
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        All Raffles
      </Link>

      {round ? (
        <Grid
          gridTemplateColumns={{ sm: '1fr', lg: '1fr 1fr' }}
          gap={{ sm: '10px', xl: '20px' }}
          mb="100px"
        >
          <GridItem colSpan={2}>
            <LotteryHeading
              status={round.status}
              totalTickets={round.totalTickets}
              title={getLotteryTitle(id)}
            />
          </GridItem>

          <GridItem colSpan={{ sm: 2, lg: 1 }} order={{ sm: 2, lg: 1 }}>
            {!isPast ? (
              <Box mb={{ sm: '10px', xl: '20px' }}>
                <LotteryCountdown
                  startTime={round.startTime}
                  duration={round.duration}
                  onExpire={refetch}
                />
              </Box>
            ) : null}

            <Box>
              <LotteryDescription
                prize={totalPrize}
                winnersForLevel={round.winnersForLevel}
                prizeForLevel={round.prizeForLevel}
              />
            </Box>
          </GridItem>

          <GridItem colSpan={{ sm: 2, lg: 1 }} order={{ sm: 1, lg: 2 }}>
            <Box>
              <LotteryTickets
                tickets={ticketBalance || 0}
                showEntered={!isUpcoming && isConnected}
                isClosed={isSoldOut || isPast}
                enteredTickets={userEnteredTickets}
                onBuyClick={handleOpenTicketModal}
              />
            </Box>

            {isUpcoming || isActive ? (
              <Box mt={{ sm: '10px', xl: '20px' }}>
                <LotteryEnter
                  maximumAvailableTickets={round.maxTicketsFromOneMember}
                  userTickets={ticketBalance}
                  userEnteredTickets={userEnteredTickets}
                  isDisabled={!isActive}
                  onEnter={handleEnterLottery}
                />
              </Box>
            ) : null}

            {isPast && !isSm ? (
              <Box mt={{ sm: '10px', xl: '20px' }}>
                <LotterySummary userPrize={userPrize} winners={roundWinners.data || []} />
              </Box>
            ) : null}
          </GridItem>

          {isPast && isSm ? (
            <GridItem order={3} colSpan={2}>
              <LotterySummary userPrize={userPrize} winners={roundWinners.data || []} />
            </GridItem>
          ) : null}
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
