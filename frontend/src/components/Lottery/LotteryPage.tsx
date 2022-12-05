import React from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Container, Grid, GridItem, Link, useDisclosure } from '@chakra-ui/react';
import { BigNumber } from 'ethers';

import { LotteryStatusEnum } from '@/hooks/useLottery';

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
  const { isOpen, onOpen, onClose } = useDisclosure(); // Buy Ticket modal

  return (
    <Container variant="dashboard" pt="40px">
      <Link as={RouterLink} to="/" textStyle="button" alignSelf="flex-start" mb="30px">
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        All Raffles
      </Link>

      <Grid gridTemplateColumns="1fr 1fr" gap="20px">
        <GridItem colSpan={2}>
          <LotteryHeading
            status={lottery.status}
            totalTickets={lottery.totalTickets}
            title={lottery.title}
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
              tickets={10}
              showEntered={false}
              enteredTickets={0}
              onBuyClick={onOpen}
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

      {isOpen ? (
        <BuyLotteryTicketsModal
          ticketPrice={lottery.ticketPrice}
          onBuy={() => Promise.resolve()}
          onClose={onClose}
        />
      ) : null}
    </Container>
  );
};
