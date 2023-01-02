import React, { FC, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Skeleton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { BigNumber } from 'ethers';
import { useAccount } from 'wagmi';

import { ConnectWalletButton } from '@/components/ui/ConnectWalletButton/ConnectWalletButton';
import { StatBlock } from '@/components/ui/StatBlock/StatBlock';
import { TOKENS } from '@/hooks/contracts/useTokenContract';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { useLocalReferrer } from '@/hooks/useLocalReferrer';
import { useStaking } from '@/hooks/useStaking';
import { getReadableAmount, makeBigNumber } from '@/utils/number';

import { WarningTip } from '../ui/WarningTip/WarningTip';

import { StakingModal } from './StakingModal';
import { StakingPlan } from './StakingPlan';

type StakingProps = {
  isPageView?: boolean;
};
export const Staking: FC<StakingProps> = ({ isPageView }) => {
  const { isConnected, address } = useAccount();
  const { connect } = useConnectWallet();
  const { isOpen, onOpen, onClose } = useDisclosure(); // StakingModal toggle
  const [selectedPlan, setSelectedPlan] = useState<number>();
  const { getLocalReferrer } = useLocalReferrer();

  const { activeStakingPlans, hasEndingSubscription, subscribe, deposit, withdrawAll } =
    useStaking();

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
        const localReferrer = getLocalReferrer() || '';

        await deposit.mutateAsync({
          planId: selectedPlan,
          amount: amountBN,
          isToken2: token === TOKENS.SAVR,
          referrer: localReferrer !== address ? localReferrer : undefined,
        });
        closeModal();
      } else {
        connect();
      }
    },
    [deposit, connect, isConnected, selectedPlan, closeModal, getLocalReferrer, address]
  );

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
      <Flex direction={{ sm: 'column', xl: 'row' }} justifyContent="space-between" gap={5}>
        <Box width={{ sm: '100%', xl: '55%' }}>
          <Text textStyle="sectionHeading" mb="20px">
            Earn by staking
          </Text>

          <Text textStyle="text1">
            Stake your SAV or SAVR holdings to earn more SAV. The longer you stake, the more you
            yield. Accumulate more SAV, so you can increase your governance in the future iSaver
            DAO.
          </Text>
        </Box>

        <Flex
          gap={5}
          alignSelf={{ sm: 'stretch', xl: 'flex-start' }}
          alignItems={{ sm: 'flex-start', xl: 'center' }}
          direction={{ sm: 'column', xl: 'row' }}
        >
          {hasEndingSubscription ? <WarningTip>Check your subscription!</WarningTip> : null}

          {!isPageView ? (
            isConnected ? (
              <Button as={Link} to="/staking" width={{ sm: '100%', lg: '50%', xl: 'unset' }}>
                My stake
              </Button>
            ) : (
              <ConnectWalletButton />
            )
          ) : null}
        </Flex>
      </Flex>

      {isPageView ? (
        <Flex justifyContent={{ lg: 'flex-start', xl: 'flex-end' }} mt="30px">
          <StatBlock
            leftWidth="260px"
            leftTitle="Total in Staking"
            leftValue={getReadableAmount(totalStakeSav)}
            leftCurrency="SAV"
            rightWidth="260px"
            rightTitle="Total in Staking"
            rightValue={getReadableAmount(totalStakeSavR)}
            rightCurrency="SAVR"
          />
        </Flex>
      ) : null}

      <Grid
        mt={isPageView ? '50px' : '40px'}
        gap={5}
        templateRows="repeat(2, 1fr)"
        templateColumns={{ lg: 'repeat(1, 1fr)', xl: 'repeat(2, 1fr)' }}
      >
        {!activeStakingPlans.length
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                height="210px"
                borderRadius="md"
                startColor="gray.200"
                endColor="bgGreen.200"
              />
            ))
          : null}
        {activeStakingPlans.map((planData) => (
          <GridItem colSpan={1} rowSpan={1} key={planData.planId} width="100%">
            <StakingPlan
              isSubscribed={planData.isSubscribed}
              isSubscriptionEnding={planData.isSubscriptionEnding}
              subscribedTill={planData.subscribedTill}
              subscriptionCost={planData.subscriptionCost}
              subscriptionDuration={planData.subscriptionDuration}
              stakingDuration={planData.stakingDuration}
              poolSize={planData.currentToken1Locked.add(planData.currentToken2Locked)}
              apr={planData.apr.toString()}
              userStakeSav={planData.currentToken1Staked || 0}
              userStakeSavR={planData.currentToken2Staked || 0}
              userTotalReward={planData.totalReward}
              isClaimAvailable={planData.hasReadyStakes}
              onSubscribe={() => subscribe.mutateAsync(planData.planId)}
              onDeposit={() => openModal(planData.planId)}
              onClaim={() => withdrawAll.mutateAsync(planData.planId)}
            />
          </GridItem>
        ))}
      </Grid>
      {isOpen && selectedPlan !== undefined ? (
        <StakingModal
          apr={activeStakingPlans[selectedPlan].apr.toString()}
          lockPeriodDays={activeStakingPlans[selectedPlan].stakingDuration}
          isLoading={deposit.isLoading}
          onClose={closeModal}
          onStake={onDeposit}
        />
      ) : null}
    </Container>
  );
};
