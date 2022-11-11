import React, { useCallback, useMemo } from 'react';
import { Button, Center, Flex, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import { Table } from '../ui/Table/Table';
import { ReactComponent as SavIcon } from '@/assets/images/sav_icon.svg';
import { ReactComponent as SavrIcon } from '@/assets/images/savr_icon.svg';
import { BigNumber } from 'ethers';
import { getLocalDateString, getReadableDuration } from '@/utils/time';
import { bigNumberToString, getReadableAmount } from '@/utils/number';

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
  Ready = 'ready',
  InProgress = 'in progress',
}
const getStakeStatus = (stake: Stake): StakeStatusEnum => {
  if (stake.isClaimed) return StakeStatusEnum.Claimed;
  const currentTime = Date.now() / 1000;
  if (stake.timeEnd.toNumber() - currentTime < 0) return StakeStatusEnum.Ready;
  return StakeStatusEnum.InProgress;
};

export const StakingTable = ({
  stakes,
  onClaim,
}: {
  stakes: { planId: number; stakeId: number; period: number; reward: BigNumber; stake: Stake }[];
  onClaim: (planId: number, stakeId: number) => void;
}) => {
  const { isOpen, onToggle } = useDisclosure();

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

  const hasData = stakes.length > 0;

  return (
    <>
      {!hasData ? (
        <Center textStyle="text1">No data</Center>
      ) : (
        <>
          <Table>
            <Thead>
              <Tr>
                <Th>Token</Th>
                <Th isNumeric>Deposit</Th>
                <Th>Start Date</Th>
                <Th>End Date</Th>
                <Th>Period</Th>
                <Th isNumeric>Interest</Th>
                <Th>Status</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {visibleItems.map(({ period, status, stake, planId, stakeId }, index) => (
                <Tr key={index}>
                  <Td>
                    <Flex alignItems="center">
                      {stake.isToken2 ? (
                        <>
                          <SavrIcon />
                          SAVR
                        </>
                      ) : (
                        <>
                          <SavIcon />
                          SAV
                        </>
                      )}
                    </Flex>
                  </Td>
                  <Td isNumeric>{getReadableAmount(stake.amount)}</Td>
                  <Td>{getLocalDateString(stake.timeStart)}</Td>
                  <Td>{getLocalDateString(stake.timeEnd)}</Td>
                  <Td>{getReadableDuration(period)}</Td>
                  <Td>
                    {bigNumberToString(
                      stake.isToken2 ? stake.profit : stake.profit.add(stake.amount)
                    )}
                  </Td>
                  <Td>{status}</Td>
                  <Td>
                    {status === StakeStatusEnum.Ready && (
                      <Button
                        size="sm"
                        variant="outlined-white"
                        onClick={() => onClaim(planId, stakeId)}
                      >
                        Claim
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {stakes.length > COLLAPSED_LIMIT && (
            <Center mt="10px">
              <Button variant="link" onClick={onToggle}>
                {isOpen ? 'Less' : 'More'}
              </Button>
            </Center>
          )}
        </>
      )}
    </>
  );
};
