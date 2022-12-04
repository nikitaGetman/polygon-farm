import React, { useEffect } from 'react';
import { Container, Box } from '@chakra-ui/react';
import { Staking } from '@/components/Staking/Staking';
import { ReferralInfo } from '@/components/Referral/ReferralInfo';
import { WalletPortfolio } from '@/components/Dashboard/WalletPortfolio';
import { SquadsList } from '../Squads/SquadsList';
import { LotteryList } from '../Lottery/LotteryList';

export const Dashboard = () => {
  useEffect(() => {
    document.title = 'iSaver | Dashboard';
  }, []);

  return (
    <Container variant="dashboard">
      <Box mt="50px">
        <WalletPortfolio />
      </Box>

      <Box mt="150px">
        <Staking />
      </Box>

      <Box mt="150px" mb="30px">
        <ReferralInfo />
      </Box>

      <Box mb="210px">
        <SquadsList />
      </Box>

      <Box mb="300px">{/* <LotteryList /> */}</Box>
    </Container>
  );
};
