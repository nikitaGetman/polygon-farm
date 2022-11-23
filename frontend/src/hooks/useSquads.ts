import { tryToGetErrorData } from '@/utils/error';
import { useMutation } from '@tanstack/react-query';
import { BigNumber } from 'ethers';
import { useAccount, useQuery, useQueryClient } from 'wagmi';
import { useSquadsContract } from './contracts/useSquadsContract';
import { useConnectWallet } from './useConnectWallet';
import { useHelperUserSquadsFullInfo } from './useHelper';
import { useNotification } from './useNotification';
import { SAV_BALANCE_REQUEST } from './useTokenBalance';
import { TOKENS, useTokens } from './useTokens';

const SQUAD_PLANS_REQUEST = 'squad-plans-info';
const SUBSCRIBE_TO_SQUADS_PLAN_MUTATION = 'subscribe-to-squads';

export const SQUADS_SUBSCRIPTION_ENDING_NOTIFICATION = 15 * 24 * 60 * 60; // 15 days in seconds

export const useSquads = () => {
  const { address: account } = useAccount();

  const queryClient = useQueryClient();
  const squadsContract = useSquadsContract();
  const { success, error } = useNotification();
  const tokens = useTokens();
  const { connect } = useConnectWallet();
  const { userSquadsInfoRequest } = useHelperUserSquadsFullInfo(account);

  const subscriptionPeriodDays = 365;

  const squadPlansRequest = useQuery([SQUAD_PLANS_REQUEST], async () => {
    return await squadsContract.getPlans();
  });

  const subscribe = useMutation(
    [SUBSCRIBE_TO_SQUADS_PLAN_MUTATION],
    async (planId: number) => {
      if (!account) {
        connect();
        return;
      }

      const subscriptionCost =
        squadPlansRequest?.data?.[planId].subscriptionCost || BigNumber.from(10).pow(18); // fallback to 100 tokens;

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
        userSquadsInfoRequest.refetch();
        // TODO: invalidateQueries does not work in this case
        // queryClient.invalidateQueries({ queryKey: [HELPER_USER_SQUADS_INFO_REQUEST] });
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
    subscribe,
    subscriptionPeriodDays,
  };
};
