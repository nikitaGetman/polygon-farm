import { bigNumberToString } from '@/utils/number';
import { getReadableDuration } from '@/utils/time';
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useAccount, useQuery, useQueryClient } from 'wagmi';
import { useSquadsContract } from './contracts/useSquadsContract';
import { useConnectWallet } from './useConnectWallet';
import { useHelperUserSquadsFullInfo } from './useHelper';
import { useNotification } from './useNotification';
import { useStaking } from './useStaking';
import { SAV_BALANCE_REQUEST } from './useTokenBalance';
import { TOKENS, useTokens } from './useTokens';

export const SQUAD_PLANS_REQUEST = 'squad-plans-info';
const SUBSCRIBE_TO_SQUADS_PLAN_MUTATION = 'subscribe-to-squads';

export const SQUADS_SUBSCRIPTION_ENDING_NOTIFICATION = 15 * 24 * 60 * 60; // 15 days in seconds

export const useSquads = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const squadsContract = useSquadsContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();
  const { connect } = useConnectWallet();
  const { stakingPlans } = useStaking();
  const { userSquadsInfoRequest, userSquadsInfo } = useHelperUserSquadsFullInfo(account);

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
      if (!account) {
        connect();
        return;
      }

      const squadPlan = squadPlansRequest?.data?.[planId];
      if (!squadPlan) {
        return;
      }
      const stakingPlan = stakingPlans?.data?.[squadPlan.stakingPlanId.toNumber()];
      if (!stakingPlan) {
        return;
      }

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        owner: account,
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
        )} team subscription has been activated for one year`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        userSquadsInfoRequest.refetch();
        // TODO: invalidateQueries does not work in this case
        // queryClient.invalidateQueries({ queryKey: [HELPER_USER_SQUADS_INFO_REQUEST] });
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
