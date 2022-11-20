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

  const subscribe = async (planId: number): Promise<string> => {
    const tx = await contract.subscribe(planId);
    await tx.wait();
    return tx.hash;
  };

  const withdraw = async (planId: number, stakeId: number): Promise<string> => {
    const tx = await contract.withdraw(planId, stakeId);
    await tx.wait();
    return tx.hash;
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
  }): Promise<string> => {
    // TODO: what if call this method unauthorized
    const tx = await contract.deposit(
      planId,
      amount,
      isToken2,
      referrer || ethers.constants.AddressZero
    );
    await tx.wait();
    return tx.hash;
  };

  return {
    contract,
    address: contractAddress,
    deposit,
    withdraw,
    getStakingPlans,
    getUserStakingInfo,
    getUserStakesWithRewards,
    subscribe,
  };
};
