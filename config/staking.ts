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
  {
    durationDays: 30,
    rewardPercent: 250,
    subscriptionCost: ethers.BigNumber.from(10).pow(18).mul(25),
    subscriptionDurationDays: 365,
  },
  {
    durationDays: 60,
    rewardPercent: 500,
    subscriptionCost: ethers.BigNumber.from(10).pow(18).mul(50),
    subscriptionDurationDays: 365,
  },
];
