import React, { useCallback, useMemo, useState } from 'react';
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
  useDisclosure,
} from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import { ConnectWalletButton } from '@/components/ConnectWalletButton/ConnectWalletButton';
import { useAccount } from 'wagmi';
import { useStaking } from '@/hooks/useStaking';
import { getYearlyAPR, makeBigNumber } from '@/utils/number';
import { StakingPlan } from './StakingPlan';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { StakingModal } from './StakingModal';
import { TOKENS } from '@/hooks/useTokens';
import { Link } from 'react-router-dom';

export const Staking = () => {
  const { isConnected } = useAccount();
  const { connect } = useConnectWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState<number>();

  const { activeStakingPlans, hasEndingSubscription, subscribe, deposit } = useStaking();

  const openModal = useCallback(
    (index: number) => {
      setSelectedPlan(index);
      onOpen();
    },
    [setSelectedPlan, onOpen]
  );
  const closeModal = useCallback(() => {
    setSelectedPlan(undefined);
    onClose();
  }, [setSelectedPlan, onClose]);

  const onDeposit = useCallback(
    async (token: TOKENS, amount: number) => {
      if (isConnected && selectedPlan !== undefined) {
        const amountBN = makeBigNumber(amount);

        await deposit.mutateAsync({
          planId: selectedPlan,
          amount: amountBN,
          isToken2: token === TOKENS.SAVR,
        });
        closeModal();
      } else {
        connect();
      }
    },
    [deposit, connect, isConnected, selectedPlan, closeModal]
  );

  const onClaim = useCallback(() => {}, []);

  return (
    <Container variant="dashboard">
      <Flex alignItems="center" gap="2">
        <Heading textStyle="h1">Earn by staking</Heading>
        <Spacer />
        <Box>
          {isConnected ? (
            <Box display="flex" alignItems="center">
              {hasEndingSubscription && (
                <Text
                  textStyle="textBold"
                  color="error"
                  mr="30px"
                  display="flex"
                  alignItems="center"
                >
                  <>
                    <WarningTwoIcon mr="10px" />
                    Check your subscription!
                  </>
                </Text>
              )}
              <Button as={Link} to="/staking">
                My stake
              </Button>
            </Box>
          ) : (
            <ConnectWalletButton />
          )}
        </Box>
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
              isSubscriptionEnding={planData.isSubscriptionEnding}
              subscribedTill={planData.subscribedTill}
              subscriptionCost={planData.subscriptionCost}
              subscriptionDuration={planData.subscriptionDuration}
              stakingDuration={planData.stakingDuration}
              poolSize={planData.totalStakedToken1.add(planData.totalStakedToken2)}
              apr={getYearlyAPR(planData.profitPercent, planData.stakingDuration)}
              userStakeSav={planData.currentToken1Staked || 0}
              // userStakeSavR={planData.currentToken2Staked || 0}
              userStakeSavR={0}
              userReward={0}
              onSubscribe={isConnected ? () => subscribe.mutate(index) : connect}
              onDeposit={() => openModal(index)}
              onClaim={onClaim}
            />
          </GridItem>
        ))}
      </Grid>
      {isOpen && selectedPlan !== undefined && (
        <StakingModal
          apr={getYearlyAPR(
            activeStakingPlans[selectedPlan].profitPercent,
            activeStakingPlans[selectedPlan].stakingDuration
          )}
          lockPeriodDays={activeStakingPlans[selectedPlan].subscriptionDuration}
          isLoading={deposit.isLoading}
          onClose={closeModal}
          onStake={onDeposit}
        />
      )}
    </Container>
  );
};
