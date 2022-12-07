import React, { FC, useMemo } from 'react';
import { Box, Button, Center, Flex, Heading, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { ReactComponent as CheckIcon } from '@/assets/images/icons/check_ticket.svg';
import { ReactComponent as TicketFirst } from '@/assets/images/ticket.svg';
import { ReactComponent as TicketLast } from '@/assets/images/ticket-last.svg';
import { ReactComponent as TicketMiddle } from '@/assets/images/ticket-middle.svg';
import { ReactComponent as TicketDouble } from '@/assets/images/ticket-two-circles.svg';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useCountdown } from '@/hooks/useCountdown';
import { useLottery } from '@/hooks/useLottery';

import { BuyLotteryTicketsModal } from '../Lottery/BuyLotteryTicketsModal';

import './TicketClaim.scss';

export const TicketClaim = () => {
  const { isConnected } = useAccount();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Buy Ticket modal
  const { ticketPrice, buyTickets } = useLottery();

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
            1 Ticket / 5 SAV
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
        <Flex>
          <Ticket index={0} isClaimed={true} isAvailable={true} timestamp={0} />
          <Ticket index={1} isClaimed={true} isAvailable={true} timestamp={0} />
          <Ticket index={2} isClaimed={true} isAvailable={true} timestamp={Date.now() + 4000} />
          <Ticket index={3} isClaimed={true} isAvailable={true} timestamp={Date.now() + 10000} />
          <Ticket index={4} isClaimed={true} isAvailable={true} timestamp={Date.now() + 16000} />
        </Flex>
        {/* Mint ticket */}
        <Flex>
          <Box
            color="bgGreen.400"
            filter="drop-shadow(0px 6px 11px rgba(0, 0, 0, 0.25))"
            position="relative"
          >
            <div className="mint-ticket mint-ticket--enabled">
              <TicketDouble />

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
  onClaim?: () => {};
};
const Ticket: FC<TicketProps> = ({ index, isClaimed, isAvailable, timestamp, onClaim }) => {
  const { stamps, stampStrings } = useCountdown(timestamp);

  const hoursString = (stamps.days * 24 + stamps.hours).toString().padStart(2, '0');

  const isFirst = index === 0;
  const isLast = index === 4;
  const isMiddle = !isFirst && !isLast;

  const ticket = useMemo(() => {
    if (isFirst) return <TicketFirst />;
    if (isLast) return <TicketLast />;
    return <TicketMiddle />;
  }, [isFirst, isLast]);

  return (
    <>
      <Box
        color={isClaimed ? 'green.400' : 'bgGreen.400'}
        filter="drop-shadow(0px 6px 11px rgba(0, 0, 0, 0.25))"
        position="relative"
        transition="all .2s ease"
        mr={!isLast ? '-54px' : undefined}
        // zIndex={5 - index}
        _hover={isAvailable ? { color: 'green.400', cursor: 'pointer' } : undefined}
        onClick={isAvailable ? onClaim : undefined}
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
            <Box mb="10px">
              <CheckIcon />
            </Box>
            Claim
          </Center>
        ) : (
          <Text
            textStyle="text1"
            color="whiteAlpha.500"
            position="absolute"
            left={isFirst ? '45%' : isMiddle ? '51%' : '56%'}
            top="46%"
            whiteSpace="nowrap"
            transform="translate(-50%, -50%)"
          >
            {hoursString}h {stampStrings.minsString}m {stampStrings.secString}s
          </Text>
        )}
      </Box>
    </>
  );
};
