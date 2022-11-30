import React from 'react';
import { Container, Box } from '@chakra-ui/react';
import { Staking } from '@/components/Staking/Staking';
import './Dashboard.scss';

import { WalletPortfolio } from '@/components/WalletPortfolio/WalletPortfolio';
import { TicketClaim } from '@/components/TicketClaim/TicketClaim';

export const Dashboard = () => {
  return (
    <Container variant="dashboard">
      <Box mt="150px" mb="300px">
        <TicketClaim />
      </Box>

      <Box mt="50px">
        <WalletPortfolio />
      </Box>

      <Box mt="150px" mb="300px">
        <Staking />
      </Box>
    </Container>
  );
};
