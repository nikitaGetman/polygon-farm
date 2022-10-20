import { ethers } from "hardhat";

// 5 tokens
export const REFERRAL_MANAGER_FULL_SUBSCRIPTION_COST = ethers.BigNumber.from(10)
  .pow(18)
  .mul(5);
// 1 token
export const REFERRAL_MANAGER_LEVEL_SUBSCRIPTION_COST =
  ethers.BigNumber.from(10).pow(18);
