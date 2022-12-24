import React from 'react';
import { Box, Container } from '@chakra-ui/react';

import { WalletPortfolio } from '@/components/Dashboard/WalletPortfolio';
import { ReferralInfo } from '@/components/Referral/ReferralInfo';
import { Staking } from '@/components/Staking/Staking';
import { TicketClaim } from '@/components/TicketClaim/TicketClaim';
import { useDocumentTitle, useMetaDescription } from '@/hooks/useMeta';

import { LotteryList } from '../Lottery/LotteryList';
import { SquadsList } from '../Squads/SquadsList';

export const Dashboard = () => {
  useDocumentTitle('iSaver | Dashboard');
  useMetaDescription(
    'All information about your assets is on iSaver. Staking pools, Referral Program, Raffles and our mini free-to-play Crypto Game as a first step. Use the capabilities of our DeFi platform to the maximum!'
  );

  return (
    <Container variant="dashboard">
      <Box mt={{ sm: '30px', '2xl': '50px' }} id="dashboard">
        <WalletPortfolio />
      </Box>

      <Box mt={{ sm: '100px', xl: '150px' }}>
        <Staking />
      </Box>

      <Box mt={{ sm: '100px', xl: '150px' }}>
        <ReferralInfo />

        <Box mt="30px">
          <SquadsList />
        </Box>
      </Box>

      <Box mt={{ sm: '100px', xl: '150px' }} id="claim-ticket">
        <TicketClaim />
      </Box>

      <Box mt={{ sm: '100px', xl: '150px' }} mb={{ sm: '100px', xl: '150px' }} id="raffles">
        <LotteryList />
      </Box>
    </Container>
  );
};
