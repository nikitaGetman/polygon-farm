import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Token1, Staking, Token2 } from "typechain-types";
import { time, mine } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { Address } from "hardhat-deploy/types";

export async function autoSubscribe(
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
  referrer = ethers.constants.AddressZero,
}: {
  acc: SignerWithAddress;
  adminAccount: SignerWithAddress;
  token1: Token1;
  token1Holder: SignerWithAddress;
  stakingContract: Staking;
  token2?: Token2;
  token2Holder?: SignerWithAddress;
  stakeAmount?: BigNumber;
  isToken2?: boolean;
  referrer?: Address;
}) {
  await autoSubscribe(acc, token1, token1Holder, stakingContract, adminAccount);

  const amount = stakeAmount || (await stakingContract.MIN_STAKE_LIMIT());
  if (isToken2 && token2 && token2Holder) {
    await token2.connect(token2Holder).transfer(acc.address, amount);
    await token2
      .connect(acc)
      .approve(stakingContract.address, ethers.constants.MaxUint256);
  } else {
    await token1.connect(token1Holder).transfer(acc.address, amount);
  }

  await stakingContract.connect(acc).deposit(amount, isToken2, referrer);
}

export async function waitForStakeFinished(days: number) {
  await time.setNextBlockTimestamp((await time.latest()) + days * 60 * 60 * 24);
  await mine();
}
