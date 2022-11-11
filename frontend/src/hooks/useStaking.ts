import { tryToGetError } from '@/utils/error';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumberish } from 'ethers';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useStakingContract } from './contracts/useStakingContract';
import { useNotification } from './useNotification';
import { SAVR_BALANCE_REQUEST, SAV_BALANCE_REQUEST } from './useTokenBalance';
import { TOKENS, useTokens } from './useTokens';

export const STAKING_PLANS_REQUEST = 'staking-plans';
export const USER_STAKING_INFO_REQUEST = 'user-staking-info';
const STAKING_SUBSCRIBE_MUTATION = 'staking-subscribe';
const STAKING_DEPOSIT_MUTATION = 'staking-deposit';
const STAKING_CLAIM_MUTATION = 'staking-claim';

const SUBSCRIPTION_ENDING_NOTIFICATION = 15 * 24 * 60 * 60; // 15 days in seconds

export const useStaking = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const stakingContract = useStakingContract();
  const { success, error } = useNotification();
  const tokens = useTokens();

  const stakingPlans = useQuery([STAKING_PLANS_REQUEST], async () => {
    return await stakingContract.getStakingPlans();
  });

  const userPlansInfo = useQuery([USER_STAKING_INFO_REQUEST, { account }], async () => {
    const res = account ? await stakingContract.getUserStakingInfo(account) : null;
    console.log(res);
    return res;
  });

  const activeStakingPlans = useMemo(() => {
    return stakingPlans.data
      ? stakingPlans.data
          .map((plan, index) => {
            const { subscribedTill, isSubscribed } = userPlansInfo.data?.[index] || {};

            const currentTime = Date.now() / 1000;
            const isSubscriptionEnding =
              isSubscribed &&
              (subscribedTill?.toNumber() || 0) - currentTime < SUBSCRIPTION_ENDING_NOTIFICATION;

            return { ...plan, ...userPlansInfo.data?.[index], isSubscriptionEnding };
          })
          .filter((plan) => plan.isActive)
      : [];
  }, [stakingPlans, userPlansInfo]);

  const hasEndingSubscription = useMemo(
    () => activeStakingPlans.find((plan) => plan.isSubscriptionEnding),
    [activeStakingPlans]
  );

  const subscribe = useMutation(
    [STAKING_SUBSCRIBE_MUTATION],
    async (planId: number) => {
      if (!account) return;

      const stakingPlan = activeStakingPlans[planId];

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        owner: account,
        spender: stakingContract.address,
        requiredAmount: stakingPlan.subscriptionCost,
      });
      await stakingContract.subscribe(planId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
        success('Subscribed!');
      },
      onError: (err) => {
        const errMessage = tryToGetError(err);
        error(errMessage);
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
      if (!account) return;

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: isToken2 ? TOKENS.SAVR : TOKENS.SAV,
        owner: account,
        spender: stakingContract.address,
        requiredAmount: amount,
      });

      await stakingContract.deposit({ planId, amount, isToken2, referrer });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [STAKING_PLANS_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [USER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAVR_BALANCE_REQUEST] });
        success('Deposit sent!');
      },
      onError: (err) => {
        const errMessage = tryToGetError(err);
        error(errMessage);
      },
    }
  );

  return {
    stakingPlans,
    userPlansInfo,
    activeStakingPlans,
    hasEndingSubscription,
    subscribe,
    deposit,
    stakingContract,
  };
};
