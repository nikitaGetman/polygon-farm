import React from 'react';
import { Container, Box } from '@chakra-ui/react';
import { Staking } from '@/components/Staking/Staking';
import { Squads } from '@/components/Squads/Squads';
import { WalletPortfolio } from '@/components/Dashboard/WalletPortfolio';
import { SquadsList } from '../Squads/SquadsList';

export const Dashboard = () => {
  return (
    <Container variant="dashboard">
      <Box mt="50px">
        <WalletPortfolio />
      </Box>

      <Box mt="150px">
        <Staking />
      </Box>

      <Box mt="150px" mb="30px">
        <Squads />
      </Box>
      <Box mb="300px">{/* <SquadsList /> */}</Box>
    </Container>
  );
};
