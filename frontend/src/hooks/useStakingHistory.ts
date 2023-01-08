import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BigNumber } from 'ethers';

import { bigNumberToNumber } from '@/utils/number';

import { useStakingContract } from './contracts/useStakingContract';
import { useStakingPlans } from './useStaking';

type StakeLockChange = {
  day: number;
  change: BigNumber;
};
type StakeLockBalance = {
  day: number;
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
          day: Math.floor(stake.timestamp / 86400),
          change: stake.isToken2 ? stake.profit : stake.amount.add(stake.profit),
        });
        acc.push({
          day: Math.floor(stake.tillTimestamp / 86400),
          change: stake.isToken2 ? stake.profit.mul(-1) : stake.amount.add(stake.profit).mul(-1),
        });
        return acc;
      },
      [
        { day: Math.floor(Date.now() / 1000 / 86400) + 30, change: BigNumber.from(0) },
      ] as StakeLockChange[]
    );

    return balanceChange
      ?.sort((a, b) => a.day - b.day)
      .reduce((acc, tx) => {
        if (!acc.length) {
          acc.push({ day: tx.day, balance: tx.change });
        } else {
          const prev = acc.slice(-1)[0];
          if (prev.day === tx.day) {
            acc[acc.length - 1].balance = prev.balance.add(tx.change);
          } else {
            acc.push({
              day: tx.day,
              balance: prev.balance.add(tx.change),
            });
          }
        }

        return acc;
      }, [] as StakeLockBalance[])
      .filter((data) => data.day >= Date.now() / 1000 / 86400)
      .map((data) => ({ ...data, balance: bigNumberToNumber(data.balance) }));
  }, [stakesDataRequest.data]);

  return stakingUnlocksData;
};
