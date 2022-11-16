import { tryToGetError } from '@/utils/error';
import { createReferralLink } from '@/utils/referralLinks';
import { useMutation } from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';
import { useMemo } from 'react';
import { useAccount, useQuery, useQueryClient } from 'wagmi';
import { useReferralContract } from './contracts/useReferralContract';
import { useNotification } from './useNotification';
import { SAV_BALANCE_REQUEST } from './useTokenBalance';
import { TOKENS, useTokens } from './useTokens';

export const USER_REFERRAL_INFO_REQUEST = 'user-referrals-info';
const LEVEL_SUBSCRIPTION_COST_REQUEST = 'get-referral-level-subscription-cost';
const ALL_LEVELS_SUBSCRIPTION_COST_REQUEST = 'get-all-referral-levels-subscription-cost';
const SUBSCRIBE_TO_REFERRAL_LEVEL_MUTATION = 'subscribe-to-referral-level';
const SUBSCRIBE_TO_ALL_REFERRAL_LEVELS_MUTATION = 'subscribe-to-all-referral-levels';

export const REFERRAL_SUBSCRIPTION_ENDING_NOTIFICATION = 15 * 24 * 60 * 60; // 15 days in seconds

export const useReferralManager = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const referralContract = useReferralContract();
  const { success, error } = useNotification();
  const tokens = useTokens();

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
      if (!account) return;

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        owner: account,
        spender: referralContract.address,
        requiredAmount: levelSubscriptionCost.data || BigNumber.from(10).pow(18), // fallback to 10 tokens
      });

      await referralContract.subscribeToLevel(level);
    },
    {
      onSuccess: (_, level) => {
        queryClient.invalidateQueries({ queryKey: [USER_REFERRAL_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
        success(`Subscribed to level ${level}!`);
      },
      onError: (err) => {
        const errMessage = tryToGetError(err);
        error(errMessage);
      },
    }
  );

  const subscribeToAllLevels = useMutation(
    [SUBSCRIBE_TO_ALL_REFERRAL_LEVELS_MUTATION],
    async () => {
      if (!account) return;

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        owner: account,
        spender: referralContract.address,
        requiredAmount: fullSubscriptionCost.data || BigNumber.from(10).pow(18), // fallback to 10 tokens
      });

      await referralContract.subscribeToAllLevels();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_REFERRAL_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
        success('Subscribed to all levels');
      },
      onError: (err) => {
        const errMessage = tryToGetError(err);
        error(errMessage);
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
  };
};
