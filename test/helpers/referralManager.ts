import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { Token1, ReferralManager } from "typechain-types";
import { StakingPlan } from "types";
import {
  deployReferralManager,
  deployStaking,
  deployToken1,
  deployToken2,
} from "./deployments";
import { autoStakeToken, StakeTokenParams } from "./staking";

type SubscribeParams = {
  token: Token1;
  tokenHolder: SignerWithAddress;
  account: SignerWithAddress;
  referralManager: ReferralManager;
};
export async function autoSubscribeToReferral({
  token,
  tokenHolder,
  account,
  referralManager,
  levels,
}: SubscribeParams & { levels?: number }) {
  const levelsToSubscribe = levels || 1;
  const levelSubscriptionCost = await referralManager.levelSubscriptionCost();
  const subscriptionCost = levelSubscriptionCost.mul(levelsToSubscribe);

  await token.connect(tokenHolder).transfer(account.address, subscriptionCost);
  await token
    .connect(account)
    .approve(referralManager.address, subscriptionCost);

  for (let i = 1; i <= levelsToSubscribe; i++) {
    await referralManager.connect(account).subscribeToLevel(i);
  }
}

type ReferralChainParams = Omit<SubscribeParams, "account"> & {
  levels?: number;
  subscriptionLevels?: number;
  signers: SignerWithAddress[];
  adminAccount: SignerWithAddress;
  getStakeParams?: (
    level: number,
    defaultParams?: StakeTokenParams
  ) => StakeTokenParams & { repeat?: boolean };
} & Pick<StakeTokenParams, "stakingContract">;
export async function createReferralChain({
  token,
  tokenHolder,
  referralManager,
  stakingContract,
  levels,
  subscriptionLevels,
  signers,
  adminAccount,
  getStakeParams,
}: ReferralChainParams) {
  const referralLevels = (await referralManager.getReferralLevels()).toNumber();
  const levelsToSubscribe = levels || referralLevels;

  const chainAccounts = [];

  let [referrer, ...restSigners] = signers;
  chainAccounts.push({ ...referrer, level: 0 });
  let i = 1;
  while (i <= levelsToSubscribe && restSigners.length > 0) {
    let acc: SignerWithAddress;
    [acc, ...restSigners] = restSigners;
    await autoSubscribeToReferral({
      token,
      tokenHolder,
      account: referrer,
      referralManager,
      levels: Math.min(subscriptionLevels || levelsToSubscribe, referralLevels),
    });

    const defaultParams = {
      planId: 0,
      acc,
      adminAccount,
      token1: token,
      token1Holder: tokenHolder,
      stakingContract,
      referrer,
    };
    const { repeat, ...stakeParams } = getStakeParams
      ? getStakeParams(i, defaultParams)
      : {
          ...defaultParams,
          repeat: false,
        };

    await autoStakeToken(stakeParams);

    chainAccounts.push({ ...acc, level: i });
    if (!repeat) {
      i++;
      referrer = acc;
    }
  }
  return chainAccounts;
}

export async function deployReferralManagerFixture() {
  const [
    adminAccount,
    token1Holder,
    stakingRewardPool,
    token2Holder,
    referralRewardPool,
    ...restSigners
  ] = await ethers.getSigners();

  // Deploy Tokens
  const initialSupply = BigNumber.from(10).pow(18).mul(21_000_000);
  const token1 = await deployToken1({
    admin: adminAccount,
    initialSupply,
    initialHolder: token1Holder.address,
  });
  await token1
    .connect(token1Holder)
    .transfer(stakingRewardPool.address, initialSupply.div(100));

  const token2 = await deployToken2({
    admin: adminAccount,
    initialSupply,
    initialHolder: token2Holder.address,
  });
  await token2
    .connect(token2Holder)
    .transfer(referralRewardPool.address, initialSupply);

  // Deploy ReferralManager
  const referralLevels = 10;
  const fullSubscriptionCost = BigNumber.from(10).pow(18).mul(5);
  const levelSubscriptionCost = BigNumber.from(10).pow(18);

  const referralManager = await deployReferralManager({
    admin: adminAccount,
    fullSubscriptionCost,
    levelSubscriptionCost,
    token1Address: token1.address,
    token2,
    referralRewardPool,
  });

  // Deploy Staking contract
  const minStakeLimit = BigNumber.from(10).pow(17);
  const stakingPlans: StakingPlan[] = [
    {
      durationDays: 1,
      apr: 100,
      subscriptionCost: BigNumber.from(10).pow(18),
      subscriptionDurationDays: 365,
    },
    {
      durationDays: 3,
      apr: 300,
      subscriptionCost: BigNumber.from(10).pow(18),
      subscriptionDurationDays: 365,
    },
  ];

  const stakingContract = await deployStaking({
    admin: adminAccount,
    stakingPlans,
    token1,
    token2,
    stakingRewardPool,
    referralManager,
  });

  return {
    adminAccount,
    token1Holder,
    token2Holder,
    token1,
    token2,
    initialSupply,
    referralManager,
    fullSubscriptionCost,
    levelSubscriptionCost,
    referralLevels,
    stakingContract,
    stakingPlans,
    stakingRewardPool,
    referralRewardPool,
    restSigners,
    minStakeLimit,
  };
}
