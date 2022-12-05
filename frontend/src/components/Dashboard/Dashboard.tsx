import React, { useEffect } from 'react';
import { Box, Container } from '@chakra-ui/react';

import { WalletPortfolio } from '@/components/Dashboard/WalletPortfolio';
import { ReferralInfo } from '@/components/Referral/ReferralInfo';
import { Staking } from '@/components/Staking/Staking';

import { LotteryList } from '../Lottery/LotteryList';
import { SquadsList } from '../Squads/SquadsList';

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

      <Box mb="300px">
        <LotteryList />
      </Box>
    </Container>
  );
};
