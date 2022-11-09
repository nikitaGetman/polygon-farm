import React, { useCallback } from 'react';
import {
  Container,
  Box,
  Text,
  Heading,
  Flex,
  Grid,
  GridItem,
  Spacer,
  Button,
} from '@chakra-ui/react';
import { ConnectWalletButton } from '@/components/ConnectWalletButton/ConnectWalletButton';
import { useAccount } from 'wagmi';
import { useStaking } from '@/hooks/useStaking';
import { useStakingContract } from '@/hooks/contracts/useStakingContract';
import { BigNumber } from 'ethers';
import { getYearlyAPR } from '@/utils/number';
import { StakingPlan } from './StakingPlan';
import { useConnectWallet } from '@/hooks/useConnectWallet';

export const Staking = () => {
  const { isConnected } = useAccount();

  const stakingContract = useStakingContract();
  const { connect } = useConnectWallet();

  const { activeStakingPlans, subscribe } = useStaking();

  const onDeposit = useCallback(() => {
    stakingContract.deposit({
      planId: 0,
      amount: BigNumber.from(10).pow(19),
      isToken2: false,
    });
  }, [stakingContract]);

  const onClaim = useCallback(() => {}, []);

  return (
    <Container variant="dashboard">
      <Flex alignItems="center" gap="2">
        <Heading textStyle="h1">Earn by staking</Heading>
        <Spacer />
        <Box>{isConnected ? <Button>My stake</Button> : <ConnectWalletButton />}</Box>
      </Flex>

      <Box maxWidth="530px" mt={5}>
        <Text textStyle="text1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy ...
        </Text>
      </Box>

      <Grid mt={10} gap={5} templateRows="repeat(2, 1fr)" templateColumns="repeat(2, 1fr)">
        {activeStakingPlans.map((planData, index) => (
          <GridItem colSpan={1} rowSpan={1} key={index}>
            <StakingPlan
              isSubscribed={planData.isSubscribed}
              subscriptionCost={planData.subscriptionCost}
              subscriptionDuration={planData.subscriptionDuration}
              stakingDuration={planData.stakingDuration}
              poolSize={planData.totalStakedToken1.add(planData.totalStakedToken2)}
              apr={getYearlyAPR(planData.profitPercent, planData.stakingDuration)}
              userStakeSav={0}
              userStakeSavR={0}
              userReward={0}
              onSubscribe={isConnected ? () => subscribe.mutate(index) : connect}
              onDeposit={onDeposit}
              onClaim={onClaim}
            />
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};
