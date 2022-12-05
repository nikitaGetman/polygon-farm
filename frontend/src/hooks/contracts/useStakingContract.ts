import { waitForTransaction } from '@/utils/waitForTransaction';
import { Staking } from '@/types';
import { BigNumberish, ethers } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';
import { ContractsEnum, useContractAbi } from './useContractAbi';

export enum StakingEvent {
  Staked = 'Staked',
  Claimed = 'Claimed',
  StakingPlanCreated = 'StakingPlanCreated',
  ActivityChanged = 'ActivityChanged',
  Subscribed = 'Subscribed',
}

export const useStakingContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({ contract: ContractsEnum.Staking });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as Staking;

  const getStakingPlans = async () => {
    return contract.getStakingPlans();
  };

  const getUserStakingInfo = async (address: string) => {
    return contract.getUserPlansInfo(address);
  };

  const getUserStakesWithRewards = async (address: string, planId: number) => {
    return contract.getUserStakesWithRewards(planId, address);
  };

  const getUserStakes = async (address: string, planId: number) => {
    return contract.getUserStakes(planId, address);
  };

  const subscribe = async (planId: number): Promise<string> => {
    const tx = await contract.subscribe(planId);
    return waitForTransaction(tx);
  };

  const withdraw = async (planId: number, stakeId: number): Promise<string> => {
    const tx = await contract.withdraw(planId, stakeId);
    return waitForTransaction(tx);
  };

  const withdrawAll = async (planId: number): Promise<string> => {
    const tx = await contract.withdrawAll(planId);
    return waitForTransaction(tx);
  };

  const deposit = async ({
    planId,
    amount,
    referrer,
    isToken2,
  }: {
    planId: number;
    amount: BigNumberish;
    isToken2: boolean;
    referrer?: string;
  }) => {
    const tx = await contract.deposit(
      planId,
      amount,
      isToken2,
      referrer || ethers.constants.AddressZero
    );
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    deposit,
    withdraw,
    withdrawAll,
    getStakingPlans,
    getUserStakingInfo,
    getUserStakesWithRewards,
    getUserStakes,
    subscribe,
  };
};
