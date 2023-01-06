import { FC } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { BigNumber, BigNumberish } from 'ethers';

import { useAccounts } from '@/hooks/admin/useAccounts';
import { useStaking } from '@/hooks/useStaking';
import { useSavBalance, useSavRBalance, useUsdtBalance } from '@/hooks/useTokenBalance';
import { beautifyAmount, bigNumberToString } from '@/utils/number';

import { AdminSection } from '../common/AdminSection';

export const Balances = () => {
  const { stakingPool, referralRewardPool, vendorPool, vendorChangePool, vestingPool } =
    useAccounts();

  const stakingBalance = useSavBalance(stakingPool);
  const referralBalance = useSavRBalance(referralRewardPool);
  const vendorBalance = useSavBalance(vendorPool);
  const vendorChangeBalance = useUsdtBalance(vendorChangePool);
  const vestingBalance = useSavBalance(vestingPool);
  const { tvlSav, tvlSavr } = useStaking();

  const isLoading =
    stakingBalance.isLoading ||
    referralBalance.isLoading ||
    vendorBalance.isLoading ||
    vendorChangeBalance.isLoading ||
    vestingBalance.isLoading;

  return (
    <AdminSection title="Balances" isLoading={isLoading}>
      <Balance label="Staking pool" balance={stakingBalance.data} symbol="SAV" />
      <Balance label="Staking TVL (SAV)" balance={tvlSav} symbol="SAV" minLimit={0} />
      <Balance label="Staking TVL (SAVR)" balance={tvlSavr} symbol="SAVR" minLimit={0} />
      <Balance label="Referral rewards pool" balance={referralBalance.data} symbol="SAVR" />
      <Balance label="Exchange pool (SAV)" balance={vendorBalance.data} symbol="SAV" />
      <Balance
        label="Exchange pool (USDT)"
        balance={vendorChangeBalance.data}
        decimals={6}
        symbol="USDT"
      />
      <Balance label="Vesting pool" balance={vestingBalance.data} symbol="SAV" />
    </AdminSection>
  );
};

type BalanceProps = {
  label: string;
  balance?: BigNumber | null;
  symbol?: string;
  minLimit?: BigNumberish;
  decimals?: number;
};
const Balance: FC<BalanceProps> = ({ label, balance, symbol, decimals, minLimit = 10_000 }) => {
  const color = symbol === 'SAVR' ? 'savr' : 'sav';

  const isLowBalance = BigNumber.from(minLimit).gt(
    bigNumberToString(balance || 0, { precision: 0, decimals })
  );

  return (
    <Flex textStyle="text1" my="10px">
      <Text mr="12px" flex="200px 0 0" bgColor={isLowBalance ? 'red' : undefined}>
        {label}
      </Text>
      <Text color={color}>
        {balance
          ? beautifyAmount(
              bigNumberToString(balance || 0, { precision: 0, decimals }),
              symbol || '',
              true
            )
          : '---'}
      </Text>
    </Flex>
  );
};
