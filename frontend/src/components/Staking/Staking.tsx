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
} from '@chakra-ui/react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import { ConnectWalletButton } from '@/components/ConnectWalletButton/ConnectWalletButton';
import { useAccount } from 'wagmi';
import { useStaking } from '@/hooks/useStaking';
import { getReadableAmount, getYearlyAPR, makeBigNumber } from '@/utils/number';
import { StakingPlan } from './StakingPlan';
import { useConnectWallet } from '@/hooks/useConnectWallet';
import { StakingModal } from './StakingModal';
import { TOKENS } from '@/hooks/useTokens';
import { Link, useNavigate } from 'react-router-dom';
import { StatBlock } from '../ui/StatBlock/StatBlock';
import { BigNumber } from 'ethers';

type StakingProps = {
  isPageView?: boolean;
};
export const Staking: FC<StakingProps> = ({ isPageView }) => {
  const { isConnected } = useAccount();
  const { connect } = useConnectWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState<number>();
  const navigate = useNavigate();

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

  const onClaim = useCallback(() => {
    if (isPageView) {
      const element = document.getElementById('stakings-list');
      element?.scrollIntoView();
    } else {
      navigate('/staking#stakings-list');
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
              {!isPageView && (
                <Button as={Link} to="/staking">
                  My stake
                </Button>
              )}
            </Box>
          ) : (
            !isPageView && <ConnectWalletButton />
          )}
        </Box>
      </Flex>

      <Box maxWidth="530px" mt={5}>
        <Text textStyle="text1">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy ...
        </Text>
      </Box>

      {isPageView && (
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
      )}

      <Grid
        mt={isPageView ? '30px' : '40px'}
        gap={5}
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(2, 1fr)"
      >
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
              onSubscribe={isConnected ? () => subscribe.mutate(planData.planId) : connect}
              onDeposit={() => openModal(planData.planId)}
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
          lockPeriodDays={activeStakingPlans[selectedPlan].stakingDuration}
          isLoading={deposit.isLoading}
          onClose={closeModal}
          onStake={onDeposit}
        />
      )}
    </Container>
  );
};
