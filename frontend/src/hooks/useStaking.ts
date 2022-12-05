import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber, BigNumberish } from 'ethers';
import { useAccount } from 'wagmi';

import { bigNumberToString } from '@/utils/number';
import { getReadableDuration } from '@/utils/time';

import { useStakingContract } from './contracts/useStakingContract';
import { useConnectWallet } from './useConnectWallet';
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

export const useStaking = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const stakingContract = useStakingContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();

  const { connect } = useConnectWallet();

  const stakingPlans = useQuery([STAKING_PLANS_REQUEST], async () => {
    return await stakingContract.getStakingPlans();
  });

  const userPlansInfo = useQuery([USER_STAKING_INFO_REQUEST, { account }], async () => {
    const res = account ? await stakingContract.getUserStakingInfo(account) : null;
    return res;
  });

  const userStakes = useQuery(
    [USER_STAKES_REQUEST, { stakingPlans, account }],
    async () => {
      const res = account
        ? await Promise.all(
            (stakingPlans.data || []).map((_, index) =>
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
    return stakingPlans.data
      ? stakingPlans.data
          .map((plan, index) => {
            const { subscribedTill, isSubscribed } = userPlansInfo.data?.[index] || {};

            const currentTime = Date.now() / 1000;
            const isSubscriptionEnding =
              isSubscribed &&
              (subscribedTill?.toNumber() || 0) - currentTime <
                STAKING_SUBSCRIPTION_ENDING_NOTIFICATION;

            const stakes = userStakes.data?.[index];

            const totalReward = stakes
              ? stakes.reduce(
                  (sum, stake) => (stake.isClaimed ? sum : sum.add(stake.profit)),
                  BigNumber.from(0)
                )
              : undefined;

            const hasReadyStakes = stakes?.some(
              (stake) => stake.timeEnd.toNumber() <= currentTime && !stake.isClaimed
            );

            return {
              ...plan,
              ...userPlansInfo.data?.[index],
              isSubscriptionEnding,
              planId: index,
              totalReward,
              stakes: userStakes.data?.[index],
              hasReadyStakes,
            };
          })
          .filter((plan) => plan.isActive)
      : [];
  }, [stakingPlans, userPlansInfo, userStakes]);

  const hasEndingSubscription = useMemo(
    () => activeStakingPlans.some((plan) => plan.isSubscriptionEnding),
    [activeStakingPlans]
  );

  const tvl = useMemo(() => {
    return stakingPlans.data?.reduce(
      (acc, plan) => acc.add(plan.currentToken1Locked).add(plan.currentToken2Locked),
      BigNumber.from(0)
    );
  }, [stakingPlans]);
  const totalClaimed = useMemo(() => {
    return stakingPlans.data?.reduce((acc, plan) => acc.add(plan.totalClaimed), BigNumber.from(0));
  }, [stakingPlans]);

  const subscribe = useMutation(
    [STAKING_SUBSCRIBE_MUTATION],
    async (planId: number) => {
      if (!account) {
        connect();
        return;
      }

      const stakingPlan = activeStakingPlans[planId];

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        owner: account,
        spender: stakingContract.address,
        requiredAmount: stakingPlan.subscriptionCost,
      });
      const txHash = await stakingContract.subscribe(planId);
      success({
        title: 'Success',
        description: `${getReadableDuration(
          stakingPlan.stakingDuration
        )} subscription has been activated for one year`,
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
      if (!account) {
        connect();
        return;
      }

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: isToken2 ? TOKENS.SAVR : TOKENS.SAV,
        owner: account,
        spender: stakingContract.address,
        requiredAmount: amount,
      });

      const stakingPlan = activeStakingPlans[planId];

      const txHash = await stakingContract.deposit({ planId, amount, isToken2, referrer });
      success({
        title: 'Success',
        description: `You have deposited ${bigNumberToString(amount)} ${
          isToken2 ? 'SAVR' : 'SAV'
        } tokens in ${getReadableDuration(stakingPlan.stakingDuration)} staking plan`,
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
      const txHash = await stakingContract.withdraw(planId, stakeId);
      success({ title: 'Success', description: 'Rewards claimed', txHash });
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
      success({ title: 'Success', description: 'All available rewards claimed', txHash });
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
    stakingPlans,
    userPlansInfo,
    userStakes,
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
