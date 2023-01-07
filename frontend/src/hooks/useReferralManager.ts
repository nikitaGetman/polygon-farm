import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { useAccount } from 'wagmi';

import { bigNumberToString } from '@/utils/number';
import { createReferralLink } from '@/utils/referralLinks';

import { useReferralContract } from './contracts/useReferralContract';
import { TOKENS } from './contracts/useTokenContract';
import { useConnectWallet } from './useConnectWallet';
import { useNotification } from './useNotification';
import { useStaking } from './useStaking';
import { SAV_BALANCE_REQUEST, SAVR_BALANCE_REQUEST } from './useTokenBalance';
import { useTokens } from './useTokens';

export const USER_REFERRAL_INFO_REQUEST = 'user-referrals-info';

export const LEVEL_SUBSCRIPTION_COST_REQUEST = 'get-referral-level-subscription-cost';
export const ALL_LEVELS_SUBSCRIPTION_COST_REQUEST = 'get-all-referral-levels-subscription-cost';
const USER_REFERRAL_REWARDS_REQUEST = 'user-referral-rewards';
const SUBSCRIBE_TO_REFERRAL_LEVEL_MUTATION = 'subscribe-to-referral-level';
const SUBSCRIBE_TO_ALL_REFERRAL_LEVELS_MUTATION = 'subscribe-to-all-referral-levels';
const SET_MY_REFERRER_MUTATION = 'set-my-referrer';
const CLAIM_REFERRAL_REWARDS_MUTATION = 'claim-referral-rewards';

export const REFERRAL_SUBSCRIPTION_ENDING_NOTIFICATION = 30 * 24 * 60 * 60; // 30 days in seconds

export const useReferralManagerSubscriptions = () => {
  const referralContract = useReferralContract();
  const queryClient = useQueryClient();
  const { success, handleError } = useNotification();

  const levelSubscriptionCost = useQuery([LEVEL_SUBSCRIPTION_COST_REQUEST], async () => {
    return await referralContract.contract.levelSubscriptionCost();
  });
  const fullSubscriptionCost = useQuery([ALL_LEVELS_SUBSCRIPTION_COST_REQUEST], async () => {
    return await referralContract.contract.fullSubscriptionCost();
  });

  const updateLevelSubscription = useMutation(
    ['update-level-subscription-cost'],
    async (cost: number) => {
      const costBN = parseEther(cost.toString());

      const txHash = await referralContract.updateLevelSubscriptionCost(costBN);
      success({ title: 'Success', description: '1 level subscription cost updated', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LEVEL_SUBSCRIPTION_COST_REQUEST]);
        queryClient.invalidateQueries([ALL_LEVELS_SUBSCRIPTION_COST_REQUEST]);
      },
      onError: handleError,
    }
  );

  const updateFullSubscription = useMutation(
    ['update-full-subscription-cost'],
    async (cost: number) => {
      const costBN = parseEther(cost.toString());

      const txHash = await referralContract.updateFullSubscriptionCost(costBN);
      success({ title: 'Success', description: 'Full subscription cost updated', txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LEVEL_SUBSCRIPTION_COST_REQUEST]);
        queryClient.invalidateQueries([ALL_LEVELS_SUBSCRIPTION_COST_REQUEST]);
      },
      onError: handleError,
    }
  );

  return {
    levelSubscriptionCost,
    fullSubscriptionCost,
    updateLevelSubscription,
    updateFullSubscription,
    referralContract,
  };
};

export const useReferralManager = () => {
  const { address: account } = useAccount();
  const { levelSubscriptionCost, fullSubscriptionCost } = useReferralManagerSubscriptions();

  const queryClient = useQueryClient();
  const referralContract = useReferralContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();
  const { connect } = useConnectWallet();
  const { stakingPlansRequest } = useStaking();

  // Hardcode this, hope it would not change
  const levels = 10;
  const subscriptionDuration = 365;

  const userReferralInfo = useQuery([USER_REFERRAL_INFO_REQUEST, { account }], async () => {
    return account ? await referralContract.getUserInfo(account) : null;
  });

  const referralRewardsRequest = useQuery(
    [USER_REFERRAL_REWARDS_REQUEST, { account }],
    async () => {
      return account ? await referralContract.getRewards(account) : null;
    }
  );

  const referralRewards = useMemo(
    () =>
      referralRewardsRequest.data?.map(({ args }) => ({
        ...args,
        stakingDuration:
          stakingPlansRequest.data && args.stakingPlanId
            ? stakingPlansRequest.data[args.stakingPlanId.toNumber()].stakingDuration
            : BigNumber.from(0),
      })) || [],
    [referralRewardsRequest.data, stakingPlansRequest.data]
  );

  const levelsSubscription = useMemo(
    () =>
      (userReferralInfo.data?.activeLevels || Array.from({ length: 10 })).map((till) =>
        BigNumber.from(till || 0).toNumber()
      ),
    [userReferralInfo.data]
  );

  const fullSubscription = useMemo(
    () =>
      levelsSubscription.some((till) => till !== levelsSubscription[0]) ? 0 : levelsSubscription[0],
    [levelsSubscription]
  );

  const hasEndingReferralSubscription = useMemo(() => {
    const currentTime = Date.now() / 1000;
    return (userReferralInfo.data?.activeLevels || []).some(
      (till: any) =>
        till &&
        till.toNumber() > 0 &&
        till.toNumber() - currentTime < REFERRAL_SUBSCRIPTION_ENDING_NOTIFICATION
    );
  }, [userReferralInfo.data]);

  const referrer = useMemo(
    () =>
      userReferralInfo.data?.referrer &&
      userReferralInfo.data.referrer !== ethers.constants.AddressZero
        ? userReferralInfo.data.referrer
        : undefined,
    [userReferralInfo.data]
  );
  const referralLink = useMemo(
    () =>
      account && levelsSubscription[0] > Date.now() / 1000
        ? createReferralLink(account)
        : undefined,
    [levelsSubscription, account]
  );

  const subscribeToLevel = useMutation(
    [SUBSCRIBE_TO_REFERRAL_LEVEL_MUTATION],
    async (level: number) => {
      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        spender: referralContract.address,
        requiredAmount: levelSubscriptionCost.data || BigNumber.from(10).pow(18), // fallback to 10 tokens
      });

      const txHash = await referralContract.subscribeToLevel(level);
      success({
        title: 'Success',
        description: `Level ${level} of Referral subscription has been activated for one year`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_REFERRAL_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  const subscribeToAllLevels = useMutation(
    [SUBSCRIBE_TO_ALL_REFERRAL_LEVELS_MUTATION],
    async () => {
      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        spender: referralContract.address,
        requiredAmount: fullSubscriptionCost.data || BigNumber.from(10).pow(18), // fallback to 10 tokens
      });

      const txHash = await referralContract.subscribeToAllLevels();
      success({
        title: 'Success',
        description: 'All Levels of Referral subscription have been activated for one year',
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_REFERRAL_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  const setMyReferrer = useMutation(
    [SET_MY_REFERRER_MUTATION],
    async (referrer: string) => {
      if (!account) {
        connect();
        return;
      }
      const txHash = await referralContract.setMyReferrer(referrer);
      success({ title: 'Success', description: `Your leader is ${referrer}`, txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_REFERRAL_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  const claimDividends = useMutation(
    [CLAIM_REFERRAL_REWARDS_MUTATION],
    async (rewards: BigNumber) => {
      if (!account) {
        connect();
        return;
      }

      const txHash = await referralContract.claimRewards(rewards);
      success({
        title: 'Success',
        description: `${bigNumberToString(rewards)} SAVR Referral Rewards have been claimed`,
        txHash,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_REFERRAL_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAVR_BALANCE_REQUEST] });
      },
      onError: (err) => {
        handleError(err);
      },
    }
  );

  return {
    referralContract,
    userReferralInfo,
    hasEndingReferralSubscription,
    subscribeToLevel,
    subscribeToAllLevels,
    levelSubscriptionCost,
    fullSubscriptionCost,
    levels,
    subscriptionDuration,
    levelsSubscription,
    fullSubscription,
    referrer,
    referralLink,
    setMyReferrer,
    claimDividends,
    referralRewardsRequest,
    referralRewards,
  };
};
