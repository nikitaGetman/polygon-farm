import { useMemo } from 'react';
import { useAccount, useQuery, useQueryClient } from 'wagmi';
import { useReferralContract } from './contracts/useReferralContract';
import { useNotification } from './useNotification';

export const GET_USER_REFERRAL_INFO_REQUEST = 'user-referrals-info';

const SUBSCRIPTION_ENDING_NOTIFICATION = 15 * 24 * 60 * 60; // 15 days in seconds

export const useReferralManager = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const referralContract = useReferralContract();
  const { success, error } = useNotification();

  const userReferralInfo = useQuery([GET_USER_REFERRAL_INFO_REQUEST, { account }], async () => {
    return account ? await referralContract.getUserInfo(account) : null;
  });

  const hasEndingReferralSubscription = useMemo(() => {
    const currentTime = Date.now() / 1000;
    return (userReferralInfo.data?.activeLevels || []).some(
      (till: any) =>
        till &&
        till.toNumber() > 0 &&
        till.toNumber() - currentTime < SUBSCRIPTION_ENDING_NOTIFICATION
    );
  }, [userReferralInfo.data?.activeLevels]);

  return {
    referralContract,
    userReferralInfo,
    hasEndingReferralSubscription,
  };
};
