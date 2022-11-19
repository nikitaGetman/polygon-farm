import React, { useCallback, useMemo, useState } from 'react';
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
import { ReferralsTable } from '../Referral/ReferralsTable';
import { useHelperReferralsFullInfoByLevel } from '@/hooks/useHelper';
import { useAccount } from 'wagmi';
import { useReferralManager } from '@/hooks/useReferralManager';
import { DownloadIcon, SearchIcon } from '@chakra-ui/icons';
import { ReactComponent as ChevronDownIcon } from '@/assets/images/icons/chevron-down.svg';

const TOTAL_LEVELS = 10;

export const ReferralsList = () => {
  const { address } = useAccount();
  const [levels, setLevels] = useState<number[]>([1]);
  const referrals = useHelperReferralsFullInfoByLevel(address, levels);
  const { userReferralInfo } = useReferralManager();

  const handleLevelsSelect = useCallback(
    (value: (number | string)[]) => {
      setLevels(value.map(Number).sort((a, b) => a - b));
    },
    [setLevels]
  );

  const levelsTitle = useMemo(() => calculateTitle(levels), [levels]);

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" mb="16px">
        <Menu variant="dark-transparent">
          <MenuButton
            as={Button}
            variant="transparent"
            rightIcon={<ChevronDownIcon />}
            padding={0}
            fontWeight="700"
            textTransform="uppercase"
            fontSize="26px"
          >
            Your level {levelsTitle}
          </MenuButton>
          <MenuList p="20px">
            <CheckboxGroup colorScheme="green" value={levels} onChange={handleLevelsSelect}>
              <Stack
                spacing={5}
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
                        ({userReferralInfo.data?.refCount?.[index]?.toString() || 0})
                      </Text>
                    </Text>
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </MenuList>
        </Menu>

        <Flex alignItems="center">
          <Button variant="link">
            Search wallet
            <SearchIcon ml="12px" />
          </Button>
          <Button variant="link" display="none">
            Export
            <DownloadIcon ml="12px" />
          </Button>
        </Flex>
      </Flex>

      <ReferralsTable referrals={referrals || []} />
    </>
  );
};

function calculateTitle(levels: number[]) {
  return levels.join(', ');
}
