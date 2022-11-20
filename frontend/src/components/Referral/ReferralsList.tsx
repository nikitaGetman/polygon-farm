import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text,
  useDisclosure,
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
  const [search, setSearch] = useState<string>('');
  const referrals = useHelperReferralsFullInfoByLevel(address, levels);
  const { userReferralInfo } = useReferralManager();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const searchRef = useRef<HTMLInputElement>(null);

  const handleLevelsSelect = useCallback(
    (value: (number | string)[]) => {
      setLevels(value.map(Number).sort((a, b) => a - b));
    },
    [setLevels]
  );
  const refCount = useMemo(() => userReferralInfo.data?.refCount || [], [userReferralInfo]);

  const levelsTitle = useMemo(() => calculateTitle(levels), [levels]);
  const totalReferrals = useMemo(
    () =>
      refCount.length > 0
        ? levels.reduce((acc, level) => acc + refCount[level - 1].toNumber(), 0)
        : 0,
    [levels, refCount]
  );

  const handleOpenSearch = useCallback(() => {
    onOpen();
    setTimeout(() => searchRef.current?.focus(), 0);
  }, [onOpen]);

  const filteredReferrals = useMemo(
    () =>
      referrals.filter((ref) => ref.referralAddress.toLowerCase().includes(search.toLowerCase())),
    [referrals, search]
  );

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
            <Text as="span" opacity="0.5" ml="8px">
              ({totalReferrals})
            </Text>
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
          {isOpen || search ? (
            <InputGroup variant="primary" size="md" minWidth="320px" mr="10px">
              <Input
                placeholder="0x..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                pr="40px"
                onBlur={onClose}
                ref={searchRef}
              />
              <InputRightElement>
                <IconButton
                  variant="inputTransparentWhite"
                  color="white"
                  aria-label="search"
                  size="md"
                >
                  <SearchIcon />
                </IconButton>
              </InputRightElement>
            </InputGroup>
          ) : (
            <Button variant="link" onClick={handleOpenSearch}>
              Search wallet
              <SearchIcon ml="12px" />
            </Button>
          )}
          <Button variant="link" display="none">
            Export
            <DownloadIcon ml="12px" />
          </Button>
        </Flex>
      </Flex>

      <ReferralsTable referrals={filteredReferrals || []} />
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
