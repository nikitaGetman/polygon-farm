import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { Table } from '../ui/Table/Table';
import { ReactComponent as SavIcon } from '@/assets/images/sav_icon.svg';
import { ReactComponent as SavrIcon } from '@/assets/images/savr_icon.svg';
import { BigNumber } from 'ethers';
import { getLocalDateTimeString, getReadableDuration } from '@/utils/time';
import { bigNumberToString } from '@/utils/number';

const COLLAPSED_LIMIT = 6;

type Stake = {
  amount: BigNumber;
  timeStart: BigNumber;
  timeEnd: BigNumber;
  profitPercent: BigNumber;
  profit: BigNumber;
  isClaimed: boolean;
  isToken2: boolean;
};

enum StakeStatusEnum {
  Claimed = 'claimed',
  Completed = 'completed',
  InProgress = 'in progress',
}
const getStakeStatus = (stake: Stake): StakeStatusEnum => {
  if (stake.isClaimed) return StakeStatusEnum.Claimed;
  const currentTime = Date.now() / 1000;
  if (stake.timeEnd.toNumber() - currentTime < 0) return StakeStatusEnum.Completed;
  return StakeStatusEnum.InProgress;
};

export const StakingTable = ({
  stakes,
  onClaim,
}: {
  stakes: { planId: number; stakeId: number; period: number; reward: BigNumber; stake: Stake }[];
  onClaim: (planId: number, stakeId: number) => Promise<void>;
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const [loadingIndex, setLoadingIndex] = useState<number>();

  const modifiedItems = useMemo(
    () =>
      stakes
        .map((s) => ({ ...s, status: getStakeStatus(s.stake) }))
        .sort((a, b) => b.stake.timeStart.sub(a.stake.timeStart).toNumber()),
    [stakes]
  );

  const visibleItems = useMemo(
    () => (isOpen ? modifiedItems : modifiedItems.slice(0, COLLAPSED_LIMIT)),
    [isOpen, modifiedItems]
  );

  const emptyRows = Math.max(0, COLLAPSED_LIMIT - visibleItems.length);

  const handleClaim = useCallback(
    async (planId: number, stakeId: number, index: number) => {
      setLoadingIndex(index);
      onClaim(planId, stakeId).finally(() => {
        setLoadingIndex(undefined);
      });
    },
    [setLoadingIndex, onClaim]
  );

  return (
    <>
      <Table>
        <Thead>
          <Tr>
            <Th width="200px" pl="50px">
              Deposit
            </Th>
            <Th width="90px" textAlign="center">
              Period
            </Th>
            <Th width="200px" textAlign="center">
              Start Date
            </Th>
            <Th width="200px" textAlign="center">
              End Date
            </Th>
            <Th width="200px" textAlign="center">
              Total
            </Th>
            <Th width="150px" textAlign="center">
              Status
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {visibleItems.map(({ period, status, stake, planId, stakeId }, index) => (
            <Tr key={index}>
              <Td>
                <Flex alignItems="center">
                  <Box mr="4px">
                    {stake.isToken2 ? <SavrIcon height="26px" /> : <SavIcon height="26px" />}
                  </Box>
                  {bigNumberToString(stake.amount)} {stake.isToken2 ? 'SAVR' : 'SAV'}
                </Flex>
              </Td>
              <Td textAlign="center">{getReadableDuration(period)}</Td>
              <Td textAlign="center">{getLocalDateTimeString(stake.timeStart)}</Td>
              <Td textAlign="center">{getLocalDateTimeString(stake.timeEnd)}</Td>
              <Td textAlign="center">
                {bigNumberToString(stake.isToken2 ? stake.profit : stake.profit.add(stake.amount))}{' '}
                SAV
              </Td>
              <Td textAlign="center">
                {status === StakeStatusEnum.Completed ? (
                  <Button
                    size="xs"
                    variant="outlinedWhite"
                    isLoading={loadingIndex === index}
                    onClick={() => handleClaim(planId, stakeId, index)}
                  >
                    Claim
                  </Button>
                ) : (
                  status
                )}
              </Td>
            </Tr>
          ))}
          {Array.from({ length: emptyRows }).map((_, index) => (
            <Tr key={`empty-${index}`}>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {stakes.length > COLLAPSED_LIMIT ? (
        <Center mt="10px">
          <Button variant="link" onClick={onToggle}>
            {isOpen ? 'Less' : 'More'}
          </Button>
        </Center>
      ) : null}
    </>
  );
};
