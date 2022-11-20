import React from 'react';
import { Box, Container, Flex, Link, Spinner } from '@chakra-ui/react';
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

export const SquadsPage = () => {
  const { userReferralInfo, claimDividends } = useReferralManager();

  const availableRewards = useMemo(() => {
    const { totalDividends, totalClaimedDividends } = userReferralInfo.data || {};
    if (totalDividends && totalClaimedDividends) {
      return totalDividends.sub(totalClaimedDividends);
    }
    return BigNumber.from(0);
  }, [userReferralInfo]);

  const claimRewards = useCallback(() => {
    if (availableRewards.gt(0)) {
      claimDividends.mutate(availableRewards);
    }
  }, [claimDividends, availableRewards]);

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

      {/* <Box mb="100px">SquadsList</Box> */}

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
          <Box
            as="button"
            display="block"
            width="170px"
            padding="30px"
            bgColor="blue"
            boxShadow="0px 9px 19px rgba(26, 220, 226, 0.3)"
            borderRadius="sm"
            textStyle="button"
            _hover={{ boxShadow: '0px 12px 22px rgba(26, 220, 226, 0.5)' }}
            transition="all 0.2s"
            onClick={claimRewards}
          >
            {claimDividends.isLoading ? <Spinner color="white" thickness="4px" /> : 'Claim'}
          </Box>
        </Flex>
      </Box>

      <Box mb="120px">{/* Referral rewards list */}</Box>
    </Container>
  );
};
