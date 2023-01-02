import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { bigNumberToString } from '@/utils/number';
import { getReadableDuration } from '@/utils/time';

import { useSquadsContract } from './contracts/useSquadsContract';
import { TOKENS } from './contracts/useTokenContract';
import { HELPER_USER_SQUADS_INFO_REQUEST, useHelperUserSquadsFullInfo } from './useHelper';
import { useNotification } from './useNotification';
import { useStaking } from './useStaking';
import { SAV_BALANCE_REQUEST } from './useTokenBalance';
import { useTokens } from './useTokens';

export const SQUAD_PLANS_REQUEST = 'squad-plans-info';
const SUBSCRIBE_TO_SQUADS_PLAN_MUTATION = 'subscribe-to-squads';

export const SQUADS_SUBSCRIPTION_ENDING_NOTIFICATION = 15 * 24 * 60 * 60; // 15 days in seconds

export const useSquads = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const squadsContract = useSquadsContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();
  const { stakingPlansRequest } = useStaking();
  const { userSquadsInfo } = useHelperUserSquadsFullInfo(account);

  const subscriptionPeriodDays = 365;

  const squadPlansRequest = useQuery([SQUAD_PLANS_REQUEST], async () => {
    return await squadsContract.getPlans();
  });

  const hasEndingSquadsSubscription = useMemo(
    () => (userSquadsInfo || []).some(({ isSubscriptionEnding }) => isSubscriptionEnding),
    [userSquadsInfo]
  );

  const subscribe = useMutation(
    [SUBSCRIBE_TO_SQUADS_PLAN_MUTATION],
    async (planId: number) => {
      const squadPlan = squadPlansRequest?.data?.[planId];
      if (!squadPlan) {
        return;
      }
      const stakingPlan = stakingPlansRequest?.data?.[squadPlan.stakingPlanId.toNumber()];
      if (!stakingPlan) {
        return;
      }

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        spender: squadsContract.address,
        requiredAmount: squadPlan.subscriptionCost,
      });

      const txHash = await squadsContract.subscribe(planId);
      success({
        title: 'Success',
        description: `${bigNumberToString(squadPlan.stakingThreshold, {
          precision: 0,
        })}/${getReadableDuration(
          stakingPlan.stakingDuration
        )} Team subscription has been activated for one year`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [HELPER_USER_SQUADS_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return {
    squadsContract,
    subscribe,
    subscriptionPeriodDays,
    hasEndingSquadsSubscription,
  };
};
