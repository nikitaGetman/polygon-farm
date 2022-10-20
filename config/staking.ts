import { ethers } from "hardhat";
import { StakingPlan } from "types";

export const STAKINGS: StakingPlan[] = [
  {
    durationDays: 1,
    rewardPercent: 10,
    subscriptionCost: ethers.BigNumber.from(10).pow(18).mul(10),
    subscriptionDurationDays: 365,
  },
  {
    durationDays: 7,
    rewardPercent: 50,
    subscriptionCost: ethers.BigNumber.from(10).pow(18).mul(15),
    subscriptionDurationDays: 365,
  },
  // {
  //   durationDays: 20,
  //   rewardPercent: 100,
  //   subscriptionCost: ethers.BigNumber.from(10).pow(18).mul(20).toString(),
  //   subscriptionDurationDays: 365,
  // },
];
