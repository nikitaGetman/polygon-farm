import React, { FC, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Text,
  useBreakpoint,
  useDisclosure,
} from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { ReactComponent as CheckIcon } from '@/assets/images/icons/check_ticket.svg';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useCountdown } from '@/hooks/useCountdown';
import { useLottery } from '@/hooks/useLottery';
import { bigNumberToString } from '@/utils/number';

import { BuyLotteryTicketsModal } from '../Lottery/BuyLotteryTicketsModal';

import { TicketFirst } from './TicketFirst';
import { TicketLast } from './TicketLast';
import { TicketMiddle } from './TicketMiddle';
import { TicketMint } from './TicketMint';

type TicketData = {
  isClaimed: boolean;
  isClaimAvailable: boolean;
  timestamp: number;
};
export const TicketClaim = () => {
  const [fetchIndex, setFetchIndex] = useState(0);
  const { isConnected } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Buy Ticket modal
  const {
    ticketPrice,
    claimPeriod,
    claimStreakForTicket,

    claimStreak,
    isClaimedToday,
    lastClaim,
    isMintAvailable,

    buyTickets,
    claimDay,
    mintMyTicket,
  } = useLottery();
  const [isLoading, setIsLoading] = useState(false);

  const refetchData = () => {
    claimStreak.refetch();
    isClaimedToday.refetch();
    lastClaim.refetch();
    isMintAvailable.refetch();

    setFetchIndex((old) => old + 1);
  };

  const ticketData = useMemo<TicketData[]>(() => {
    const currentTime = Date.now() / 1000;

    return Array.from({ length: claimStreakForTicket }).map((_, index) => {
      const isClaimed = Boolean(claimStreak.data && index < claimStreak.data);
      const isClaimAvailable = Boolean(!isClaimedToday.data && claimStreak.data === index);

      let timestamp = 0;
      const streak = claimStreak.data || 0;
      if (
        !isClaimed &&
        claimPeriod.data &&
        (isClaimAvailable || index === streak) &&
        (index > 0 || !isClaimAvailable)
      ) {
        const lastClaimTime =
          (!streak && !isClaimedToday.data) || !lastClaim.data
            ? Math.floor(currentTime / claimPeriod.data) * claimPeriod.data
            : lastClaim.data;

        const timeOffset = streak > 0 && isClaimAvailable ? claimPeriod.data * 2 : claimPeriod.data;
        timestamp = (lastClaimTime + timeOffset) * 1000;
      }

      return {
        isClaimed,
        isClaimAvailable,
        timestamp,
      };
    });
    // eslint-disable-next-line
  }, [
    claimStreakForTicket,
    claimStreak.data,
    isClaimedToday.data,
    claimPeriod.data,
    lastClaim.data,
    fetchIndex,
  ]);

  const handleMint = () => {
    setIsLoading(true);
    mintMyTicket.mutateAsync().finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <Box>
      <Flex
        direction={{ sm: 'column', xl: 'row' }}
        justifyContent="space-between"
        gap={5}
        flexWrap="wrap"
      >
        <Text textStyle="sectionHeading" width={{ sm: '100%', xl: '35%' }}>
          Play Everyday
        </Text>

        <Flex
          order={{ sm: 3, xl: 2 }}
          gap={{ sm: 1, xl: 5 }}
          alignSelf={{ sm: 'stretch', xl: 'flex-start' }}
          alignItems={{ sm: 'flex-start', xl: 'center' }}
          direction={{ sm: 'column', xl: 'row' }}
          whiteSpace="nowrap"
        >
          <Text textStyle="textBoldPtSans">Or you can buy Raffle Tickets</Text>

          <Text textStyle="textBoldPtSans" mb={{ sm: '16px', xl: '0' }}>
            {bigNumberToString(ticketPrice, { precision: 0 })} SAV / 1 Ticket
          </Text>

          {!isConnected ? (
            <ConnectWalletButton />
          ) : (
            <Button onClick={onOpen} width={{ sm: '100%', lg: '50%', xl: 'unset' }}>
              Buy Tickets
            </Button>
          )}
        </Flex>

        <Text
          order={{ sm: 2, xl: 3 }}
          textStyle="text1"
          flexGrow="0"
          flexShrink="0"
          flexBasis={{ sm: '100%', xl: '60%', '2xl': '50%' }}
        >
          Claim puzzle every day to get a free ticket to iSaver Raffles.
          <br /> Just five days and you can mint a Ticket. Also, everyone can buy any number of
          Tickets.
        </Text>
      </Flex>

      <Box
        m={{ sm: '50px 0 0', lg: '50px -15px 0', xl: '50px 0 0' }}
        padding={{ sm: '24px 0', lg: '30px 15px 24px', '2xl': '40px 40px 48px 32px' }}
        background="rgba(38, 71, 55, 0.5)"
        boxShadow="0 6px 11px rgba(0, 0, 0, 0.25)"
        borderRadius="md"
      >
        <Grid
          key={fetchIndex}
          templateRows={{
            sm: '102px 112px 112px 112px 140px 160px',
            lg: 'repeat(2, 143px)',
            xl: '1fr',
          }}
          templateColumns={{
            sm: '1fr',
            lg: 'repeat(3, 193px)',
            xl: '144px 144px 144px 144px 174px 180px',
            '2xl': '193px 193px 193px 193px 216px 240px',
          }}
        >
          {ticketData.map(({ isClaimed, isClaimAvailable, timestamp }, index) => (
            <GridItem key={index}>
              <Ticket
                index={index}
                isClaimed={isClaimed}
                isAvailable={isClaimAvailable}
                timestamp={timestamp}
                onClaim={claimDay.mutateAsync}
                onExpire={refetchData}
              />
            </GridItem>
          ))}
          {/* Mint ticket */}
          <GridItem textAlign={{ sm: 'center', lg: 'unset' }}>
            <TicketMint
              isActive={Boolean(isMintAvailable.data)}
              onClick={isMintAvailable.data && !isLoading ? handleMint : undefined}
            >
              {isLoading ? (
                <Spinner color="white" />
              ) : (
                <Text
                  textStyle="textBold"
                  color={Boolean(isMintAvailable.data) ? 'white' : 'whiteAlpha.500'}
                  fontSize={{ sm: '16px', '2xl': '26px' }}
                  fontWeight={{ sm: '600', '2xl': '700' }}
                  textAlign="center"
                  whiteSpace="nowrap"
                  textTransform="uppercase"
                >
                  Mint my
                  <br />
                  Ticket
                </Text>
              )}
            </TicketMint>
          </GridItem>
        </Grid>
      </Box>

      {isOpen ? (
        <BuyLotteryTicketsModal
          ticketPrice={ticketPrice}
          onBuy={buyTickets.mutateAsync}
          onClose={onClose}
        />
      ) : null}
    </Box>
  );
};

type TicketProps = {
  index: number;
  isClaimed: boolean;
  isAvailable: boolean;
  timestamp: number;
  onClaim: () => Promise<void>;
  onExpire: () => void;
};
const Ticket: FC<TicketProps> = ({
  index,
  isClaimed,
  isAvailable,
  timestamp,
  onClaim,
  onExpire,
}) => {
  const { isConnected } = useAccount();
  const { stamps, stampStrings } = useCountdown(timestamp, onExpire);
  const [isLoading, setIsLoading] = useState(false);
  const bp = useBreakpoint({ ssr: false });

  const hoursString = (stamps.days * 24 + stamps.hours).toString().padStart(2, '0');

  const isFirst = index === 0;
  const isLast = index === 4;

  const showTimer = Boolean(isConnected && timestamp);
  const isSmIcon = ['sm', 'md', 'xl'].includes(bp);

  const TicketIcon = useMemo(() => {
    if (bp === 'lg') {
      if (index === 2) return TicketLast;
      if (index === 3) return TicketFirst;
    }
    if (isFirst) return TicketFirst;
    if (isLast) return TicketLast;
    return TicketMiddle;
  }, [isFirst, isLast, bp, index]);

  const handleClaim = () => {
    setIsLoading(true);
    onClaim().finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <Box textAlign={{ sm: 'center', lg: 'unset' }}>
      <TicketIcon
        isClaimed={isClaimed}
        isActive={isAvailable}
        hasTimer={showTimer}
        onClick={isAvailable && !isLoading ? handleClaim : undefined}
      >
        {isClaimed || isAvailable ? (
          <Flex
            direction="column"
            textAlign="center"
            justifyContent="center"
            alignItems="center"
            color="white"
            width="100%"
            height="100%"
            whiteSpace="nowrap"
          >
            {!isLoading ? (
              <>
                <CheckIcon width={isSmIcon ? '21px' : '28px'} />
                <Text
                  mt={{ sm: '2px', lg: '10px' }}
                  textStyle="textMedium"
                  fontSize={{ sm: '18px', lg: '22px' }}
                  fontWeight={{ sm: '400', lg: '500' }}
                >
                  CLAIM
                </Text>
                {isAvailable && timestamp ? (
                  <Text
                    width="125px"
                    mt={{ sm: '2px', lg: '10px', xl: '5px', '2xl': '10px' }}
                    color="whiteAlpha.500"
                    textStyle="text1"
                    whiteSpace="nowrap"
                    fontSize={{ sm: '12px', lg: '16px', xl: '12px', '2xl': '16px' }}
                    fontWeight={{ sm: '400', lg: '500', xl: '400', '2xl': '500' }}
                  >
                    {`${hoursString}h ${stampStrings.minsString}m ${stampStrings.secString}s`}
                  </Text>
                ) : undefined}
              </>
            ) : (
              <Spinner />
            )}
          </Flex>
        ) : showTimer ? (
          <Text
            width="125px"
            color="whiteAlpha.500"
            textAlign="left"
            textStyle="text1"
            whiteSpace="nowrap"
            fontSize={{ sm: '18px', xl: '14px', '2xl': '18px' }}
            fontWeight={{ sm: '500', xl: '400', '2xl': '500' }}
          >
            {`${hoursString}h ${stampStrings.minsString}m ${stampStrings.secString}s`}
          </Text>
        ) : (
          <Text
            width="100px"
            color="whiteAlpha.500"
            whiteSpace="nowrap"
            textAlign="center"
            textStyle="textMedium"
            fontSize={{ sm: '22px', '2xl': '26px' }}
            fontWeight={{ sm: '500', '2xl': '600' }}
          >
            Day {index + 1}
          </Text>
        )}
      </TicketIcon>
    </Box>
  );
};
