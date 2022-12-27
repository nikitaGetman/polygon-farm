import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber, BigNumberish } from 'ethers';
import { useAccount } from 'wagmi';

import { bigNumberToString } from '@/utils/number';
import { getReadableDuration } from '@/utils/time';

import { useStakingContract } from './contracts/useStakingContract';
import { HELPER_USER_SQUADS_INFO_REQUEST } from './useHelper';
import { useNotification } from './useNotification';
import { SAV_BALANCE_REQUEST, SAVR_BALANCE_REQUEST } from './useTokenBalance';
import { TOKENS, useTokens } from './useTokens';

export const STAKING_PLANS_REQUEST = 'staking-plans';
export const USER_STAKING_INFO_REQUEST = 'user-staking-info';
export const USER_STAKES_REQUEST = 'user-stakes';
const STAKING_SUBSCRIBE_MUTATION = 'staking-subscribe';
const STAKING_DEPOSIT_MUTATION = 'staking-deposit';
const STAKING_CLAIM_MUTATION = 'staking-claim';
const STAKING_CLAIM_ALL_MUTATION = 'staking-claim-all';

const STAKING_SUBSCRIPTION_ENDING_NOTIFICATION = 15 * 24 * 60 * 60; // 15 days in seconds
const REFETCH_REWARD_INTERVAL = 30000; // 30 secs

const getWithdrawMessage = (deposit?: BigNumberish, rewards?: BigNumberish) => {
  let message = '';
  if (deposit && BigNumber.from(deposit).gt(0)) {
    message = `${bigNumberToString(deposit)} SAV Deposit and `;
  }
  message += `${bigNumberToString(rewards || 0)} SAV Rewards have been claimed`;
  return message;
};

export const useStaking = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const stakingContract = useStakingContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();

  const stakingPlansRequest = useQuery([STAKING_PLANS_REQUEST], async () => {
    return await stakingContract.getStakingPlans();
  });

  const userPlansInfoRequest = useQuery([USER_STAKING_INFO_REQUEST, { account }], async () => {
    const res = account ? await stakingContract.getUserStakingInfo(account) : null;
    return res;
  });

  const userStakesRequest = useQuery(
    [USER_STAKES_REQUEST, { stakingPlansRequest, account }],
    async () => {
      const res = account
        ? await Promise.all(
            (stakingPlansRequest.data || []).map((_, index) =>
              stakingContract.getUserStakes(account, index)
            )
          )
        : null;

      return res;
    },
    {
      refetchInterval: REFETCH_REWARD_INTERVAL,
    }
  );

  const activeStakingPlans = useMemo(() => {
    return stakingPlansRequest.data
      ? stakingPlansRequest.data
          .map((plan, index) => {
            const { subscribedTill, isSubscribed } = userPlansInfoRequest.data?.[index] || {};

            const currentTime = Date.now() / 1000;
            const isSubscriptionEnding =
              isSubscribed &&
              (subscribedTill?.toNumber() || 0) - currentTime <
                STAKING_SUBSCRIPTION_ENDING_NOTIFICATION;

            const stakes = userStakesRequest.data?.[index];

            const { totalReward, totalDeposit } = stakes
              ? stakes.reduce(
                  (acc, stake) => {
                    if (stake.isClaimed) {
                      return acc;
                    }
                    if (!stake.isToken2) {
                      acc.totalDeposit = acc.totalDeposit.add(stake.amount);
                    }
                    acc.totalReward = acc.totalReward.add(stake.profit);

                    return acc;
                  },
                  {
                    totalReward: BigNumber.from(0),
                    totalDeposit: BigNumber.from(0),
                  }
                )
              : { totalReward: undefined, totalDeposit: undefined };

            const hasReadyStakes = stakes?.some(
              (stake) => stake.timeEnd.toNumber() <= currentTime && !stake.isClaimed
            );

            return {
              ...plan,
              ...userPlansInfoRequest.data?.[index],
              isSubscriptionEnding,
              planId: index,
              totalReward,
              totalDeposit,
              stakes: userStakesRequest.data?.[index],
              hasReadyStakes,
            };
          })
          .filter((plan) => plan.isActive)
      : [];
  }, [stakingPlansRequest.data, userPlansInfoRequest.data, userStakesRequest.data]);

  const hasEndingSubscription = useMemo(
    () => activeStakingPlans.some((plan) => plan.isSubscriptionEnding),
    [activeStakingPlans]
  );

  const tvl = useMemo(() => {
    return stakingPlansRequest.data?.reduce(
      (acc, plan) => acc.add(plan.currentToken1Locked).add(plan.currentToken2Locked),
      BigNumber.from(0)
    );
  }, [stakingPlansRequest.data]);

  const totalClaimed = useMemo(() => {
    return stakingPlansRequest.data?.reduce(
      (acc, plan) => acc.add(plan.totalClaimed),
      BigNumber.from(0)
    );
  }, [stakingPlansRequest.data]);

  const subscribe = useMutation(
    [STAKING_SUBSCRIBE_MUTATION],
    async (planId: number) => {
      const stakingPlan = activeStakingPlans[planId];

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        spender: stakingContract.address,
        requiredAmount: stakingPlan.subscriptionCost,
      });
      const txHash = await stakingContract.subscribe(planId);
      success({
        title: 'Success',
        description: `${getReadableDuration(
          stakingPlan.stakingDuration
        )} Staking subscription has been activated for one year`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  const deposit = useMutation(
    [STAKING_DEPOSIT_MUTATION],
    async ({
      planId,
      amount,
      isToken2,
      referrer,
    }: {
      planId: number;
      amount: BigNumberish;
      isToken2: boolean;
      referrer?: string;
    }) => {
      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: isToken2 ? TOKENS.SAVR : TOKENS.SAV,
        spender: stakingContract.address,
        requiredAmount: amount,
      });

      const stakingPlan = activeStakingPlans[planId];

      const txHash = await stakingContract.deposit({ planId, amount, isToken2, referrer });
      success({
        title: 'Success',
        description: `You have deposited ${bigNumberToString(amount)} ${
          isToken2 ? 'SAVR' : 'SAV'
        } in ${getReadableDuration(stakingPlan.stakingDuration)} Staking pool`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [STAKING_PLANS_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKES_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [HELPER_USER_SQUADS_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAVR_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  const withdraw = useMutation(
    [STAKING_CLAIM_MUTATION],
    async ({ planId, stakeId }: { planId: number; stakeId: number }) => {
      const stake = activeStakingPlans?.[planId]?.stakes?.[stakeId] || null;
      const txHash = await stakingContract.withdraw(planId, stakeId);
      success({
        title: 'Success',
        description: getWithdrawMessage(stake?.isToken2 ? 0 : stake?.amount, stake?.profit),
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [STAKING_PLANS_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKES_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  const withdrawAll = useMutation(
    [STAKING_CLAIM_ALL_MUTATION],
    async (planId: number) => {
      const txHash = await stakingContract.withdrawAll(planId);
      const stakePlan = activeStakingPlans?.[planId] || null;
      success({
        title: 'Success',
        description: getWithdrawMessage(stakePlan?.totalDeposit, stakePlan?.totalReward),
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [STAKING_PLANS_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKES_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return {
    stakingPlansRequest,
    userPlansInfoRequest,
    userStakesRequest,
    activeStakingPlans,
    hasEndingSubscription,
    subscribe,
    deposit,
    withdraw,
    withdrawAll,
    stakingContract,
    tvl,
    totalClaimed,
  };
};
