import React, { FC, useMemo } from 'react';
import { Button, Center, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import { Table } from '@/components/ui/Table/Table';
import { BigNumber } from 'ethers';
import { getLocalDateString, getReadableDuration } from '@/utils/time';
import { bigNumberToString } from '@/utils/number';

const COLLAPSED_LIMIT = 6;

type Reward = {
  referrer: string;
  referral: string;
  level: BigNumber;
  depositAmount: BigNumber;
  rewardAmount: BigNumber;
  stakingDuration: BigNumber;
  timestamp: BigNumber;
  reason: BigNumber;
};
type RewardsTableProps = {
  rewards: Reward[];
};
export const ReferralRewardsTable: FC<RewardsTableProps> = ({ rewards }) => {
  const { isOpen, onToggle } = useDisclosure();

  const modifiedItems = useMemo(
    () => rewards.sort((a, b) => b.timestamp.sub(a.timestamp).toNumber()),
    [rewards]
  );

  const visibleItems = useMemo(
    () => (isOpen ? modifiedItems : modifiedItems.slice(0, COLLAPSED_LIMIT)),
    [isOpen, modifiedItems]
  );

  const emptyRows = Math.max(0, COLLAPSED_LIMIT - visibleItems.length);

  return (
    <>
      <Table>
        <Thead>
          <Tr>
            <Th textAlign="center" width="360px">
              Wallet
            </Th>
            <Th textAlign="center" width="100px">
              Date
            </Th>
            <Th textAlign="center" width="150px">
              Deposit
            </Th>
            <Th textAlign="center" width="90px">
              Period
            </Th>
            <Th textAlign="center" width="90px">
              Level
            </Th>
            <Th textAlign="center" width="200px">
              Reward
            </Th>
            <Th textAlign="center" width="100px">
              Comment
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {visibleItems.map((reward, index) => (
            <Tr key={index}>
              <Td textAlign="center">{reward.referral}</Td>
              <Td textAlign="center">{getLocalDateString(reward.timestamp)}</Td>
              <Td textAlign="center">{bigNumberToString(reward.depositAmount)} SAV</Td>
              <Td textAlign="center">{getReadableDuration(reward.stakingDuration)}</Td>
              <Td textAlign="center">{reward.level.toNumber()}</Td>
              <Td textAlign="center">{bigNumberToString(reward.rewardAmount)} SAVR</Td>
              <Td textAlign="center">{getRewardReason(reward.reason)}</Td>
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

      {rewards.length > COLLAPSED_LIMIT ? (
        <Center mt="10px">
          <Button variant="link" onClick={onToggle}>
            {isOpen ? 'Less' : 'More'}
          </Button>
        </Center>
      ) : null}
    </>
  );
};

const REASONS_MAP: Record<string, string> = {
  '0': 'complete',
  '1': 'no level',
  '2': 'no stake',
  '3': 'limited',
};
const getRewardReason = (_reason: BigNumber) => {
  const reason = _reason.toString();

  return REASONS_MAP[reason] || '---';
};
