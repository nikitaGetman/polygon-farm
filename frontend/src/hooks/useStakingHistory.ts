import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';

import { bigNumberToNumber } from '@/utils/number';

import { useStakingContract } from './contracts/useStakingContract';
import { useStakingPlans } from './useStaking';

type StakeLockChange = {
  timestamp: number;
  change: BigNumber;
};
type StakeLockBalance = {
  timestamp: number;
  balance: BigNumber;
};

export const useStakingHistory = () => {
  const { getAllStakes } = useStakingContract();
  const { stakingPlansRequest } = useStakingPlans();

  const stakesDataRequest = useQuery(['stakes-history-request'], () => getAllStakes(), {
    select: (data) =>
      data.map(({ args }) => {
        const stakingPlan = stakingPlansRequest.data?.find(
          (plan) => plan.stakingPlanId === args.stakingPlanId.toNumber()
        );
        const timestamp = args.timestamp.toNumber();
        const tillTimestamp = timestamp + (stakingPlan?.stakingDuration.toNumber() || 0) * 86_400;

        return {
          ...args,
          stakingPlanId: args.stakingPlanId.toNumber(),
          timestamp,
          tillTimestamp,
        };
      }),
  });

  const stakingUnlocksData = useMemo(() => {
    const balanceChange = stakesDataRequest.data?.reduce(
      (acc, stake) => {
        acc.push({
          timestamp: stake.timestamp,
          change: stake.isToken2 ? stake.profit : stake.amount.add(stake.profit),
        });
        acc.push({
          timestamp: stake.tillTimestamp,
          change: stake.isToken2 ? stake.profit.mul(-1) : stake.amount.add(stake.profit).mul(-1),
        });
        return acc;
      },
      [
        { timestamp: Math.floor(Date.now() / 1000) + 30, change: BigNumber.from(0) },
      ] as StakeLockChange[]
    );

    return balanceChange
      ?.sort((a, b) => a.timestamp - b.timestamp)
      .reduce((acc, tx) => {
        if (!acc.length) {
          acc.push({ timestamp: tx.timestamp, balance: tx.change });
        } else {
          const prevBalance = acc.slice(-1)[0].balance;
          acc.push({
            timestamp: tx.timestamp,
            balance: prevBalance.add(tx.change),
          });
        }

        return acc;
      }, [] as StakeLockBalance[])
      .filter((data) => data.timestamp >= Date.now() / 1000)
      .map((data) => ({ ...data, balance: bigNumberToNumber(data.balance) }));
  }, [stakesDataRequest.data]);

  return stakingUnlocksData;
};
