import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import {
  Staking__factory,
  Token1__factory,
  Token2__factory,
} from "typechain-types";

describe("Token 1", function () {
  async function deployFixture() {
    const initialSupply = BigNumber.from(10).pow(18).mul(21_000_000);
    const durationDays = 1;
    const rewardPercent = 100; // 10%

    const [
      adminAccount,
      token1Holder,
      rewardPool,
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
      .transfer(rewardPool.address, initialSupply);

    const token2 = await new Token2__factory(adminAccount).deploy(
      initialSupply,
      token2Holder.address
    );
    await token2.deployed();

    const stakingContract = await new Staking__factory(adminAccount).deploy(
      token1.address,
      token2.address,
      rewardPool.address,
      durationDays,
      rewardPercent
    );
    await stakingContract.deployed();

    await token1
      .connect(rewardPool)
      .approve(stakingContract.address, ethers.constants.MaxUint256);
    await token2
      .connect(adminAccount)
      .addToWhitelist([stakingContract.address]);

    return {
      stakingContract,
      token1,
      token2,
      initialSupply,
      adminAccount,
      token1Holder,
      token2Holder,
      restSigners,
      durationDays,
      rewardPercent,
    };
  }

  describe("Deploy", () => {
    it("Should deploy with correct initial data", async () => {
      const { stakingContract } = await loadFixture(deployFixture);

      expect(await stakingContract.isActive()).to.be.eq(false);
    });
  });

  // Deposit:
  // Withdraw:
  // Helpers:
  // Roles and Administration: change Activity can only admin / change settings can only Admin
  // Events: Staked / Claimed / ActivityChanged
});
