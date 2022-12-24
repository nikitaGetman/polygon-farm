import React, { useCallback, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon, DownloadIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Flex, Link, Text } from '@chakra-ui/react';

import { useDocumentTitle, useMetaDescription } from '@/hooks/useMeta';
import { useStaking } from '@/hooks/useStaking';

import { Staking } from './Staking';
import { StakingTable } from './StakingTable';

export const StakingPage = () => {
  useDocumentTitle('iSaver | Earn by staking');
  useMetaDescription(
    'Stake your SAV or SAVR holdings to earn more SAV. The longer you stake, the more you yield. Accumulate more SAV, so you can increase your governance in the future iSaver DAO'
  );

  const { userStakesRequest, stakingPlansRequest, withdraw } = useStaking();

  const stakesList = useMemo(
    () =>
      userStakesRequest.data?.reduce((acc, stakes, index) => {
        const period = stakingPlansRequest.data?.[index].stakingDuration;
        const stakesWithPeriod = stakes.map((s, stakeIndex) => ({
          ...s,
          period,
          planId: index,
          stakeId: stakeIndex,
        }));
        return [...acc, ...stakesWithPeriod];
      }, [] as any) || [],
    [userStakesRequest.data, stakingPlansRequest.data]
  );

  const onClaim = useCallback(
    async (planId: number, stakeId: number) => {
      await withdraw.mutateAsync({ planId, stakeId });
    },
    [withdraw]
  );

  return (
    <Container variant="dashboard" pt={{ sm: '30px', '2xl': '60px' }}>
      <Link
        as={RouterLink}
        to="/"
        textStyle="button"
        alignSelf="flex-start"
        mb={{ sm: '30px', '2xl': '40px' }}
      >
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
