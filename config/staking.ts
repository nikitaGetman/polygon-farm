import { ethers } from "hardhat";
import { StakingPlan } from "types";

export const STAKINGS: StakingPlan[] = [
  {
    durationDays: 1,
    apr: 3650,
    subscriptionCost: ethers.BigNumber.from(10).pow(18).mul(10),
    subscriptionDurationDays: 365,
  },
  {
    durationDays: 7,
    apr: 7300,
    subscriptionCost: ethers.BigNumber.from(10).pow(18).mul(15),
    subscriptionDurationDays: 365,
  },
  {
    durationDays: 30,
    apr: 1000,
    subscriptionCost: ethers.BigNumber.from(10).pow(18).mul(25),
    subscriptionDurationDays: 365,
  },
  {
    durationDays: 60,
    apr: 5000,
    subscriptionCost: ethers.BigNumber.from(10).pow(18).mul(50),
    subscriptionDurationDays: 365,
  },
];
