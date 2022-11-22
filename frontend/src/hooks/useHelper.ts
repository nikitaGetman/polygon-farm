import { Helper } from '@/types';
import { useQueries, useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useMemo } from 'react';
import { useHelperContract } from './contracts/useHelperContract';
import { useStaking } from './useStaking';

export const HELPER_REFERRALS_LIST_REQUEST = 'helper-referrals-list';
export const HELPER_USER_SQUADS_INFO_REQUEST = 'helper-user-squads-info';

export const useHelperReferralsFullInfoByLevel = (account?: string, levels?: number[]) => {
  const helperContract = useHelperContract();

  const referralsQueries = useQueries({
    queries: (levels || [])?.map((level) => ({
      queryKey: [HELPER_REFERRALS_LIST_REQUEST, account, level],
      queryFn: async () => {
        return account && level
          ? await helperContract.getReferralsFullInfoByLevel(account, level)
          : null;
      },
    })),
  });

  const referralsFullInfoList = useMemo(() => {
    const res = referralsQueries.reduce((acc, rq) => {
      if (rq.data) {
        acc.push(...rq.data);
      }
      return acc;
    }, [] as Helper.ReferralFullInfoStructOutput[]);
    return res;
  }, [referralsQueries]);

  return referralsFullInfoList;
};

export const useHelperUserSquadsFullInfo = (account?: string) => {
  const helperContract = useHelperContract();
  const { stakingPlans } = useStaking();

  const userSquadsInfoRequest = useQuery(
    [HELPER_USER_SQUADS_INFO_REQUEST, { account }],
    async () => {
      return await helperContract.getUserSquadsInfo(account || ethers.constants.AddressZero);
    }
  );

  const userSquadsInfo = useMemo(() => {
    return (
      userSquadsInfoRequest.data?.map(
        ({ plan, squadStatus, members, userHasSufficientStaking }) => ({
          plan: { ...plan },
          squadStatus: { ...squadStatus },
          members,
          userHasSufficientStaking,
          stakingPlan: stakingPlans.data?.[plan.stakingPlanId.toNumber()],
        })
      ) || []
    );
  }, [stakingPlans, userSquadsInfoRequest]);

  return {
    userSquadsInfoRequest,
    userSquadsInfo,
  };
};
