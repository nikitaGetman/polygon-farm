import { BigNumber } from "ethers";

export type StakingPlan = {
  durationDays: number;
  apr: number;
  subscriptionCost: BigNumber; // BigNumber
  subscriptionDurationDays: number;
};

export type SquadPlan = {
  subscriptionCost: BigNumber;
  reward: BigNumber;
  stakingThreshold: BigNumber;
  squadSize: number;
  stakingPlanId: number;
};
