import React from 'react';
import { Container, Box } from '@chakra-ui/react';
import { Staking } from '@/components/Staking/Staking';
import './Dashboard.scss';

import { WalletPortfolio } from '@/components/WalletPortfolio/WalletPortfolio';

export const Dashboard = () => {
  return (
    <Container variant="dashboard">
      <Box mt="50px">
        <WalletPortfolio />
      </Box>
      <Staking />
    </Container>
  );
};
