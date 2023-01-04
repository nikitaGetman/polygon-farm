import { useMemo } from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';

import { calculateLotteryWinnersPrize } from '@/lib/lottery';
import { Helper } from '@/types';

import { useHelperContract } from './contracts/useHelperContract';
import { useLotteryRoundById } from './useLotteryRoundById';
import { SQUADS_SUBSCRIPTION_ENDING_NOTIFICATION } from './useSquads';
import { useStaking } from './useStaking';

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

export const HELPER_USER_SQUADS_INFO_REQUEST = 'helper-user-squads-info';
export const useHelperUserSquadsFullInfo = (account?: string) => {
  const helperContract = useHelperContract();
  const { stakingPlansRequest } = useStaking();

  const userSquadsInfoRequest = useQuery([HELPER_USER_SQUADS_INFO_REQUEST, { account }], async () =>
    helperContract.getUserSquadsInfo(account || ethers.constants.AddressZero)
  );

  const userSquadsInfo = useMemo(() => {
    const currentTime = Date.now() / 1000;
    return (
      userSquadsInfoRequest.data
        ?.filter(({ plan }) => plan.isActive)
        .map(({ plan, squadStatus, members, userHasSufficientStaking }) => ({
          plan: { ...plan },
          squadStatus: { ...squadStatus },
          members,
          userHasSufficientStaking,
          stakingPlan: stakingPlansRequest.data?.[plan.stakingPlanId.toNumber()],
          isSubscriptionEnding:
            squadStatus.subscription.toNumber() > 0 &&
            squadStatus.subscription.toNumber() - currentTime <
              SQUADS_SUBSCRIPTION_ENDING_NOTIFICATION,
        })) || []
    );
  }, [stakingPlansRequest.data, userSquadsInfoRequest.data]);

  return {
    userSquadsInfoRequest,
    userSquadsInfo,
  };
};

export const HELPER_LOTTERY_ROUND_WINNERS_REQUEST = 'helper-lottery-round-winners';
export const useHelperLotteryRoundWinners = (roundId?: number) => {
  const helperContract = useHelperContract();
  const { fetchRoundRequest } = useLotteryRoundById(roundId);

  const roundWinnersRequest = useQuery(
    [HELPER_LOTTERY_ROUND_WINNERS_REQUEST],
    async () => helperContract.getLotteryRoundWinnersWithTickets(roundId),
    {
      enabled: roundId !== undefined && Boolean(fetchRoundRequest.data),
      select: (winners) => calculateLotteryWinnersPrize(winners, fetchRoundRequest.data),
    }
  );

  return roundWinnersRequest;
};
