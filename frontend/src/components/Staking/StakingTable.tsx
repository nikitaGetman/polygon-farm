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
import { BigNumber } from 'ethers';

import { ReactComponent as SavIcon } from '@/assets/images/sav_icon.svg';
import { ReactComponent as SavrIcon } from '@/assets/images/savr_icon.svg';
import { bigNumberToString } from '@/utils/number';
import { calculateStakeReward } from '@/utils/staking';
import { getLocalDateTimeString, getReadableDuration } from '@/utils/time';

import { Table } from '../ui/Table/Table';

const COLLAPSED_LIMIT = 6;

type Stake = {
  amount: BigNumber;
  timeStart: BigNumber;
  timeEnd: BigNumber;
  apr: BigNumber;
  profit: BigNumber;
  reward: BigNumber;
  isClaimed: boolean;
  isToken2: boolean;
  stakingPlanId: number;
  stakeId: number;
  period: number;
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
  stakes: Stake[];
  onClaim: (stakingPlanId: number, stakeId: number) => Promise<void>;
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const [loadingIndex, setLoadingIndex] = useState<number>();

  const modifiedItems = useMemo(
    () =>
      stakes
        .map((s) => ({ ...s, status: getStakeStatus(s) }))
        .sort((a, b) => b.timeStart.sub(a.timeStart).toNumber()),
    [stakes]
  );

  const visibleItems = useMemo(
    () => (isOpen ? modifiedItems : modifiedItems.slice(0, COLLAPSED_LIMIT)),
    [isOpen, modifiedItems]
  );

  const emptyRows = Math.max(0, COLLAPSED_LIMIT - visibleItems.length);

  const handleClaim = useCallback(
    async (stakingPlanId: number, stakeId: number, index: number) => {
      setLoadingIndex(index);
      onClaim(stakingPlanId, stakeId).finally(() => {
        setLoadingIndex(undefined);
      });
    },
    [setLoadingIndex, onClaim]
  );

  return (
    <Box className="table-responsive-wrapper">
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
              Start
            </Th>
            <Th width="200px" textAlign="center">
              End
            </Th>
            <Th width="200px" textAlign="center">
              Reward
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
          {visibleItems.map((stake, index) => (
            <Tr key={index}>
              <Td>
                <Flex alignItems="center">
                  <Box mr="4px">
                    {stake.isToken2 ? <SavrIcon height="26px" /> : <SavIcon height="26px" />}
                  </Box>
                  {bigNumberToString(stake.amount)} {stake.isToken2 ? 'SAVR' : 'SAV'}
                </Flex>
              </Td>
              <Td textAlign="center">{getReadableDuration(stake.period)}</Td>
              <Td textAlign="center">{getLocalDateTimeString(stake.timeStart)}</Td>
              <Td textAlign="center">{getLocalDateTimeString(stake.timeEnd)}</Td>
              <Td textAlign="center">{bigNumberToString(stake.profit)} SAV</Td>
              <Td textAlign="center">{bigNumberToString(calculateStakeReward(stake))} SAV</Td>
              <Td textAlign="center">
                {stake.status === StakeStatusEnum.Completed ? (
                  <Button
                    size="xs"
                    variant="outlinedWhite"
                    isLoading={loadingIndex === index}
                    onClick={() => handleClaim(stake.stakingPlanId, stake.stakeId, index)}
                  >
                    Claim
                  </Button>
                ) : (
                  stake.status
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
    </Box>
  );
};
