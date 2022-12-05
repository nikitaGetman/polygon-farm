import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';
import { useAccount, useQuery, useQueryClient } from 'wagmi';

import { bigNumberToString } from '@/utils/number';
import { createReferralLink } from '@/utils/referralLinks';

import { useReferralContract } from './contracts/useReferralContract';
import { useConnectWallet } from './useConnectWallet';
import { useNotification } from './useNotification';
import { useStaking } from './useStaking';
import { SAV_BALANCE_REQUEST, SAVR_BALANCE_REQUEST } from './useTokenBalance';
import { TOKENS, useTokens } from './useTokens';

export const USER_REFERRAL_INFO_REQUEST = 'user-referrals-info';

const LEVEL_SUBSCRIPTION_COST_REQUEST = 'get-referral-level-subscription-cost';
const ALL_LEVELS_SUBSCRIPTION_COST_REQUEST = 'get-all-referral-levels-subscription-cost';
const USER_REFERRAL_REWARDS_REQUEST = 'user-referral-rewards';
const SUBSCRIBE_TO_REFERRAL_LEVEL_MUTATION = 'subscribe-to-referral-level';
const SUBSCRIBE_TO_ALL_REFERRAL_LEVELS_MUTATION = 'subscribe-to-all-referral-levels';
const SET_MY_REFERRER_MUTATION = 'set-my-referrer';
const CLAIM_REFERRAL_REWARDS_MUTATION = 'claim-referral-rewards';

export const REFERRAL_SUBSCRIPTION_ENDING_NOTIFICATION = 15 * 24 * 60 * 60; // 15 days in seconds

export const useReferralManager = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const referralContract = useReferralContract();
  const { success, handleError } = useNotification();
  const tokens = useTokens();
  const { connect } = useConnectWallet();
  const { stakingPlans } = useStaking();

  // Hardcode this, hope it would not change
  const levels = 10;
  const subscriptionDuration = 365;

  const userReferralInfo = useQuery([USER_REFERRAL_INFO_REQUEST, { account }], async () => {
    return account ? await referralContract.getUserInfo(account) : null;
  });

  const levelSubscriptionCost = useQuery([LEVEL_SUBSCRIPTION_COST_REQUEST], async () => {
    return await referralContract.contract.levelSubscriptionCost();
  });
  const fullSubscriptionCost = useQuery([ALL_LEVELS_SUBSCRIPTION_COST_REQUEST], async () => {
    return await referralContract.contract.fullSubscriptionCost();
  });

  const referralRewardsQuery = useQuery([USER_REFERRAL_REWARDS_REQUEST, { account }], async () => {
    return account ? await referralContract.getRewards(account) : null;
  });

  const referralRewards = useMemo(
    () =>
      referralRewardsQuery.data?.map(({ args }) => ({
        ...args,
        stakingDuration:
          stakingPlans.data && args.stakingPlanId
            ? stakingPlans.data[args.stakingPlanId.toNumber()].stakingDuration
            : BigNumber.from(0),
      })) || [],
    [referralRewardsQuery, stakingPlans]
  );

  const levelsSubscription = useMemo(
    () =>
      (userReferralInfo.data?.activeLevels || Array.from({ length: 10 })).map((till) =>
        BigNumber.from(till || 0).toNumber()
      ),
    [userReferralInfo.data?.activeLevels]
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
  }, [userReferralInfo.data?.activeLevels]);

  const referrer = useMemo(
    () =>
      userReferralInfo.data?.referrer &&
      userReferralInfo.data.referrer !== ethers.constants.AddressZero
        ? userReferralInfo.data.referrer
        : undefined,
    [userReferralInfo.data?.referrer]
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
      if (!account) {
        connect();
        return;
      }

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        owner: account,
        spender: referralContract.address,
        requiredAmount: levelSubscriptionCost.data || BigNumber.from(10).pow(18), // fallback to 10 tokens
      });

      const txHash = await referralContract.subscribeToLevel(level);
      success({
        title: 'Success',
        description: `Referral ${level} Level subscription has been activated for one year`,
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
      if (!account) {
        connect();
        return;
      }

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        owner: account,
        spender: referralContract.address,
        requiredAmount: fullSubscriptionCost.data || BigNumber.from(10).pow(18), // fallback to 10 tokens
      });

      const txHash = await referralContract.subscribeToAllLevels();
      success({
        title: 'Success',
        description: 'Referral All Levels subscription has been activated for one year',
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
      success({ title: 'Success', description: `Your referrer is ${referrer}`, txHash });
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
        description: `${bigNumberToString(rewards)} SAVR Referral Rewards claimed`,
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
    referralRewardsQuery,
    referralRewards,
  };
};
