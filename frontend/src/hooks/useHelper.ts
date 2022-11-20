import { Helper } from '@/types';
import { useQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useHelperContract } from './contracts/useHelperContract';

export const HELPER_REFERRALS_LIST_REQUEST = 'helper-referrals-list';

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
