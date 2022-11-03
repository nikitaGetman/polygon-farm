import React, { FC, ReactElement, useCallback } from 'react';
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
import { useStakingInfo } from '@/hooks/useStakingInfo';
import { useStakingContract } from '@/hooks/contracts/useStakingContract';
import { BigNumber, ethers } from 'ethers';

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

  const { contract, deposit, withdraw } = useStakingContract();
  // const stakingInfoData = useStakingInfo();

  // console.log('stakingInfoData', stakingInfoData);

  const onSubscribe = useCallback(() => {}, []);
  const onDeposit = useCallback(() => {
    deposit({
      planId: 0,
      amount: BigNumber.from(10).pow(19),
      isToken2: false,
    });
  }, [deposit]);
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
        bgColor={isSubscribed ? 'green.10050' : 'grey'}
        p="10px 20px"
        justifyContent="flex-end"
        height="60px"
        alignItems="center"
      >
        {isSubscribed ? (
          <Text textStyle="textSansBald" px="44px">
            Active
          </Text>
        ) : (
          <>
            <Text textStyle="textSansBald">{subscriptionCost}</Text>
            <Button onClick={onSubscribe} size="md" ml={5}>
              Activate
            </Button>
          </>
        )}
      </Flex>

      <Box bgColor="rgba(38, 71, 55, 0.5)" boxShadow="0px 6px 11px rgba(0, 0, 0, 0.25)" p="20px">
        <Flex alignItems="center" gap={5}>
          <Box flexGrow={1}>
            <Flex justifyContent="space-between" gap={2} mb={7}>
              <StakingParameter title="Locking period">{stakingDuration}</StakingParameter>
              <StakingParameter title="Pool size">{poolSize}M</StakingParameter>
              <StakingParameter title="APR">{apr}%</StakingParameter>
            </Flex>
            <Flex justifyContent="space-between">
              <StakingParameter title="Your Stake">
                <Box as="span" ml={3} mr={6}>
                  {userStakeSav} SAV
                </Box>
                <Box as="span">{userStakeSavR} SAVR</Box>
              </StakingParameter>
              <StakingParameter title="Your rewards">{userReward} SAV</StakingParameter>
            </Flex>
          </Box>

          <Flex direction="column" flex="0 0 140px" gap={4}>
            <Button onClick={onDeposit} variant="outlined" disabled={!isSubscribed}>
              Deposit
            </Button>
            <Button onClick={onClaim} variant="outlined" disabled={!userReward}>
              Claim
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

const StakingParameter = ({ title, children }: { title: string; children: any }) => {
  return (
    <Flex alignItems="center">
      <Text textStyle="textSansSmall" mr="10px">{`${title}`}</Text>
      <Text textStyle="textSansBald">{children}</Text>
    </Flex>
  );
};
