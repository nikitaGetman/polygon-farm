import { tryToGetErrorData } from '@/utils/error';
import { useMutation } from '@tanstack/react-query';
import { BigNumber, ethers } from 'ethers';
import { useAccount, useQuery, useQueryClient } from 'wagmi';
import { useSquadsContract } from './contracts/useSquadsContract';
import { useConnectWallet } from './useConnectWallet';
import { useNotification } from './useNotification';
import { SAV_BALANCE_REQUEST } from './useTokenBalance';
import { TOKENS, useTokens } from './useTokens';

export const USER_SQUADS_INFO_REQUEST = 'user-squads-info';
const SUBSCRIBE_TO_SQUADS_PLAN_MUTATION = 'subscribe-to-squads';

export const SQUADS_SUBSCRIPTION_ENDING_NOTIFICATION = 15 * 24 * 60 * 60; // 15 days in seconds

export const useSquads = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const squadsContract = useSquadsContract();
  const { success, error } = useNotification();
  const tokens = useTokens();
  const { connect } = useConnectWallet();

  const subscriptionPeriodDays = 365;

  const userSquadsInfoRequest = useQuery([USER_SQUADS_INFO_REQUEST, { account }], async () => {
    return await squadsContract.getUserSquadsInfo(account || ethers.constants.AddressZero);
  });

  const subscribe = useMutation(
    [SUBSCRIBE_TO_SQUADS_PLAN_MUTATION],
    async (planId: number) => {
      if (!account) {
        connect();
        return;
      }

      const subscriptionCost =
        userSquadsInfoRequest?.data?.[planId].plan.subscriptionCost || BigNumber.from(10).pow(18); // fallback to 100 tokens;

      await tokens.increaseAllowanceIfRequired.mutateAsync({
        token: TOKENS.SAV,
        owner: account,
        spender: squadsContract.address,
        requiredAmount: subscriptionCost,
      });

      const txHash = await squadsContract.subscribe(planId);
      success({ title: 'Success', description: `Subscribed to Squad plan ${planId + 1}`, txHash });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [USER_SQUADS_INFO_REQUEST] });
        queryClient.invalidateQueries({ queryKey: [SAV_BALANCE_REQUEST] });
      },
      onError: (err) => {
        const errData = tryToGetErrorData(err);
        error(errData);
      },
    }
  );

  return {
    squadsContract,
    userSquadsInfoRequest,
    subscribe,
    subscriptionPeriodDays,
  };
};
