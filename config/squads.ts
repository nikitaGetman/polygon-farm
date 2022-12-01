import { ethers } from "hardhat";
import { SquadPlan } from "types";

export const SQUADS: SquadPlan[] = [
  {
    subscriptionCost: ethers.BigNumber.from(10).pow(18), // 1 tokens
    reward: ethers.BigNumber.from(10).pow(20), // 100 tokens
    stakingThreshold: ethers.BigNumber.from(10).pow(20), // from 100 tokens
    squadSize: 6,
    stakingPlanId: 3,
  },
  {
    subscriptionCost: ethers.BigNumber.from(10).pow(18).mul(5), // 5 tokens
    reward: ethers.BigNumber.from(10).pow(20).mul(5), // 500 tokens
    stakingThreshold: ethers.BigNumber.from(10).pow(20).mul(5), // from 500 tokens
    squadSize: 6,
    stakingPlanId: 3,
  },
  {
    subscriptionCost: ethers.BigNumber.from(10).pow(19), // 10 tokens
    reward: ethers.BigNumber.from(10).pow(21), // 1000 tokens
    stakingThreshold: ethers.BigNumber.from(10).pow(21), // from 1000 tokens
    squadSize: 6,
    stakingPlanId: 3,
  },
];
