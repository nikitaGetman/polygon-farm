import React from 'react';
import { Box, Container } from '@chakra-ui/react';

import { WalletPortfolio } from '@/components/Dashboard/WalletPortfolio';
import { ReferralInfo } from '@/components/Referral/ReferralInfo';
import { Staking } from '@/components/Staking/Staking';
import { TicketClaim } from '@/components/TicketClaim/TicketClaim';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { LotteryList } from '../Lottery/LotteryList';
import { SquadsList } from '../Squads/SquadsList';

export const Dashboard = () => {
  useDocumentTitle('iSaver | Dashboard');

  return (
    <Container variant="dashboard">
      <Box mt={{ sm: '30px', '2xl': '50px' }}>
        <WalletPortfolio />
      </Box>

      <Box mt={{ sm: '100px', xl: '150px' }}>
        <Staking />
      </Box>

      <Box mt="150px" mb="30px">
        <ReferralInfo />
      </Box>

      <Box mb="210px">
        <SquadsList />
      </Box>

      <Box mb="150px" id="claim-ticket">
        <TicketClaim />
      </Box>

      <Box mb="300px" id="raffles">
        <LotteryList />
      </Box>
    </Container>
  );
};
