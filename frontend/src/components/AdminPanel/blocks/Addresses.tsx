import { Flex, Link, Text } from '@chakra-ui/react';

import { useAccounts } from '@/hooks/admin/useAccounts';
import { useContractsAddresses } from '@/hooks/admin/useContractsAddresses';
import { useExplorerLink } from '@/hooks/useExplorerLink';

import { AdminSection } from '../common/AdminSection';

export const Addresses = () => {
  const accounts = useAccounts();
  const contracts = useContractsAddresses();

  return (
    <AdminSection title="Addresses">
      <Flex direction="column">
        <Text textStyle="textMedium" mb="8px" fontSize="18px">
          Contracts
        </Text>
        <AddressInfo title="SAV (ERC20)" address={contracts.Token1} />
        <AddressInfo title="SAVR (ERC20)" address={contracts.Token2} />
        <AddressInfo title="Staking" address={contracts.Staking} />
        <AddressInfo title="Referral Manager" address={contracts.ReferralManager} />
        <AddressInfo title="Teams" address={contracts.Squads} />
        <AddressInfo title="Raffles" address={contracts.Lottery} />
        <AddressInfo title="Raffle Ticket (ERC1155)" address={contracts.Ticket} />
        <AddressInfo title="Token exchange" address={contracts.VendorSell} />
        <AddressInfo title="Vesting" address={contracts.TokenVesting} />

        <Text textStyle="textMedium" mt="20px" mb="8px" fontSize="18px">
          Accounts (Pools)
        </Text>
        <AddressInfo title="Staking Pool" address={accounts.stakingPool} />
        <AddressInfo title="Referral Reward Pool" address={accounts.referralRewardPool} />
        <AddressInfo title="Exchange (SAV) Pool" address={accounts.vendorPool} />
        <AddressInfo title="Exchange (USDT) Pool" address={accounts.vendorChangePool} />
        <AddressInfo title="Vesting Pool" address={accounts.vestingPool} />
      </Flex>
    </AdminSection>
  );
};

const AddressInfo = ({ title, address }: { title: string; address: string }) => {
  const explorerLink = useExplorerLink(address, true);

  return (
    <Flex alignItems="baseline" fontSize="14px">
      <Text flex="0 0 190px">{title}</Text>
      <Text flex="0 0 390px">{address}</Text>
      <Link href={explorerLink} target="_blank" color="green.400" display="block">
        Polygonscan
      </Link>
    </Flex>
  );
};
