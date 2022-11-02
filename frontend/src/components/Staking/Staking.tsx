import React, { FC, useCallback } from 'react';
import {
  Container,
  Box,
  Text,
  Heading,
  Flex,
  ButtonGroup,
  Grid,
  GridItem,
  Spacer,
  Button,
} from '@chakra-ui/react';
import { ConnectWalletButton } from '@/components/ConnectWalletButton/ConnectWalletButton';
import { useAccount } from 'wagmi';

const stakingPlansData = [
  {
    isSubscribed: true,
    subscriptionCost: '1 SAV / 1 Year',
    stakingDuration: '15 days',
    poolSize: 100,
    apr: 6.99,
    userStakeSav: 0,
    userStakeSavR: 0,
    userReward: 0,
  },
  {
    isSubscribed: false,
    subscriptionCost: '5 SAV / 1 Year',
    stakingDuration: '30 days',
    poolSize: 250,
    apr: 12.99,
    userStakeSav: 0,
    userStakeSavR: 0,
    userReward: 0,
  },
  {
    isSubscribed: false,
    subscriptionCost: '15 SAV / 1 Year',
    stakingDuration: '03 mnth',
    poolSize: 250,
    apr: 35.99,
    userStakeSav: 0,
    userStakeSavR: 0,
    userReward: 0,
  },
  {
    isSubscribed: false,
    subscriptionCost: '50 SAV / 1 Year',
    stakingDuration: '06 mnth',
    poolSize: 250,
    apr: 69.99,
    userStakeSav: 0,
    userStakeSavR: 0,
    userReward: 0,
  },
];

export const Staking = () => {
  const { address, isConnected, connector } = useAccount();

  const onSubscribe = useCallback(() => {}, []);
  const onDeposit = useCallback(() => {}, []);
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
        {stakingPlansData.map((planData, index) => (
          <GridItem colSpan={1} rowSpan={1} key={index}>
            <StakingPlan
              {...planData}
              onSubscribe={onSubscribe}
              onDeposit={onDeposit}
              onClaim={onClaim}
            />
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};

type StakingPlanProps = {
  isSubscribed: boolean;
  subscriptionCost?: string;
  stakingDuration: string;
  poolSize: number;
  apr: number;
  userStakeSav: number;
  userStakeSavR: number;
  userReward: number;

  onSubscribe: () => void;
  onDeposit: () => void;
  onClaim: () => void;
};
const StakingPlan: FC<StakingPlanProps> = ({
  isSubscribed,
  subscriptionCost,
  stakingDuration,
  poolSize,
  apr,
  userStakeSav,
  userStakeSavR,
  userReward,
  onSubscribe,
  onDeposit,
  onClaim,
}) => {
  return (
    <Box borderRadius="md" overflow="hidden" filter="drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))">
      <Flex
        bgColor={isSubscribed ? 'green.100' : 'grey'}
        opacity="0.5"
        p="10px 20px"
        justifyContent="flex-end"
        height="60px"
        alignItems="center"
      >
        {isSubscribed ? (
          <Text textStyle="textSansCommon" px="44px">
            Active
          </Text>
        ) : (
          <>
            <Text textStyle="textSansCommon">{subscriptionCost}</Text>
            <Button onClick={onSubscribe} size="md">
              Activate
            </Button>
          </>
        )}
      </Flex>

      <Box
        bgColor="rgba(38, 71, 55, 0.5)"
        boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)"
        p="10px 20px"
      >
        Some other text
      </Box>
    </Box>
  );
};
