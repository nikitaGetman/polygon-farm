import { Staking } from '@/types';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useAccount, useContract, useProvider, useSigner } from 'wagmi';
import { ContractsEnum, useContractAbi } from './useContractAbi';
import { useSavContract } from './useSavContract';
import { useSavRContract } from './useSavRContract';

// type StakingPlan = {
//   isActive: boolean;
//   profitPercent: BigNumber;
//   stakingDuration: BigNumber;
//   subscriptionCost: BigNumber;
//   subscriptionDuration: BigNumber;
//   totalClaimed: BigNumber;
//   totalStakedToken1: BigNumber;
//   totalStakedToken2: BigNumber;
//   totalStakesToken1No: BigNumber;
//   totalStakesToken2No: BigNumber;
// };

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

  const subscribe = async (planId: number) => {
    const tx = await contract.subscribe(planId);
    await tx.wait();
  };

  const withdraw = async (planId: number, stakeId: number) => {
    const tx = await contract.withdraw(planId, stakeId);
    await tx.wait();
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
  }): Promise<void> => {
    // TODO: what if call this method unauthorized
    const tx = await contract.deposit(
      planId,
      amount,
      isToken2,
      referrer || ethers.constants.AddressZero
    );
    await tx.wait();
  };

  return {
    contract,
    address: contractAddress,
    deposit,
    withdraw,
    getStakingPlans,
    getUserStakingInfo,
    subscribe,
  };
};
