import React from 'react';
import { Box, Button, Center, Flex, Heading, Spacer, Text } from '@chakra-ui/react';
import { ReactComponent as TicketFirst } from '@/assets/images/ticket.svg';
import { ReactComponent as TicketMiddle } from '@/assets/images/ticket-middle.svg';
import { ReactComponent as TicketLast } from '@/assets/images/ticket-last.svg';
import { ReactComponent as TicketDouble } from '@/assets/images/ticket-two-circles.svg';
import { ReactComponent as CheckIcon } from '@/assets/images/icons/check_ticket.svg';
import './TicketClaim.scss';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useAccount } from 'wagmi';

export const TicketClaim = () => {
  const { isConnected, address } = useAccount();
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
          {!isConnected ? <ConnectWalletButton /> : <Button>Buy tickets</Button>}
        </Flex>
      </Flex>
      <Box maxWidth="530px" mt={5}>
        <Text textStyle="text1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy ...
        </Text>
      </Box>
      <Flex w="100%" p="10" mt="12" justifyContent="space-between" className="box-gradient">
        <Flex>
          {/*First ticket*/}
          <Box
            color="green.400"
            filter="drop-shadow(0px 6px 11px rgba(0, 0, 0, 0.25));"
            position="relative"
            mr="-40px"
            mt="5px"
          >
            <TicketFirst />
            <Center
              flexDirection="column"
              textStyle="textMedium"
              textAlign="center"
              textTransform="uppercase"
              color="white"
              position="absolute"
              left="50%"
              top="50%"
              transform="translate(-65%, -50%)"
            >
              <Box mb="10px">
                <CheckIcon />
              </Box>
              Claim
            </Center>
          </Box>
          {/*Repeated ticket*/}
          <Box
            color="#264737"
            filter="drop-shadow(0px 6px 11px rgba(0, 0, 0, 0.25));"
            mr="-52px"
            position="relative"
            transition="all .2s ease"
            _hover={{ color: 'green.400', cursor: 'pointer' }}
          >
            <Box className="asd">
              <TicketMiddle />
            </Box>
            <Center
              flexDirection="column"
              textStyle="textMedium"
              textAlign="center"
              textTransform="uppercase"
              color="white"
              position="absolute"
              left="50%"
              top="50%"
              transform="translate(-62%, -50%)"
            >
              <Box mb="10px">
                <CheckIcon />
              </Box>
              Claim
            </Center>
          </Box>
          <Box
            color="#264737"
            filter="drop-shadow(0px 6px 11px rgba(0, 0, 0, 0.25));"
            position="relative"
            mr="-52px"
          >
            <TicketMiddle />
            <Text
              textStyle="text1"
              color="whiteAlpha.500"
              position="absolute"
              left="50%"
              top="50%"
              transform="translate(-50%, -50%)"
            >
              00h 00m 00s
            </Text>
          </Box>
          {/*Last ticket*/}
          <Box
            color="#264737"
            filter="drop-shadow(0px 6px 11px rgba(0, 0, 0, 0.25));"
            position="relative"
          >
            <TicketLast />
            <Text
              textStyle="text1"
              color="whiteAlpha.500"
              position="absolute"
              left="55%"
              top="50%"
              whiteSpace="nowrap"
              transform="translate(-50%, -50%)"
            >
              00h 00m 00s
            </Text>
          </Box>
        </Flex>
        {/*Double ticket*/}
        <Flex>
          <Box
            color="#264737"
            filter="drop-shadow(0px 6px 11px rgba(0, 0, 0, 0.25));"
            position="relative"
          >
            <div className="ticket-double">
              <TicketDouble />

              <Text
                textStyle="textExtraBoldUpper"
                color="whiteAlpha.500"
                textAlign="center"
                position="absolute"
                left="50%"
                top="50%"
                transform="translate(-50%, -50%)"
              >
                Mint my <br /> ticket
              </Text>
            </div>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};
