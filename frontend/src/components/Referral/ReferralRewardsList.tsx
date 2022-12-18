import React, { useMemo, useState } from 'react';
import { DownloadIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Text } from '@chakra-ui/react';

import { SearchWallet } from '@/components/ui/SearchWallet/SearchWallet';
import { useReferralManager } from '@/hooks/useReferralManager';

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
      <Flex justifyContent="space-between" alignItems="center" mb={{ sm: '4px', xl: '18px' }}>
        <Text
          textStyle="h3"
          id="ref-rewards-list"
          textTransform="uppercase"
          fontWeight={{ sm: '600', xl: '700' }}
          fontSize={{ sm: '18px', xl: '26px' }}
        >
          Your referral rewards
        </Text>

        <Flex alignItems="center">
          {/* <Box mr="10px"> */}
          <SearchWallet buttonText="Search wallet" onChange={setSearch} />
          {/* </Box> */}
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
