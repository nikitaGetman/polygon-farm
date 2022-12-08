import { ethers } from "hardhat";

export const TOKEN1_INITIAL_SUPPLY = ethers.BigNumber.from(10)
  .pow(18)
  .mul(1_000_000_000);
export const TOKEN2_INITIAL_SUPPLY = ethers.BigNumber.from(10)
  .pow(18)
  .mul(1_000_000_000);
