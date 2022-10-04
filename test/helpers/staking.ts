import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  Token1,
  Staking,
  Token2,
  Token1__factory,
  Token2__factory,
  ReferralManager__factory,
  Staking__factory,
} from "typechain-types";
import { time, mine } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

export async function autoSubscribeToStaking(
  acc: SignerWithAddress,
  token: Token1,
  tokenHolder: SignerWithAddress,
  stakingContract: Staking,
  adminAccount: SignerWithAddress
) {
  await token
    .connect(tokenHolder)
    .transfer(acc.address, await stakingContract.subscriptionCost());
  await token
    .connect(acc)
    .approve(stakingContract.address, ethers.constants.MaxUint256);

  await stakingContract.connect(adminAccount).setActive(true);
  await stakingContract.connect(acc).subscribe();
}

export type StakeTokenParams = {
  acc: SignerWithAddress;
  adminAccount: SignerWithAddress;
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
  acc,
  adminAccount,
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
    acc,
    token1,
    token1Holder,
    stakingContract,
    adminAccount
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
      amount,
      isToken2,
      referrer?.address || ethers.constants.AddressZero
    );
}

export async function waitForStakeFinished(days: number) {
  await time.setNextBlockTimestamp((await time.latest()) + days * 60 * 60 * 24);
  await mine();
}

export async function deployStaking() {
  const initialSupply = BigNumber.from(10).pow(18).mul(21_000_000);
  const durationDays = 1;
  const rewardPercent = 100; // 10%
  const subscriptionCost = BigNumber.from(10).pow(18);
  const subscriptionPeriodDays = 10;
  const minStakeLimit = BigNumber.from(10).pow(17);

  const [
    adminAccount,
    token1Holder,
    stakingRewardPool,
    token2Holder,
    ...restSigners
  ] = await ethers.getSigners();

  const token1 = await new Token1__factory(adminAccount).deploy(
    initialSupply,
    token1Holder.address
  );
  await token1.deployed();
  await token1
    .connect(token1Holder)
    .transfer(stakingRewardPool.address, initialSupply.div(2));

  const token2 = await new Token2__factory(adminAccount).deploy(
    initialSupply,
    token2Holder.address
  );
  await token2.deployed();

  const referralManager = await new ReferralManager__factory(
    adminAccount
  ).deploy(
    token1.address,
    token2.address,
    token2Holder.address,
    BigNumber.from(10).pow(18).mul(5),
    BigNumber.from(10).pow(18)
  );
  await referralManager.deployed();

  const stakingContract = await new Staking__factory(adminAccount).deploy(
    token1.address,
    token2.address,
    stakingRewardPool.address,
    referralManager.address,
    ethers.constants.AddressZero,
    durationDays,
    rewardPercent,
    subscriptionCost,
    subscriptionPeriodDays
  );
  await stakingContract.deployed();

  await token1
    .connect(stakingRewardPool)
    .approve(stakingContract.address, ethers.constants.MaxUint256);
  await token2.connect(adminAccount).addToWhitelist([stakingContract.address]);

  await referralManager
    .connect(adminAccount)
    .authorizeContract(stakingContract.address);

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
    durationDays,
    rewardPercent,
    subscriptionCost,
    subscriptionPeriodDays,
    minStakeLimit,
  };
}
