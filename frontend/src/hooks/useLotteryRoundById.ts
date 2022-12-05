import { useQuery } from '@tanstack/react-query';
import { BigNumberish } from 'ethers';

import { parseLotteryFormat } from '@/lib/lottery';

import { useLotteryContract } from './contracts/useLotteryContract';

export const LOTTERY_ROUND_REQUEST = 'lottery-round-request';
export const useLotteryRoundById = (id?: BigNumberish) => {
  const lotteryContract = useLotteryContract();
  const enabled = id !== undefined;

  const fetchRoundRequest = useQuery({
    queryKey: [LOTTERY_ROUND_REQUEST, { id }],
    queryFn: async () => {
      return enabled ? await lotteryContract.getRound(id).then(parseLotteryFormat) : null;
    },
    enabled,
  });

  return { fetchRoundRequest, round: fetchRoundRequest.data };
};
