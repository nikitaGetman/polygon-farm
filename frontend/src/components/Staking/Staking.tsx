import React, { FC, useCallback, useMemo, useState } from 'react';
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
  Skeleton,
} from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { useAccount } from 'wagmi';
import { useStaking } from '@/hooks/useStaking';
import { getReadableAmount, getYearlyAPR, makeBigNumber } from '@/utils/number';
import { StakingPlan } from './StakingPlan';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { StakingModal } from './StakingModal';
import { TOKENS } from '@/hooks/useTokens';
import { Link, useNavigate } from 'react-router-dom';
import { StatBlock } from '@/components/ui/StatBlock/StatBlock';
import { BigNumber } from 'ethers';
import { useLocalReferrer } from '@/hooks/useLocalReferrer';

type StakingProps = {
  isPageView?: boolean;
};
export const Staking: FC<StakingProps> = ({ isPageView }) => {
  const { isConnected } = useAccount();
  const { connect } = useConnectWallet();
  const { isOpen, onOpen, onClose } = useDisclosure(); // StakingModal toggle
  const [selectedPlan, setSelectedPlan] = useState<number>();
  const navigate = useNavigate();
  const { localReferrer } = useLocalReferrer();

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

  const onSubscribe = useCallback(
    (planId: number) => {
      setSelectedPlan(planId);
      subscribe.mutate(planId);
    },
    [setSelectedPlan, subscribe]
  );

  const onDeposit = useCallback(
    async (token: TOKENS, amount: number) => {
      if (isConnected && selectedPlan !== undefined) {
        const amountBN = makeBigNumber(amount);

        await deposit.mutateAsync({
          planId: selectedPlan,
          amount: amountBN,
          isToken2: token === TOKENS.SAVR,
          referrer: localReferrer,
        });
        closeModal();
      } else {
        connect();
      }
    },
    [deposit, connect, isConnected, selectedPlan, closeModal, localReferrer]
  );

  const onClaim = useCallback(() => {
    if (isPageView) {
      const element = document.getElementById('stakings-list');
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/staking');
    }
  }, [navigate, isPageView]);

  const totalStakeSav = useMemo(
    () =>
      activeStakingPlans.reduce(
        (acc, plan) => acc.add(plan.currentToken1Staked || 0),
        BigNumber.from(0)
      ),
    [activeStakingPlans]
  );
  const totalStakeSavR = useMemo(
    () =>
      activeStakingPlans.reduce(
        (acc, plan) => acc.add(plan.currentToken2Staked || 0),
        BigNumber.from(0)
      ),
    [activeStakingPlans]
  );

  return (
    <Container variant="dashboard">
      <Flex alignItems="center" gap="2">
        <Heading textStyle="h1">Earn by staking</Heading>
        <Spacer />
        <Box>
          {isConnected ? (
            <Box display="flex" alignItems="center">
              {hasEndingSubscription ? (
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
              ) : null}
              {!isPageView ? (
                <Button as={Link} to="/staking">
                  My stake
                </Button>
              ) : null}
            </Box>
          ) : !isPageView ? (
            <ConnectWalletButton />
          ) : null}
        </Box>
      </Flex>

      <Box maxWidth="640px" mt={5}>
        <Text textStyle="text1">
          Stake your SAV or SAVR holdings to earn more SAV. The longer you stake, the more you
          yield. Accumulate more SAV, so you can increase your governance in the future iSaver DAO.
        </Text>
      </Box>

      {isPageView ? (
        <Flex justifyContent="flex-end" mt="30px">
          <StatBlock width="260px">
            <Box textStyle="text1" mb="10px">
              Total in Staking
            </Box>
            <Box textStyle="text1">
              <Box as="span" textStyle="textSansBold" fontSize="26px" mr="6px">
                {getReadableAmount(totalStakeSav)}
              </Box>
              SAV
            </Box>
          </StatBlock>
          <StatBlock width="260px">
            <Box textStyle="text1" mb="10px">
              Total in Staking
            </Box>
            <Box textStyle="text1">
              <Box as="span" textStyle="textSansBold" fontSize="26px" mr="6px">
                {getReadableAmount(totalStakeSavR)}
              </Box>
              SAVR
            </Box>
          </StatBlock>
        </Flex>
      ) : null}

      <Grid
        mt={isPageView ? '30px' : '40px'}
        gap={5}
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(2, 1fr)"
      >
        {!activeStakingPlans.length
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                height="210px"
                borderRadius="md"
                startColor="grey.200"
                endColor="bgGreen.200"
              />
            ))
          : null}
        {activeStakingPlans.map((planData, index) => (
          <GridItem colSpan={1} rowSpan={1} key={planData.planId}>
            <StakingPlan
              isSubscribed={planData.isSubscribed}
              isSubscriptionEnding={planData.isSubscriptionEnding}
              subscribedTill={planData.subscribedTill}
              subscriptionCost={planData.subscriptionCost}
              subscriptionDuration={planData.subscriptionDuration}
              stakingDuration={planData.stakingDuration}
              poolSize={planData.currentToken1Locked.add(planData.currentToken2Locked)}
              apr={getYearlyAPR(planData.profitPercent, planData.stakingDuration)}
              userStakeSav={planData.currentToken1Staked || 0}
              userStakeSavR={planData.currentToken2Staked || 0}
              userReward={planData.currentReward}
              isClaimAvailable={planData.hasReadyStakes}
              onSubscribe={isConnected ? () => onSubscribe(planData.planId) : connect}
              isSubscribeLoading={selectedPlan === planData.planId && subscribe.isLoading}
              onDeposit={() => openModal(planData.planId)}
              onClaim={onClaim}
            />
          </GridItem>
        ))}
      </Grid>
      {isOpen && selectedPlan !== undefined ? (
        <StakingModal
          apr={getYearlyAPR(
            activeStakingPlans[selectedPlan].profitPercent,
            activeStakingPlans[selectedPlan].stakingDuration
          )}
          lockPeriodDays={activeStakingPlans[selectedPlan].stakingDuration}
          isLoading={deposit.isLoading}
          onClose={closeModal}
          onStake={onDeposit}
        />
      ) : null}
    </Container>
  );
};
