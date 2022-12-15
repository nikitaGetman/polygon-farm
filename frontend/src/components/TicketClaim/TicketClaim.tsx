import React, { FC, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { ReactComponent as CheckIcon } from '@/assets/images/icons/check_ticket.svg';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useCountdown } from '@/hooks/useCountdown';
import { useLottery } from '@/hooks/useLottery';
import { bigNumberToString } from '@/utils/number';

import { BuyLotteryTicketsModal } from '../Lottery/BuyLotteryTicketsModal';
import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';

import { TicketFirst } from './TicketFirst';
import { TicketLast } from './TicketLast';
import { TicketMiddle } from './TicketMiddle';
import { TicketMint } from './TicketMint';

import './TicketClaim.scss';

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
      if (!isClaimed && claimPeriod.data && (isClaimAvailable || index === streak)) {
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
      <Flex alignItems="center" gap="2">
        <Heading textStyle="h1">Play Everyday</Heading>
        <Spacer />
        <Flex alignItems="center">
          <Text textStyle="textBaldPtSans" mr="7">
            Or you can buy Raffle Tickets
          </Text>
          <Text textStyle="textBaldPtSans" mr="7">
            {bigNumberToString(ticketPrice, { precision: 0 })} SAV / 1 Ticket
          </Text>
          {!isConnected ? <ConnectWalletButton /> : <Button onClick={onOpen}>Buy Tickets</Button>}
        </Flex>
      </Flex>
      <Box maxWidth="640px" mt={5}>
        <Text textStyle="text1">
          Claim puzzle every day to get a free ticket to iSaver Raffles.
          <br /> Just five days and you can mint a Ticket. Also, everyone can buy any number of
          Tickets.
        </Text>
      </Box>
      <Flex
        w="100%"
        padding="40px 40px 48px 32px"
        mt="12"
        justifyContent="space-between"
        className="box-gradient"
      >
        <Flex key={fetchIndex}>
          {ticketData.map(({ isClaimed, isClaimAvailable, timestamp }, index) => (
            <Ticket
              key={index}
              index={index}
              isClaimed={isClaimed}
              isAvailable={isClaimAvailable}
              timestamp={timestamp}
              onClaim={claimDay.mutateAsync}
              onExpire={refetchData}
            />
          ))}
        </Flex>
        {/* Mint ticket */}
        <Flex>
          <Box
            position="relative"
            onClick={isMintAvailable.data && !isLoading ? handleMint : undefined}
            className={`mint-ticket mint-ticket--${isMintAvailable.data ? 'enabled' : 'disabled'}`}
          >
            <TicketMint isActive={Boolean(isMintAvailable.data)} />

            {isLoading ? (
              <CenteredSpinner background="transparent" color="white" />
            ) : (
              <Text
                pointerEvents="none"
                textStyle="textExtraBoldUpper"
                textAlign="center"
                position="absolute"
                left="50%"
                top="50%"
                transform="translate(-50%, -50%)"
              >
                Mint my <br /> Ticket
              </Text>
            )}
          </Box>
        </Flex>
      </Flex>

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

  const hoursString = (stamps.days * 24 + stamps.hours).toString().padStart(2, '0');

  const isFirst = index === 0;
  const isLast = index === 4;
  const isMiddle = !isFirst && !isLast;

  const Ticket = useMemo(() => {
    if (isFirst) return TicketFirst;
    if (isLast) return TicketLast;
    return TicketMiddle;
  }, [isFirst, isLast]);

  const handleClaim = () => {
    setIsLoading(true);
    onClaim().finally(() => {
      setIsLoading(false);
    });
  };

  const showTimer = isConnected && timestamp;

  return (
    <>
      <Box
        color={isClaimed || isLoading ? 'green.400' : 'bgGreen.400'}
        position="relative"
        transition="all .2s ease"
        mr={!isLast ? '-32px' : undefined}
        _hover={isAvailable ? { cursor: 'pointer' } : undefined}
        onClick={isAvailable && !isLoading ? handleClaim : undefined}
      >
        <Ticket isClaimed={isClaimed} isActive={isAvailable} />
        {isClaimed || isAvailable ? (
          <Center
            pointerEvents="none"
            flexDirection="column"
            textAlign="center"
            color="white"
            position="absolute"
            left="0"
            top="0"
            width="100%"
            height="100%"
            whiteSpace="nowrap"
          >
            {!isLoading ? (
              <>
                <Box mt="10px" mb="10px">
                  <CheckIcon />
                </Box>
                <Text textStyle="textMedium" fontSize="22px">
                  CLAIM
                </Text>
                {isAvailable && timestamp ? (
                  <Text textStyle="text2" whiteSpace="nowrap" width="125px" mt="10px" opacity="0.5">
                    {`${hoursString}h ${stampStrings.minsString}m ${stampStrings.secString}s`}
                  </Text>
                ) : undefined}
              </>
            ) : (
              <Spinner />
            )}
          </Center>
        ) : showTimer ? (
          <Text
            pointerEvents="none"
            width="125px"
            textStyle="text1"
            color="whiteAlpha.500"
            position="absolute"
            left={isFirst ? '50%' : isMiddle ? '56%' : '60%'}
            top="52%"
            whiteSpace="nowrap"
            transform="translate(-50%, -50%)"
            textAlign="left"
          >
            {`${hoursString}h ${stampStrings.minsString}m ${stampStrings.secString}s`}
          </Text>
        ) : (
          <Text
            pointerEvents="none"
            width="100px"
            textStyle="textMedium"
            fontWeight="600"
            color="whiteAlpha.500"
            position="absolute"
            left={isFirst ? '50%' : isMiddle ? '54%' : '56%'}
            top="51%"
            whiteSpace="nowrap"
            transform="translate(-50%, -50%)"
            textAlign="center"
          >
            Day {index + 1}
          </Text>
        )}
      </Box>
    </>
  );
};
