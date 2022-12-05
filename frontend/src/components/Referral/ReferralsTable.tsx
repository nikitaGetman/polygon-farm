import React, { FC, useMemo } from 'react';
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

import { Table } from '@/components/ui/Table/Table';
import { getReadableAmount } from '@/utils/number';
import { getLocalDateTimeString } from '@/utils/time';

const COLLAPSED_LIMIT = 6;

type Referral = {
  referralAddress: string;
  level: BigNumber;
  activationDate: BigNumber;
  token1Balance: BigNumber;
  token2Balance: BigNumber;
  isStakingSubscriptionActive: boolean;
  isReferralSubscriptionActive: boolean;
  isSquadSubscriptionActive: boolean;
};
type ReferralsTableProps = {
  referrals: Referral[];
  userLevels: BigNumber[];
};
export const ReferralsTable: FC<ReferralsTableProps> = ({ referrals, userLevels }) => {
  const { isOpen, onToggle } = useDisclosure();

  const modifiedItems = useMemo(
    () => referrals.sort((a, b) => b.activationDate.sub(a.activationDate).toNumber()),
    [referrals]
  );

  const visibleItems = useMemo(
    () => (isOpen ? modifiedItems : modifiedItems.slice(0, COLLAPSED_LIMIT)),
    [isOpen, modifiedItems]
  );

  const emptyRows = Math.max(0, COLLAPSED_LIMIT - visibleItems.length);

  const hasSubscription = (level: number) =>
    userLevels.length > level && userLevels[level].toNumber() > Date.now() / 1000;

  const RedCircle = (
    <Box display="inline-block" width="16px" height="16px" borderRadius="50%" bgColor="error" />
  );
  const GreenCircle = (
    <Box display="inline-block" width="16px" height="16px" borderRadius="50%" bgColor="green.400" />
  );

  return (
    <>
      <Table>
        <Thead>
          <Tr>
            <Th width="90px">Level</Th>
            <Th textAlign="center" width="360px">
              Wallet
            </Th>
            <Th textAlign="center">Start</Th>
            <Th textAlign="center" width="200px">
              <Flex alignItems="center" justifyContent="center">
                SAV
              </Flex>
            </Th>
            <Th textAlign="center" width="200px">
              <Flex alignItems="center" justifyContent="center">
                SAVR
              </Flex>
            </Th>
            <Th width="90px">Staking</Th>
            <Th width="90px">Referral</Th>
            <Th width="90px">Team</Th>
            <Th width="90px">Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {visibleItems.map((referral, index) => (
            <Tr key={index}>
              <Td textAlign="center">{referral.level.toNumber()}</Td>
              <Td textAlign="center">{referral.referralAddress}</Td>
              <Td textAlign="center">{getLocalDateTimeString(referral.activationDate)}</Td>
              <Td textAlign="center">{getReadableAmount(referral.token1Balance)}</Td>
              <Td textAlign="center">{getReadableAmount(referral.token2Balance)}</Td>
              <Td textAlign="center">
                {referral.isStakingSubscriptionActive ? GreenCircle : RedCircle}
              </Td>
              <Td textAlign="center">
                {referral.isReferralSubscriptionActive ? GreenCircle : RedCircle}
              </Td>
              <Td textAlign="center">
                {referral.isSquadSubscriptionActive ? GreenCircle : RedCircle}
              </Td>
              <Td textAlign="center">
                {hasSubscription(referral.level.toNumber() - 1) ? GreenCircle : RedCircle}
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
              <Td></Td>
              <Td></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {referrals.length > COLLAPSED_LIMIT ? (
        <Center mt="10px">
          <Button variant="link" onClick={onToggle}>
            {isOpen ? 'Less' : 'More'}
          </Button>
        </Center>
      ) : null}
    </>
  );
};
