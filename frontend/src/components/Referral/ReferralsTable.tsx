import React, { FC, useMemo } from 'react';
import { Button, Center, Flex, Tbody, Td, Th, Thead, Tr, useDisclosure } from '@chakra-ui/react';
import { Table } from '@/components/ui/Table/Table';
import { ReactComponent as SavIcon } from '@/assets/images/sav_icon.svg';
import { ReactComponent as SavrIcon } from '@/assets/images/savr_icon.svg';
import { BigNumber } from 'ethers';
import { getLocalDateString } from '@/utils/time';
import { getReadableAmount } from '@/utils/number';

const COLLAPSED_LIMIT = 6;

type Referral = {
  referralAddress: string;
  level: BigNumber;
  activationDate: BigNumber;
  token1Balance: BigNumber;
  token2Balance: BigNumber;
  isStakingSubscriptionActive: boolean;
  isReferralSubscriptionActive: boolean;
};
type ReferralsTableProps = {
  referrals: Referral[];
};
export const ReferralsTable: FC<ReferralsTableProps> = ({ referrals }) => {
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

  return (
    <>
      <Table>
        <Thead>
          <Tr>
            <Th width="90px">Level</Th>
            <Th textAlign="center">Wallet</Th>
            <Th textAlign="center">Start Date</Th>
            <Th textAlign="center">
              <Flex alignItems="center" justifyContent="center">
                Have SAV <SavIcon width="24px" />
              </Flex>
            </Th>
            <Th textAlign="center">
              <Flex alignItems="center" justifyContent="center">
                Have SAVR <SavrIcon width="24px" />
              </Flex>
            </Th>
            <Th width="90px">Staking</Th>
            <Th width="90px">Referral</Th>
          </Tr>
        </Thead>
        <Tbody>
          {visibleItems.map((referral, index) => (
            <Tr key={index}>
              <Td textAlign="center">{referral.level.toNumber()}</Td>
              <Td textAlign="center">{referral.referralAddress}</Td>
              <Td textAlign="center">{getLocalDateString(referral.activationDate)}</Td>
              <Td textAlign="center">{getReadableAmount(referral.token1Balance)}</Td>
              <Td textAlign="center">{getReadableAmount(referral.token2Balance)}</Td>
              <Td textAlign="center">{referral.isStakingSubscriptionActive ? 'Yes' : 'No'}</Td>
              <Td textAlign="center">{referral.isReferralSubscriptionActive ? 'Yes' : 'No'}</Td>
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
