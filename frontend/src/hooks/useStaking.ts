import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useSavContract } from './contracts/useSavContract';
import { useStakingContract } from './contracts/useStakingContract';
import { useNotification } from './useNotification';
import { SAV_BALANCE_REQUEST } from './useTokenBalance';

export const STAKING_PLANS_REQUEST = 'staking-plans';
export const USER_STAKING_INFO_REQUEST = 'user-staking-info';
const STAKING_SUBSCRIBE_MUTATION = 'staking-subscribe';

export const useStaking = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const stakingContract = useStakingContract();
  const savContract = useSavContract();
  const { success, error } = useNotification();

  const stakingPlans = useQuery([STAKING_PLANS_REQUEST], async () => {
    return await stakingContract.getStakingPlans();
  });

  const userPlansInfo = useQuery([USER_STAKING_INFO_REQUEST, { account }], async () => {
    return account ? stakingContract.getUserStakingInfo(account) : null;
  });

  const activeStakingPlans = useMemo(() => {
    return stakingPlans.data
      ? stakingPlans.data
          .map((plan, index) => ({ ...plan, ...userPlansInfo.data?.[index] }))
          .filter((plan) => plan.isActive)
      : [];
  }, [stakingPlans, userPlansInfo]);

  const subscribe = useMutation(
    [STAKING_SUBSCRIBE_MUTATION],
    async (planId: number) => {
      if (!account) return;

      const stakingPlan = activeStakingPlans[planId];
      const allowance = await savContract.allowance(account, stakingContract.address);

      if (allowance.lt(stakingPlan.subscriptionCost)) {
        await savContract.approve(stakingContract.address, ethers.constants.MaxUint256);
        success('Approved!');
      }
      await stakingContract.subscribe(planId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_STAKING_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
        success('Subscribed!');
      },
      onError: () => {
        error('Something went wrong');
      },
    }
  );

  // const deposit = useMutation();

  return { stakingPlans, userPlansInfo, activeStakingPlans, subscribe };
};
