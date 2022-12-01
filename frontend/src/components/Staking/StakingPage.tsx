import React, { useCallback, useEffect, useMemo } from 'react';
import { Box, Button, Container, Flex, Link, Text } from '@chakra-ui/react';
import { ArrowBackIcon, DownloadIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { Staking } from './Staking';
import { useStaking } from '@/hooks/useStaking';
import { StakingTable } from './StakingTable';

export const StakingPage = () => {
  const { userStakes, stakingPlans, withdraw } = useStaking();

  useEffect(() => {
    document.title = 'iSaver | Earn by staking';
  }, []);

  const stakesList = useMemo(
    () =>
      userStakes.data?.reduce((acc, stakes, index) => {
        const period = stakingPlans.data?.[index].stakingDuration;
        const stakesWithPeriod = stakes.map((s, stakeIndex) => ({
          ...s,
          period,
          planId: index,
          stakeId: stakeIndex,
        }));
        return [...acc, ...stakesWithPeriod];
      }, [] as any) || [],
    [userStakes, stakingPlans]
  );

  const onClaim = useCallback(
    async (planId: number, stakeId: number) => {
      await withdraw.mutateAsync({ planId, stakeId });
    },
    [withdraw]
  );

  return (
    <Container variant="dashboard" pt="60px">
      <Link as={RouterLink} to="/" textStyle="button" alignSelf="flex-start" mb="40px">
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        Back
      </Link>

      <Box mb="80px">
        <Staking isPageView />
      </Box>

      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Text textStyle="h3" textTransform="uppercase" id="stakings-list">
          Your staking
        </Text>

        <Button variant="link" display="none">
          Export
          <DownloadIcon ml="12px" />
        </Button>
      </Flex>

      <Box mb="120px">
        <StakingTable stakes={stakesList} onClaim={onClaim} />
      </Box>
    </Container>
  );
};
