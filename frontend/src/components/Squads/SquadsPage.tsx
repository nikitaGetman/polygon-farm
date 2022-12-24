import React from 'react';
import { useMemo } from 'react';
import { useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Container, Flex, Link, Spinner, Text } from '@chakra-ui/react';
import { BigNumber } from 'ethers';

import { useDocumentTitle, useMetaDescription } from '@/hooks/useMeta';
import { useReferralManager } from '@/hooks/useReferralManager';
import { getReadableAmount } from '@/utils/number';

import { ReferralInfo } from '../Referral/ReferralInfo';
import { ReferralRewardsList } from '../Referral/ReferralRewardsList';
import { ReferralsList } from '../Referral/ReferralsList';
import { StatBlock } from '../ui/StatBlock/StatBlock';

import { SquadsList } from './SquadsList';

export const SquadsPage = () => {
  useDocumentTitle('iSaver | Build a team');
  useMetaDescription(
    'Invite your friends and maximize your iSaver Referral Rewards. Earn up to 100% in SAVR from your partners` earnings and additional Rewards when six partners fulfill the specified conditions.'
  );

  const { userReferralInfo, claimDividends } = useReferralManager();

  const availableRewards = useMemo(() => {
    const { totalDividends, totalClaimedDividends } = userReferralInfo.data || {};
    if (totalDividends && totalClaimedDividends) {
      return totalDividends.sub(totalClaimedDividends);
    }
    return BigNumber.from(0);
  }, [userReferralInfo.data]);

  const claimRewards = useCallback(() => {
    if (availableRewards.gt(0) && !claimDividends.isLoading) {
      claimDividends.mutate(availableRewards);
    }
  }, [claimDividends, availableRewards]);

  const isClaimDisabled = useMemo(() => availableRewards.eq(0), [availableRewards]);

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

      <Box mb={{ sm: '55px', xl: '40px' }}>
        <ReferralInfo isPageView />
      </Box>

      <Box mb="100px">
        <ReferralsList />
      </Box>

      <Text textStyle="h3" textTransform="uppercase" mb={{ sm: '20px', lg: '30px' }}>
        Your teams
      </Text>

      <Box mb="100px">
        <SquadsList />
      </Box>

      <Box mb={{ sm: '35px', lg: '50px' }}>
        <Flex justifyContent="flex-end">
          <StatBlock
            width="320px"
            title="Available Referral Rewards"
            value={getReadableAmount(availableRewards)}
            currency="SAVR"
          />

          <Button
            display="block"
            width="170px"
            height="unset"
            padding={{ sm: '20px 10px', md: '30px' }}
            bgColor="blue"
            boxShadow="0px 9px 19px rgba(26, 220, 226, 0.3)"
            borderRadius="sm"
            textStyle="button"
            _hover={{
              boxShadow: '0px 12px 22px rgba(26, 220, 226, 0.5)',
              _disabled: { boxShadow: 'none' },
            }}
            transition="all 0.2s"
            disabled={isClaimDisabled}
            onClick={claimRewards}
          >
            {claimDividends.isLoading ? <Spinner color="white" thickness="4px" /> : 'Claim'}
          </Button>
        </Flex>
      </Box>

      <Box mb="120px">
        <ReferralRewardsList />
      </Box>
    </Container>
  );
};
