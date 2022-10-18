import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Token1, Staking, Token2 } from "typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { StakingPlan } from "types/index";
import {
  deployReferralManager,
  deployStaking,
  deployToken1,
  deployToken2,
} from "./deployments";

export async function autoSubscribeToStaking(
  planId: number,
  acc: SignerWithAddress,
  token: Token1,
  tokenHolder: SignerWithAddress,
  stakingContract: Staking
) {
  const plan = await stakingContract.stakingPlans(planId);

  await token.connect(tokenHolder).transfer(acc.address, plan.subscriptionCost);
  await token
    .connect(acc)
    .approve(stakingContract.address, ethers.constants.MaxUint256);

  await stakingContract.connect(acc).subscribe(planId);
}

export type StakeTokenParams = {
  planId: number;
  acc: SignerWithAddress;
  token1: Token1;
  token1Holder: SignerWithAddress;
  stakingContract: Staking;
  token2?: Token2;
  token2Holder?: SignerWithAddress;
  stakeAmount?: BigNumber;
  isToken2?: boolean;
  referrer?: SignerWithAddress;
};
export async function autoStakeToken({
  planId,
  acc,
  token1,
  token2,
  token1Holder,
  token2Holder,
  stakingContract,
  stakeAmount,
  isToken2 = false,
  referrer,
}: StakeTokenParams) {
  await autoSubscribeToStaking(
    planId,
    acc,
    token1,
    token1Holder,
    stakingContract
  );

  const amount = stakeAmount || (await stakingContract.MIN_STAKE_LIMIT());
  if (isToken2 && token2 && token2Holder) {
    await token2.connect(token2Holder).transfer(acc.address, amount);
    await token2
      .connect(acc)
      .approve(stakingContract.address, ethers.constants.MaxUint256);
  } else {
    await token1.connect(token1Holder).transfer(acc.address, amount);
  }

  await stakingContract
    .connect(acc)
    .deposit(
      planId,
      amount,
      isToken2,
      referrer?.address || ethers.constants.AddressZero
    );
}

export async function waitForStakeFinished(days: number) {
  await time.increase(days * 60 * 60 * 24 + 100);
}

export const STAKING_PLANS: StakingPlan[] = [
  {
    durationDays: 1,
    rewardPercent: 100, // 10%
    subscriptionCost: BigNumber.from(10).pow(18), // 1 token
    subscriptionDurationDays: 10,
  },
  {
    durationDays: 5,
    rewardPercent: 500, // 50%
    subscriptionCost: BigNumber.from(10).pow(19), // 10 tokens
    subscriptionDurationDays: 15,
  },
  {
    durationDays: 10,
    rewardPercent: 1000, // 100%
    subscriptionCost: BigNumber.from(10).pow(20), // 100 tokens
    subscriptionDurationDays: 30,
  },
];

export async function deployStakingFixture() {
  const initialSupply = BigNumber.from(10).pow(18).mul(21_000_000);
  const minStakeLimit = BigNumber.from(10).pow(17);
  const stakingPlans = STAKING_PLANS;

  const [
    adminAccount,
    token1Holder,
    stakingRewardPool,
    token2Holder,
    ...restSigners
  ] = await ethers.getSigners();

  const token1 = await deployToken1({
    admin: adminAccount,
    initialSupply,
    initialHolder: token1Holder.address,
  });
  await token1
    .connect(token1Holder)
    .transfer(stakingRewardPool.address, initialSupply.div(2));

  const token2 = await deployToken2({
    admin: adminAccount,
    initialSupply,
    initialHolder: token2Holder.address,
  });

  const referralManager = await deployReferralManager({
    admin: adminAccount,
    fullSubscriptionCost: BigNumber.from(10).pow(18).mul(5),
    levelSubscriptionCost: BigNumber.from(10).pow(18),
    token1Address: token1.address,
    token2,
    referralRewardPool: token2Holder,
  });

  const stakingContract = await deployStaking({
    admin: adminAccount,
    stakingPlans,
    token1,
    token2,
    stakingRewardPool,
    referralManager,
  });

  return {
    stakingContract,
    token1,
    token2,
    initialSupply,
    adminAccount,
    token1Holder,
    token2Holder,
    stakingRewardPool,
    referralManager,
    restSigners,
    stakingPlans,
    minStakeLimit,
  };
}
