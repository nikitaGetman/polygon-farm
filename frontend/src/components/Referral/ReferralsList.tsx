import React, { useCallback, useMemo, useState } from 'react';
import { DownloadIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useAccount } from 'wagmi';

import { ReactComponent as ChevronDownIcon } from '@/assets/images/icons/chevron-down.svg';
import { ReferralsTable } from '@/components/Referral/ReferralsTable';
import { SearchWallet } from '@/components/ui/SearchWallet/SearchWallet';
import { useHelperReferralsFullInfoByLevel } from '@/hooks/useHelper';
import { useReferralManager } from '@/hooks/useReferralManager';

const TOTAL_LEVELS = 10;

export const ReferralsList = () => {
  const { address } = useAccount();
  const [levels, setLevels] = useState<number[]>([1]);
  const [search, setSearch] = useState<string>('');
  const referrals = useHelperReferralsFullInfoByLevel(address, levels);
  const { userReferralInfo } = useReferralManager();

  const handleLevelsSelect = useCallback(
    (value: (number | string)[]) => {
      setLevels(value.map(Number).sort((a, b) => a - b));
    },
    [setLevels]
  );
  const toggleAllLevels = useCallback(
    (e: any) => {
      if (e.target.checked) {
        const allLevels = Array.from({ length: TOTAL_LEVELS }).map((_, index) => index + 1);
        setLevels(allLevels);
      } else {
        setLevels([]);
      }
    },
    [setLevels]
  );
  const refCount = useMemo(() => userReferralInfo.data?.refCount || [], [userReferralInfo.data]);

  const levelsTitle = useMemo(() => calculateTitle(levels), [levels]);
  const totalReferrals = useMemo(
    () =>
      refCount.length > 0
        ? levels.reduce((acc, level) => acc + refCount[level - 1].toNumber(), 0)
        : 0,
    [levels, refCount]
  );

  const filteredReferrals = useMemo(
    () =>
      referrals.filter((ref) => ref.referralAddress.toLowerCase().includes(search.toLowerCase())),
    [referrals, search]
  );

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb={{ xl: '18px' }}>
        <Menu variant="dark-transparent">
          <MenuButton
            as={Button}
            variant="transparent"
            rightIcon={<ChevronDownIcon />}
            padding={0}
            textTransform="uppercase"
            fontWeight={{ sm: '600', xl: '700' }}
            fontSize={{ sm: '18px', xl: '26px' }}
          >
            Your levels {levelsTitle}
            <Text as="span" opacity="0.5" ml="8px">
              ({totalReferrals})
            </Text>
          </MenuButton>
          <MenuList p="20px">
            <Checkbox value="all" onChange={toggleAllLevels} spacing={5} mb={5} colorScheme="white">
              <Text textStyle="textSansBold">
                All{' '}
                <Text as="span" opacity="0.5">
                  ({totalReferrals})
                </Text>
              </Text>
            </Checkbox>
            <CheckboxGroup colorScheme="green" value={levels} onChange={handleLevelsSelect}>
              <Stack
                spacing={5}
                ml="-4px"
                pl="4px"
                direction={'column'}
                maxH="280px"
                overflow="auto"
                className="with-custom-scroll"
              >
                {Array.from({ length: TOTAL_LEVELS }).map((_, index) => (
                  <Checkbox key={index} value={index + 1} spacing={5} colorScheme="white">
                    <Text textStyle="textSansBold">
                      {index + 1} Level{' '}
                      <Text as="span" opacity="0.5">
                        ({refCount[index]?.toString() || 0})
                      </Text>
                    </Text>
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </MenuList>
        </Menu>

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

      <ReferralsTable
        referrals={filteredReferrals}
        userLevels={userReferralInfo.data?.activeLevels || []}
      />
    </>
  );
};

function calculateTitle(levels: number[]) {
  const calculatedTitle = [...levels, null].reduce(
    (acc, level) => {
      if (!acc.start) {
        acc.start = level;
      } else if (acc.start + acc.groupLength !== level) {
        if (acc.groupLength === 1) {
          acc.parts.push(acc.start);
        }
        if (acc.groupLength === 2) {
          acc.parts.push(acc.start, acc.start + acc.groupLength - 1);
        }
        if (acc.groupLength > 2) {
          acc.parts.push(`${acc.start}-${acc.start + acc.groupLength - 1}`);
        }
        acc.start = level;
        acc.groupLength = 0;
      }

      acc.groupLength += 1;
      return acc;
    },
    {
      parts: [],
      groupLength: 0,
      start: undefined,
    } as any
  );

  return calculatedTitle.parts.join(', ');
}
