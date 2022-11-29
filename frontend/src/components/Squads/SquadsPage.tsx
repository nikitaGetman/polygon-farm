import React, { useEffect } from 'react';
import { Box, Button, Container, Flex, Heading, Link, Spinner } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { ReferralInfo } from '../Referral/ReferralInfo';
import { ReferralsList } from '../Referral/ReferralsList';
import { StatBlock } from '../ui/StatBlock/StatBlock';
import { BigNumber } from 'ethers';
import { useReferralManager } from '@/hooks/useReferralManager';
import { useMemo } from 'react';
import { getReadableAmount } from '@/utils/number';
import { useCallback } from 'react';
import { SquadsList } from './SquadsList';
import { ReferralRewardsList } from '../Referral/ReferralRewardsList';

export const SquadsPage = () => {
  const { userReferralInfo, claimDividends } = useReferralManager();

  useEffect(() => {
    document.title = 'iSaver | Build a team';
  }, []);

  const availableRewards = useMemo(() => {
    const { totalDividends, totalClaimedDividends } = userReferralInfo.data || {};
    if (totalDividends && totalClaimedDividends) {
      return totalDividends.sub(totalClaimedDividends);
    }
    return BigNumber.from(0);
  }, [userReferralInfo]);

  const claimRewards = useCallback(() => {
    if (availableRewards.gt(0) && !claimDividends.isLoading) {
      claimDividends.mutate(availableRewards);
    }
  }, [claimDividends, availableRewards]);

  const isClaimDisabled = useMemo(() => availableRewards.toNumber() === 0, [availableRewards]);

  return (
    <Container variant="dashboard" pt="60px">
      <Link as={RouterLink} to="/" textStyle="button" alignSelf="flex-start" mb="40px">
        <ArrowBackIcon w="24px" h="24px" mr="10px" />
        Back
      </Link>

      <Box mb="35px">
        <ReferralInfo isPageView />
      </Box>

      <Box mb="100px">
        <ReferralsList />
      </Box>

      <Heading textStyle="h3" fontSize="26px" textTransform="uppercase" mb="30px">
        Your teams
      </Heading>

      <Box mb="100px">
        <SquadsList />
      </Box>

      <Box mb="50px">
        <Flex justifyContent="flex-end">
          <StatBlock width="320px">
            <Box textStyle="text1" mb="10px">
              Available Referral Rewards
            </Box>
            <Box textStyle="text1">
              <Box as="span" textStyle="textSansBold" fontSize="26px" mr="6px">
                {getReadableAmount(availableRewards)}
              </Box>
              SAVR
            </Box>
          </StatBlock>
          <Button
            display="block"
            width="170px"
            height="unset"
            padding="30px"
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
