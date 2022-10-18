import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import {
  ReferralManager,
  ReferralManager__factory,
  Squads__factory,
  Staking,
  Staking__factory,
  Token1,
  Token1__factory,
  Token2,
  Token2__factory,
} from "typechain-types";
import { SquadPlan, StakingPlan } from "types";

type DeployTokenProps = {
  admin: SignerWithAddress;
  initialSupply: number | BigNumber;
  initialHolder: string;
};
export async function deployToken1({
  admin,
  initialSupply,
  initialHolder,
}: DeployTokenProps) {
  const token = await new Token1__factory(admin).deploy(
    initialSupply,
    initialHolder
  );
  await token.deployed();

  return token;
}

export async function deployToken2({
  admin,
  initialSupply,
  initialHolder,
}: DeployTokenProps) {
  const token = await new Token2__factory(admin).deploy(
    initialSupply,
    initialHolder
  );
  await token.deployed();

  return token;
}

type DeployReferralManagerProps = {
  admin: SignerWithAddress;
  fullSubscriptionCost: number | BigNumber;
  levelSubscriptionCost: number | BigNumber;
  token1Address: string;
  token2: Token2;
  referralRewardPool: SignerWithAddress;
};
export async function deployReferralManager({
  admin,
  fullSubscriptionCost,
  levelSubscriptionCost,
  token1Address,
  token2,
  referralRewardPool,
}: DeployReferralManagerProps) {
  const referralManager = await new ReferralManager__factory(admin).deploy(
    token1Address,
    token2.address,
    referralRewardPool.address,
    fullSubscriptionCost,
    levelSubscriptionCost
  );
  await referralManager.deployed();

  // Add Approves
  await token2
    .connect(referralRewardPool)
    .approve(referralManager.address, ethers.constants.MaxUint256);
  await token2.connect(admin).addToWhitelist([referralRewardPool.address]);

  return referralManager;
}

type DeployStakingProps = {
  admin: SignerWithAddress;
  stakingPlans: StakingPlan[];
  token1: Token1;
  token2: Token2;
  stakingRewardPool: SignerWithAddress;
  referralManager: ReferralManager;
  squadsManagerAddress?: string;
};
export async function deployStaking({
  admin,
  stakingPlans,
  token1,
  token2,
  stakingRewardPool,
  referralManager,
  squadsManagerAddress = ethers.constants.AddressZero,
}: DeployStakingProps) {
  const staking = await new Staking__factory(admin).deploy(
    token1.address,
    token2.address,
    stakingRewardPool.address,
    referralManager.address,
    squadsManagerAddress
  );
  await staking.deployed();

  await token1
    .connect(stakingRewardPool)
    .approve(staking.address, ethers.constants.MaxUint256);
  await token2.connect(admin).addToWhitelist([staking.address]);
  await referralManager.connect(admin).authorizeContract(staking.address);

  for (let i = 0; i < stakingPlans.length; i++) {
    await staking.addStakingPlan(
      stakingPlans[i].subscriptionCost,
      stakingPlans[i].subscriptionDurationDays,
      stakingPlans[i].durationDays,
      stakingPlans[i].rewardPercent
    );
  }

  return staking;
}

type DeploySquadsProps = {
  admin: SignerWithAddress;
  token1Address: string;
  referralManager: ReferralManager;
  stakingContract: Staking;
  squads: SquadPlan[];
};
export async function deploySquads({
  admin,
  token1Address,
  referralManager,
  stakingContract,
  squads,
}: DeploySquadsProps) {
  const squadsManager = await new Squads__factory(admin).deploy(
    token1Address,
    referralManager.address,
    stakingContract.address
  );
  await squadsManager.deployed();

  for (let i = 0; i < squads.length; i++) {
    const {
      subscriptionCost,
      reward,
      stakingThreshold,
      squadSize,
      stakingPlanId,
    } = squads[i];

    await squadsManager
      .connect(admin)
      .addPlan(
        subscriptionCost,
        reward,
        stakingThreshold,
        squadSize,
        stakingPlanId
      );
  }

  await stakingContract
    .connect(admin)
    .updateSquadsManager(squadsManager.address);
  await referralManager.connect(admin).authorizeContract(squadsManager.address);

  return squadsManager;
}
