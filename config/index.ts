import { ethers } from "ethers";
import { Staking } from "types/index";

export const STAKINGS: Staking[] = [
  {
    durationDays: 1,
    rewardPercent: 10,
    subscriptionCost: ethers.BigNumber.from(10).pow(18).mul(10).toString(),
    subscriptionDurationDays: 365,
  },
  {
    durationDays: 7,
    rewardPercent: 50,
    subscriptionCost: ethers.BigNumber.from(10).pow(18).mul(15).toString(),
    subscriptionDurationDays: 365,
  },
  // {
  //   durationDays: 20,
  //   rewardPercent: 100,
  //   subscriptionCost: ethers.BigNumber.from(10).pow(18).mul(20).toString(),
  //   subscriptionDurationDays: 365,
  // },
];

export const VENDOR_SELL_SWAP_RATE = 1000; // = 1, swap rate divider is 1000

export const TOKEN1_INITIAL_SUPPLY = ethers.BigNumber.from(10)
  .pow(18)
  .mul(1_000_000);
export const TOKEN2_INITIAL_SUPPLY = ethers.BigNumber.from(10)
  .pow(18)
  .mul(3_500_000);
