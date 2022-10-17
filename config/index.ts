import { ethers } from "ethers";
import { SquadPlan, StakingPlan } from "types/index";

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

export const SQUADS: SquadPlan[] = [
  {
    subscriptionCost: ethers.BigNumber.from(10).pow(18), // 1 tokens
    reward: ethers.BigNumber.from(10).pow(20), // 100 tokens
    stakingThreshold: ethers.BigNumber.from(10).pow(20), // from 100 tokens
    squadSize: 6,
    stakingPlanId: 1,
  },
  {
    subscriptionCost: ethers.BigNumber.from(10).pow(18).mul(5), // 5 tokens
    reward: ethers.BigNumber.from(10).pow(20).mul(5), // 500 tokens
    stakingThreshold: ethers.BigNumber.from(10).pow(20).mul(5), // from 500 tokens
    squadSize: 6,
    stakingPlanId: 1,
  },
  {
    subscriptionCost: ethers.BigNumber.from(10).pow(19), // 10 tokens
    reward: ethers.BigNumber.from(10).pow(21), // 1000 tokens
    stakingThreshold: ethers.BigNumber.from(10).pow(21), // from 1000 tokens
    squadSize: 6,
    stakingPlanId: 1,
  },
];

export const VENDOR_SELL_SWAP_RATE = 1000; // = 1, swap rate divider is 1000

export const TOKEN1_INITIAL_SUPPLY = ethers.BigNumber.from(10)
  .pow(18)
  .mul(1_000_000);
export const TOKEN2_INITIAL_SUPPLY = ethers.BigNumber.from(10)
  .pow(18)
  .mul(3_500_000);

// 5 tokens
export const REFERRAL_MANAGER_FULL_SUBSCRIPTION_COST = ethers.BigNumber.from(10)
  .pow(18)
  .mul(5);
// 1 token
export const REFERRAL_MANAGER_LEVEL_SUBSCRIPTION_COST =
  ethers.BigNumber.from(10).pow(18);
