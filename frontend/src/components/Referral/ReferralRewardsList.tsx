import React, { useMemo, useState } from 'react';
import { DownloadIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import { useReferralManager } from '@/hooks/useReferralManager';

import { TableSearch } from '../ui/Table/TableSearch';

import { ReferralRewardsTable } from './ReferralRewardsTable';

export const ReferralRewardsList = () => {
  const [search, setSearch] = useState<string>('');

  const { referralRewards } = useReferralManager();

  const filteredRewards = useMemo(
    () =>
      (referralRewards || []).filter((reward) =>
        reward.referral?.toLowerCase().includes(search.toLowerCase())
      ),
    [referralRewards, search]
  );

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={5}>
        <Text textStyle="h3" textTransform="uppercase" id="ref-rewards-list">
          Your referral rewards
        </Text>

        <Flex alignItems="center">
          <Box mr="10px">
            <TableSearch buttonText="Search wallet" onChange={setSearch} />
          </Box>
          <Button variant="link" display="none">
            Export
            <DownloadIcon ml="12px" />
          </Button>
        </Flex>
      </Flex>

      <ReferralRewardsTable rewards={filteredRewards} />
    </>
  );
};
