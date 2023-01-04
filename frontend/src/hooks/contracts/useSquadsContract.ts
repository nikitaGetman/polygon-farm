import { BigNumber } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { Squads } from '@/types';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useSquadsContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.Squads,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as Squads;

  const getPlans = async () => {
    return await contract.getPlans();
  };

  const subscribe = async (planId: number) => {
    const tx = await contract.subscribe(planId);
    return waitForTransaction(tx);
  };

  const updatePlanActivity = async (planId: number, isActive: boolean) => {
    const tx = await contract.updatePlanActivity(planId, isActive);
    return waitForTransaction(tx);
  };

  const addPlan = async ({
    subscriptionCost,
    reward,
    stakingThreshold,
    squadSize,
    stakingPlanId,
  }: {
    subscriptionCost: BigNumber;
    reward: BigNumber;
    stakingThreshold: BigNumber;
    squadSize: number;
    stakingPlanId: number;
  }) => {
    const tx = await contract.addPlan(
      subscriptionCost,
      reward,
      stakingThreshold,
      squadSize,
      stakingPlanId
    );
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    subscribe,
    getPlans,
    updatePlanActivity,
    addPlan,
  };
};
