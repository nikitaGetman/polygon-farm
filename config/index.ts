import { ethers } from "ethers";
import { Staking } from "types/index";

export const STAKINGS: Staking[] = [
  {
    durationDays: 1,
    rewardPercent: 10,
    subscriptionCost: 1000,
    subscriptionDurationDays: 365,
  },
  {
    durationDays: 10,
    rewardPercent: 50,
    subscriptionCost: 1000,
    subscriptionDurationDays: 365,
  },
  {
    durationDays: 100,
    rewardPercent: 100,
    subscriptionCost: 1000,
    subscriptionDurationDays: 365,
  },
];

export const VENDOR_SELL_SWAP_RATE = 1;

export const TOKEN1_INITIAL_SUPPLY = ethers.BigNumber.from(10)
  .pow(18)
  .mul(1_000_000);
export const TOKEN2_INITIAL_SUPPLY = 0;
