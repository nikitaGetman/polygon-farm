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
import { ReactComponent as TicketFirst } from '@/assets/images/ticket.svg';
import { ReactComponent as TicketLast } from '@/assets/images/ticket-last.svg';
import { ReactComponent as TicketMiddle } from '@/assets/images/ticket-middle.svg';
import { ReactComponent as TicketDouble } from '@/assets/images/ticket-two-circles.svg';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useCountdown } from '@/hooks/useCountdown';
import { useLottery } from '@/hooks/useLottery';
import { bigNumberToString } from '@/utils/number';

import { BuyLotteryTicketsModal } from '../Lottery/BuyLotteryTicketsModal';
import { CenteredSpinner } from '../ui/CenteredSpinner/CenteredSpinner';

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

      if (!isClaimed && !isClaimAvailable && claimPeriod.data) {
        const streak = claimStreak.data || 0;
        const lastClaimTime =
          (!streak && !isClaimedToday.data) || !lastClaim.data
            ? Math.floor(currentTime / claimPeriod.data) * claimPeriod.data
            : lastClaim.data;

        const timeOffset =
          streak || isClaimedToday.data
            ? claimPeriod.data * (index - streak + 1)
            : claimPeriod.data * index;
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
            1 Ticket / {bigNumberToString(ticketPrice, { precision: 0 })} SAV
          </Text>
          {!isConnected ? <ConnectWalletButton /> : <Button onClick={onOpen}>Buy tickets</Button>}
        </Flex>
      </Flex>
      <Box maxWidth="530px" mt={5}>
        <Text textStyle="text1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy ...
        </Text>
      </Box>
      <Flex w="100%" p="10" pb="8" mt="12" justifyContent="space-between" className="box-gradient">
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
            color="bgGreen.400"
            filter="drop-shadow(0px 6px 11px rgba(0, 0, 0, 0.25))"
            position="relative"
            onClick={isMintAvailable.data && !isLoading ? handleMint : undefined}
          >
            <div
              tabIndex={0}
              className={[
                'mint-ticket',
                `mint-ticket--${isMintAvailable.data ? 'enabled' : 'disabled'}`,
              ].join(' ')}
            >
              <TicketDouble />

              {isLoading ? (
                <CenteredSpinner background="transparent" color="white" />
              ) : (
                <Text
                  textStyle="textExtraBoldUpper"
                  color="whiteAlpha.500"
                  textAlign="center"
                  position="absolute"
                  left="50%"
                  top="46%"
                  transform="translate(-50%, -50%)"
                >
                  Mint my <br /> ticket
                </Text>
              )}
            </div>
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

  const ticket = useMemo(() => {
    if (isFirst) return <TicketFirst />;
    if (isLast) return <TicketLast />;
    return <TicketMiddle />;
  }, [isFirst, isLast]);

  const handleClaim = () => {
    setIsLoading(true);
    onClaim().finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <>
      <Box
        color={isClaimed || isLoading ? 'green.400' : 'bgGreen.400'}
        filter="drop-shadow(0px 6px 11px rgba(0, 0, 0, 0.25))"
        position="relative"
        transition="all .2s ease"
        mr={!isLast ? '-54px' : undefined}
        // zIndex={5 - index}
        _hover={isAvailable ? { color: 'green.400', cursor: 'pointer' } : undefined}
        onClick={isAvailable && !isLoading ? handleClaim : undefined}
      >
        <Box stroke={isAvailable ? 'green.400' : undefined}>{ticket}</Box>
        {isClaimed || isAvailable ? (
          <Center
            flexDirection="column"
            textStyle="textMedium"
            textAlign="center"
            textTransform="uppercase"
            color="white"
            position="absolute"
            left={isLast ? '55%' : '50%'}
            top="48%"
            whiteSpace="nowrap"
            transform={
              isFirst
                ? 'translate(-65%, -50%)'
                : isMiddle
                ? 'translate(-62%, -50%)'
                : 'translate(-50%, -50%)'
            }
          >
            {!isLoading ? (
              <>
                <Box mb="10px">
                  <CheckIcon />
                </Box>
                Claim
              </>
            ) : (
              <Spinner />
            )}
          </Center>
        ) : (
          <Text
            width="125px"
            textStyle={isConnected ? 'text1' : 'textMedium'}
            color="whiteAlpha.500"
            position="absolute"
            left={isFirst ? '45%' : isMiddle ? '51%' : '58%'}
            top="46%"
            whiteSpace="nowrap"
            transform="translate(-50%, -50%)"
            textAlign={isConnected ? 'left' : 'center'}
          >
            {isConnected
              ? `${hoursString}h ${stampStrings.minsString}m ${stampStrings.secString}s`
              : `Day ${index + 1}`}
          </Text>
        )}
      </Box>
    </>
  );
};
