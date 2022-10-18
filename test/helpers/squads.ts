import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SQUADS } from "config";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { Squads, Token1 } from "typechain-types";
import {
  deployReferralManager,
  deploySquads,
  deployStaking,
  deployToken1,
  deployToken2,
} from "./deployments";
import { STAKING_PLANS } from "./staking";

type SubscribeParams = {
  token: Token1;
  tokenHolder: SignerWithAddress;
  account: SignerWithAddress;
  squadsManager: Squads;
  planId: number;
};
export async function autoSubscribeToSquad({
  token,
  tokenHolder,
  account,
  squadsManager,
  planId,
}: SubscribeParams) {
  const { subscriptionCost } = SQUADS[planId];

  await token.connect(tokenHolder).transfer(account.address, subscriptionCost);
  await token.connect(account).approve(squadsManager.address, subscriptionCost);

  await squadsManager.connect(account).subscribe(planId);
}

export async function deploySquadsFixture() {
  const initialSupply = BigNumber.from(10).pow(18).mul(21_000_000);

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
    stakingPlans: STAKING_PLANS,
    token1,
    token2,
    stakingRewardPool,
    referralManager,
  });

  const squadsManager = await deploySquads({
    admin: adminAccount,
    token1Address: token1.address,
    referralManager,
    stakingContract,
    squads: SQUADS,
  });

  return {
    squads: SQUADS,
    squadsManager,
    adminAccount,
    token1Holder,
    stakingRewardPool,
    token2Holder,
    referralManager,
    token1,
    token2,
    stakingContract,
    restSigners,
  };
}
