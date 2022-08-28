import {
  loadFixture,
  time,
  mine,
} from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import {
  Staking,
  Staking__factory,
  Token1,
  Token1__factory,
  Token2,
  Token2__factory,
} from "typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function autoSubscribe(
  acc: SignerWithAddress,
  token: Token1,
  tokenHolder: SignerWithAddress,
  stakingContract: Staking
) {
  await token
    .connect(tokenHolder)
    .transfer(acc.address, await stakingContract.subscriptionCost());
  await token
    .connect(acc)
    .approve(stakingContract.address, ethers.constants.MaxUint256);

  await stakingContract.connect(acc).subscribe();
}

async function autoStakeToken({
  acc,
  adminAccount,
  token1,
  token2,
  token1Holder,
  token2Holder,
  stakingContract,
  stakeAmount,
  isToken2 = false,
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
}) {
  await autoSubscribe(acc, token1, token1Holder, stakingContract);

  const amount = stakeAmount || (await stakingContract.MIN_STAKE_LIMIT());
  if (isToken2 && token2 && token2Holder) {
    await token2.connect(token2Holder).transfer(acc.address, amount);
    await token2
      .connect(acc)
      .approve(stakingContract.address, ethers.constants.MaxUint256);
  } else {
    await token1.connect(token1Holder).transfer(acc.address, amount);
  }

  await stakingContract.connect(adminAccount).setActive(true);
  await stakingContract.connect(acc).deposit(amount, isToken2);
}

async function waitForStakeFinished(days: number) {
  await time.setNextBlockTimestamp((await time.latest()) + days * 60 * 60 * 24);
  await mine();
}

describe("Staking", function () {
  async function deployFixture() {
    const initialSupply = BigNumber.from(10).pow(18).mul(21_000_000);
    const durationDays = 1;
    const rewardPercent = 100; // 10%
    const subscriptionCost = BigNumber.from(10).pow(18);
    const subscriptionPeriodDays = 10;
    const minStakeLimit = BigNumber.from(10).pow(17);

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
      .transfer(rewardPool.address, initialSupply.div(2));

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
      rewardPercent,
      subscriptionCost,
      subscriptionPeriodDays
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
      rewardPool,
      restSigners,
      durationDays,
      rewardPercent,
      subscriptionCost,
      subscriptionPeriodDays,
      minStakeLimit,
    };
  }

  //*
  describe("Deploy", () => {
    it("Should deploy with correct initial data", async () => {
      const {
        stakingContract,
        adminAccount,
        durationDays,
        rewardPercent,
        subscriptionCost,
        subscriptionPeriodDays,
      } = await loadFixture(deployFixture);

      expect(await stakingContract.isActive()).to.be.eq(false);

      const AdminRole = await stakingContract.DEFAULT_ADMIN_ROLE();
      expect(
        await stakingContract.hasRole(AdminRole, adminAccount.address)
      ).to.be.eq(true);

      const userData = await stakingContract.getContractInfo();
      expect(userData[0]).to.be.eq(BigNumber.from(durationDays));
      expect(userData[1]).to.be.eq(rewardPercent);
      expect(userData[2]).to.be.eq(false);
      expect(userData[3]).to.be.eq(BigNumber.from(0));
      expect(userData[4]).to.be.eq(BigNumber.from(0));
      expect(userData[5]).to.be.eq(BigNumber.from(0));
      expect(userData[6]).to.be.eq(BigNumber.from(0));
      expect(userData[7]).to.be.eq(BigNumber.from(0));
      expect(userData[8]).to.be.eq(subscriptionCost);
      expect(userData[9]).to.be.eq(BigNumber.from(subscriptionPeriodDays));
    });

    it("Should not deploy with incorrect initial data", async () => {
      const { token1, token2, rewardPool, adminAccount } = await loadFixture(
        deployFixture
      );

      const stakingContract = new Staking__factory(adminAccount);

      await expect(
        stakingContract.deploy(
          ethers.constants.AddressZero,
          token2.address,
          rewardPool.address,
          1,
          1,
          1,
          1
        )
      ).to.be.reverted;

      await expect(
        stakingContract.deploy(
          token1.address,
          ethers.constants.AddressZero,
          rewardPool.address,
          1,
          1,
          1,
          1
        )
      ).to.be.reverted;

      await expect(
        stakingContract.deploy(
          token1.address,
          token2.address,
          ethers.constants.AddressZero,
          1,
          1,
          1,
          1
        )
      ).to.be.reverted;

      await expect(
        stakingContract.deploy(
          token1.address,
          token2.address,
          rewardPool.address,
          0,
          1,
          1,
          1
        )
      ).to.be.reverted;

      await expect(
        stakingContract.deploy(
          token1.address,
          token2.address,
          rewardPool.address,
          1,
          0,
          1,
          1
        )
      ).to.be.reverted;

      await expect(
        stakingContract.deploy(
          token1.address,
          token2.address,
          rewardPool.address,
          1,
          1,
          0,
          1
        )
      ).to.be.reverted;

      await expect(
        stakingContract.deploy(
          token1.address,
          token2.address,
          rewardPool.address,
          1,
          1,
          1,
          0
        )
      ).to.be.reverted;
    });
  });

  describe("Subscription", () => {
    it("Should burn tokens on subscription", async () => {
      const {
        stakingContract,
        restSigners,
        token1Holder,
        token1,
        subscriptionCost,
      } = await loadFixture(deployFixture);

      const [acc1] = restSigners;

      expect(await stakingContract.connect(acc1)["isSubscriber()"]()).to.be.eq(
        false
      );

      await token1
        .connect(token1Holder)
        .transfer(acc1.address, subscriptionCost);
      await token1
        .connect(acc1)
        .approve(stakingContract.address, subscriptionCost);

      await stakingContract.connect(acc1).subscribe();
      expect(await stakingContract.connect(acc1)["isSubscriber()"]()).to.be.eq(
        true
      );

      expect(await token1.totalBurn()).to.be.eq(subscriptionCost);
    });

    it("Should be unsubscribed after period expires", async () => {
      const {
        stakingContract,
        restSigners,
        token1Holder,
        token1,
        subscriptionCost,
        subscriptionPeriodDays,
      } = await loadFixture(deployFixture);

      const [acc1] = restSigners;

      await token1
        .connect(token1Holder)
        .transfer(acc1.address, subscriptionCost);
      await token1
        .connect(acc1)
        .approve(stakingContract.address, subscriptionCost);

      await stakingContract.connect(acc1).subscribe();

      const currentTimestamp = await time.latest();
      await time.setNextBlockTimestamp(currentTimestamp + 100);
      await mine();

      expect(await stakingContract.connect(acc1)["isSubscriber()"]()).to.be.eq(
        true
      );

      await time.setNextBlockTimestamp(
        currentTimestamp - 1 + subscriptionPeriodDays * 60 * 60 * 24
      );
      await mine();
      expect(await stakingContract.connect(acc1)["isSubscriber()"]()).to.be.eq(
        true
      );

      await time.setNextBlockTimestamp(
        currentTimestamp + 1 + subscriptionPeriodDays * 60 * 60 * 24
      );
      await mine();
      expect(await stakingContract.connect(acc1)["isSubscriber()"]()).to.be.eq(
        false
      );
    });
  });

  describe("Deposit", () => {
    it("Should deposit only when active", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        restSigners,
        minStakeLimit,
      } = await loadFixture(deployFixture);

      const [acc1] = restSigners;

      await autoSubscribe(acc1, token1, token1Holder, stakingContract);
      await token1.connect(token1Holder).transfer(acc1.address, minStakeLimit);

      await expect(
        stakingContract.connect(acc1).deposit(10, false)
      ).to.be.revertedWith("Contract is not active");

      await stakingContract.connect(adminAccount).setActive(true);

      await expect(stakingContract.connect(acc1).deposit(minStakeLimit, false))
        .not.to.be.reverted;
    });

    it("Should deposit only for subscribers", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        restSigners,
        subscriptionCost,
        minStakeLimit,
      } = await loadFixture(deployFixture);

      const [acc1, acc2] = restSigners;

      await stakingContract.connect(adminAccount).setActive(true);

      await expect(
        stakingContract.connect(acc1).deposit(10, false)
      ).to.be.revertedWith("Subscribable: you are not subscribed");

      await token1
        .connect(token1Holder)
        .transfer(acc2.address, subscriptionCost.add(minStakeLimit));
      await token1
        .connect(acc2)
        .approve(stakingContract.address, subscriptionCost.add(minStakeLimit));

      await stakingContract.connect(acc2).subscribe();
      await expect(stakingContract.connect(acc2).deposit(minStakeLimit, false))
        .not.to.be.reverted;
    });

    it("Should deposit greater than min limit", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        restSigners,
        minStakeLimit,
      } = await loadFixture(deployFixture);

      const [acc1] = restSigners;

      await autoSubscribe(acc1, token1, token1Holder, stakingContract);
      await token1.connect(token1Holder).transfer(acc1.address, minStakeLimit);
      await stakingContract.connect(adminAccount).setActive(true);

      await expect(
        stakingContract.connect(acc1).deposit(minStakeLimit.sub(1), false)
      ).to.be.revertedWith("Stake amount less than minimum value");
      await expect(stakingContract.connect(acc1).deposit(minStakeLimit, false))
        .not.to.be.reverted;
    });

    it("Should deposit only if reward is enough", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        rewardPool,
        restSigners,
        minStakeLimit,
      } = await loadFixture(deployFixture);

      const [acc1, acc2] = restSigners;

      await autoSubscribe(acc1, token1, token1Holder, stakingContract);
      await token1.connect(token1Holder).transfer(acc1.address, minStakeLimit);
      await stakingContract.connect(adminAccount).setActive(true);

      const profit = await stakingContract.calculateStakeProfit(minStakeLimit);
      await token1
        .connect(rewardPool)
        .transfer(
          acc2.address,
          (await token1.balanceOf(rewardPool.address)).sub(profit).add(1)
        );

      await expect(
        stakingContract.connect(acc1).deposit(minStakeLimit, false)
      ).to.be.revertedWith("Not enough tokens for reward");

      await token1.connect(acc2).transfer(rewardPool.address, 1);
      await expect(stakingContract.connect(acc1).deposit(minStakeLimit, false))
        .not.to.be.reverted;
    });

    it("Should transfer token1 on deposit", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        rewardPool,
        token1Holder,
        restSigners,
        minStakeLimit,
      } = await loadFixture(deployFixture);

      const [acc] = restSigners;

      expect(await token1.balanceOf(stakingContract.address)).to.be.eq(0);

      const currentBalance = await token1.balanceOf(rewardPool.address);
      const profit = await stakingContract.calculateStakeProfit(minStakeLimit);

      await autoStakeToken({
        acc,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
      });

      expect(await token1.balanceOf(stakingContract.address)).to.be.eq(
        minStakeLimit.add(profit)
      );
      expect(await token1.balanceOf(rewardPool.address)).to.be.eq(
        currentBalance.sub(profit)
      );
    });

    it("Should burn token2 on deposit", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token2,
        rewardPool,
        token1Holder,
        token2Holder,
        restSigners,
        minStakeLimit,
      } = await loadFixture(deployFixture);

      const [acc] = restSigners;

      expect(await token1.balanceOf(stakingContract.address)).to.be.eq(0);

      const currentBalance = await token1.balanceOf(rewardPool.address);
      const profit = await stakingContract.calculateStakeProfit(minStakeLimit);

      await autoStakeToken({
        acc,
        token1,
        token1Holder,
        stakingContract,
        adminAccount,
        token2,
        token2Holder,
        isToken2: true,
      });

      expect(await token1.balanceOf(stakingContract.address)).to.be.eq(profit);
      expect(await token2.totalBurn()).to.be.eq(minStakeLimit);
      expect(await token1.balanceOf(rewardPool.address)).to.be.eq(
        currentBalance.sub(profit)
      );
    });

    it("Should update user info on deposit token1", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        restSigners,
        minStakeLimit,
      } = await loadFixture(deployFixture);

      const [acc] = restSigners;

      await autoStakeToken({
        acc,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
        stakeAmount: minStakeLimit.add(10),
      });
      await mine();
      await autoStakeToken({
        acc,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
        stakeAmount: minStakeLimit.mul(2),
      });

      const userData = await stakingContract.getUserInfo(acc.address);
      expect(userData[0]).to.be.eq(minStakeLimit.mul(3).add(10));
      expect(userData[1]).to.be.eq(BigNumber.from(0));
      expect(userData[2]).to.be.eq(BigNumber.from(0));
      expect(userData[3]).to.be.eq(true);
    });

    it("Should update user info on deposit token2", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        token2,
        token2Holder,
        restSigners,
        minStakeLimit,
      } = await loadFixture(deployFixture);

      const [acc] = restSigners;

      const params = {
        acc,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
        token2,
        token2Holder,
        isToken2: true,
      };

      await autoStakeToken({
        ...params,
        stakeAmount: minStakeLimit.add(10),
      });
      await mine();
      await autoStakeToken({
        ...params,
        stakeAmount: minStakeLimit.mul(2),
      });

      const userData = await stakingContract.getUserInfo(acc.address);
      expect(userData[0]).to.be.eq(BigNumber.from(0));
      expect(userData[1]).to.be.eq(minStakeLimit.mul(3).add(10));
      expect(userData[2]).to.be.eq(BigNumber.from(0));
      expect(userData[3]).to.be.eq(true);
    });

    it("Should update contract info on deposit", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        token2,
        token2Holder,
        restSigners,
        minStakeLimit,
      } = await loadFixture(deployFixture);

      const [acc] = restSigners;

      const params = {
        acc,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
        token2,
        token2Holder,
      };

      await autoStakeToken({
        ...params,
        stakeAmount: minStakeLimit.add(10),
      });
      await mine();
      await autoStakeToken({
        ...params,
        stakeAmount: minStakeLimit.mul(2),
      });
      await mine();
      await autoStakeToken({
        ...params,
        stakeAmount: minStakeLimit.add(20),
        isToken2: true,
      });
      await mine();
      await autoStakeToken({
        ...params,
        stakeAmount: minStakeLimit.mul(2),
        isToken2: true,
      });
      await mine();

      const userData = await stakingContract.getContractInfo();
      expect(userData[2]).to.be.eq(true);
      expect(userData[3]).to.be.eq(BigNumber.from(2));
      expect(userData[4]).to.be.eq(BigNumber.from(2));
      expect(userData[5]).to.be.eq(minStakeLimit.mul(3).add(10));
      expect(userData[6]).to.be.eq(minStakeLimit.mul(3).add(20));
      expect(userData[7]).to.be.eq(BigNumber.from(0));
    });
  });

  // */

  describe("Withdraw", () => {
    it("Should withdraw only with correct stake id", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        restSigners,
        durationDays,
      } = await loadFixture(deployFixture);

      const [acc] = restSigners;

      await autoSubscribe(acc, token1, token1Holder, stakingContract);

      await expect(stakingContract.connect(acc).withdraw(0)).to.be.revertedWith(
        "Invalid stake id"
      );

      await autoStakeToken({
        acc,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
      });
      await waitForStakeFinished(durationDays);

      await expect(stakingContract.connect(acc).withdraw(1)).to.be.revertedWith(
        "Invalid stake id"
      );

      await expect(stakingContract.connect(acc).withdraw(0)).not.to.be.reverted;
    });

    it("Should withdraw only when not claimed", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        restSigners,
        durationDays,
      } = await loadFixture(deployFixture);

      const [acc] = restSigners;

      await autoStakeToken({
        acc,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
      });
      await waitForStakeFinished(durationDays);

      await expect(stakingContract.connect(acc).withdraw(0)).not.to.be.reverted;
      await expect(stakingContract.connect(acc).withdraw(0)).to.be.revertedWith(
        "Stake is already claimed"
      );
    });

    it("Should withdraw only if time has passed", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        restSigners,
        durationDays,
      } = await loadFixture(deployFixture);

      const [acc] = restSigners;

      await autoStakeToken({
        acc,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
      });

      await mine();

      await expect(stakingContract.connect(acc).withdraw(0)).to.be.revertedWith(
        "Stake is not ready yet"
      );
      await waitForStakeFinished(durationDays);
      await expect(stakingContract.connect(acc).withdraw(0)).not.to.be.reverted;
    });

    it("Should withdraw correct amount for token 1", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        restSigners,
        durationDays,
        minStakeLimit,
      } = await loadFixture(deployFixture);

      const [acc] = restSigners;

      const reward = (
        await stakingContract.calculateStakeProfit(minStakeLimit)
      ).add(minStakeLimit);

      await autoStakeToken({
        acc,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
      });
      await mine();
      await waitForStakeFinished(durationDays);

      expect(await token1.balanceOf(acc.address)).to.be.eq(0);
      await stakingContract.connect(acc).withdraw(0);

      expect(await token1.balanceOf(acc.address)).to.be.eq(reward);
    });

    it("Should withdraw correct amount for token 2", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        token2,
        token2Holder,
        restSigners,
        durationDays,
        minStakeLimit,
      } = await loadFixture(deployFixture);

      const [acc] = restSigners;

      const reward = await stakingContract.calculateStakeProfit(minStakeLimit);

      await autoStakeToken({
        acc,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
        token2,
        token2Holder,
        isToken2: true,
      });
      await mine();
      await waitForStakeFinished(durationDays);

      expect(await token1.balanceOf(acc.address)).to.be.eq(0);
      await stakingContract.connect(acc).withdraw(0);

      expect(await token1.balanceOf(acc.address)).to.be.eq(reward);
    });

    it("Should update user and contract info on withdraw", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        token2,
        token2Holder,
        restSigners,
        durationDays,
        minStakeLimit,
      } = await loadFixture(deployFixture);

      const [acc] = restSigners;

      const params = {
        acc,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
        token2,
        token2Holder,
      };
      await autoStakeToken({
        ...params,
        stakeAmount: minStakeLimit.add(10),
      });
      await autoStakeToken({
        ...params,
        stakeAmount: minStakeLimit.mul(2),
      });
      await autoStakeToken({
        ...params,
        stakeAmount: minStakeLimit.add(10),
        isToken2: true,
      });

      await waitForStakeFinished(durationDays);

      const userStakes = await stakingContract.getUserStakes(acc.address);

      const profit = userStakes.reduce((acc, stake) => {
        if (stake.isToken2) {
          acc = acc.add(stake.profit);
        } else {
          acc = acc.add(stake.profit).add(stake.amount);
        }
        return acc;
      }, BigNumber.from(0));

      await stakingContract.connect(acc).withdraw(0);
      await stakingContract.connect(acc).withdraw(1);
      await stakingContract.connect(acc).withdraw(2);

      const userInfo = await stakingContract.getUserInfo(acc.address);
      expect(userInfo._totalStakedToken1).to.be.eq(
        minStakeLimit.mul(3).add(10)
      );
      expect(userInfo._totalStakedToken2).to.be.eq(minStakeLimit.add(10));
      expect(userInfo._totalClaimed).to.be.eq(profit);

      const contractInfo = await stakingContract.getContractInfo();
      expect(contractInfo._totalStakedToken1).to.be.eq(
        minStakeLimit.mul(3).add(10)
      );
      expect(contractInfo._totalStakedToken2).to.be.eq(minStakeLimit.add(10));
      expect(contractInfo._totalStakesToken1No).to.be.eq(2);
      expect(contractInfo._totalStakesToken2No).to.be.eq(1);
      expect(contractInfo._totalClaimed).to.be.eq(profit);
    });
  });

  // */

  describe("Roles / Administration", () => {
    it("Should change activity only by Admin", async () => {
      const { stakingContract, adminAccount, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, acc2] = restSigners;

      await expect(stakingContract.connect(acc1).setActive(true)).to.be
        .reverted;
      expect(await stakingContract.isActive()).to.be.eq(false);

      const AdminRole = await stakingContract.DEFAULT_ADMIN_ROLE();
      await stakingContract
        .connect(adminAccount)
        .grantRole(AdminRole, acc2.address);

      await expect(stakingContract.connect(acc2).setActive(true)).not.to.be
        .reverted;
      expect(await stakingContract.isActive()).to.be.eq(true);
      await stakingContract.connect(acc2).setActive(false);
      expect(await stakingContract.isActive()).to.be.eq(false);
    });
    // Roles and Administration: change Activity can only admin / change settings can only Admin
  });

  describe("Events", () => {
    it("Should emit ActivityChanged", async () => {
      const { stakingContract, adminAccount } = await loadFixture(
        deployFixture
      );

      await expect(stakingContract.connect(adminAccount).setActive(true))
        .to.emit(stakingContract, "ActivityChanged")
        .withArgs(true, adminAccount.address);

      await expect(stakingContract.connect(adminAccount).setActive(false))
        .to.emit(stakingContract, "ActivityChanged")
        .withArgs(false, adminAccount.address);
    });

    it("Should emit Staked", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        token2,
        token2Holder,
        restSigners,
        minStakeLimit,
      } = await loadFixture(deployFixture);

      const [acc] = restSigners;
      await autoSubscribe(acc, token1, token1Holder, stakingContract);
      await stakingContract.connect(adminAccount).setActive(true);

      await token1
        .connect(token1Holder)
        .transfer(acc.address, minStakeLimit.mul(10));

      let profit = await stakingContract.calculateStakeProfit(
        minStakeLimit.add(10)
      );
      let timestamp = (await time.latest()) + 10;
      await time.setNextBlockTimestamp(timestamp);

      await expect(
        stakingContract.connect(acc).deposit(minStakeLimit.add(10), false)
      )
        .to.emit(stakingContract, "Staked")
        .withArgs(
          acc.address,
          0,
          minStakeLimit.add(10),
          profit,
          false,
          timestamp
        );

      profit = await stakingContract.calculateStakeProfit(minStakeLimit.mul(3));
      timestamp = (await time.latest()) + 10;
      await time.setNextBlockTimestamp(timestamp);
      await expect(
        stakingContract.connect(acc).deposit(minStakeLimit.mul(3), false)
      )
        .to.emit(stakingContract, "Staked")
        .withArgs(
          acc.address,
          1,
          minStakeLimit.mul(3),
          profit,
          false,
          timestamp
        );

      await token2.connect(token2Holder).transfer(acc.address, minStakeLimit);
      await token2
        .connect(acc)
        .approve(stakingContract.address, ethers.constants.MaxUint256);

      profit = await stakingContract.calculateStakeProfit(minStakeLimit);
      timestamp = (await time.latest()) + 10;
      await time.setNextBlockTimestamp(timestamp);
      await expect(stakingContract.connect(acc).deposit(minStakeLimit, true))
        .to.emit(stakingContract, "Staked")
        .withArgs(acc.address, 2, minStakeLimit, profit, true, timestamp);
    });

    it("Should emit Claimed", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        token2,
        token2Holder,
        restSigners,
        minStakeLimit,
        durationDays,
      } = await loadFixture(deployFixture);

      const [acc] = restSigners;

      const params = {
        acc,
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        token2,
        token2Holder,
      };
      await autoStakeToken({ ...params, stakeAmount: minStakeLimit });
      await autoStakeToken({ ...params, stakeAmount: minStakeLimit.mul(10) });
      await autoStakeToken({
        ...params,
        stakeAmount: minStakeLimit.add(100),
        isToken2: true,
      });
      await waitForStakeFinished(durationDays);

      let profit = await stakingContract.calculateStakeProfit(minStakeLimit);
      let timestamp = (await time.latest()) + 10;
      await time.setNextBlockTimestamp(timestamp);
      await expect(stakingContract.connect(acc).withdraw(0))
        .to.emit(stakingContract, "Claimed")
        .withArgs(acc.address, 0, minStakeLimit.add(profit), false, timestamp);

      profit = await stakingContract.calculateStakeProfit(
        minStakeLimit.mul(10)
      );
      timestamp = (await time.latest()) + 10;
      await time.setNextBlockTimestamp(timestamp);
      await expect(stakingContract.connect(acc).withdraw(1))
        .to.emit(stakingContract, "Claimed")
        .withArgs(
          acc.address,
          1,
          minStakeLimit.mul(10).add(profit),
          false,
          timestamp
        );

      profit = await stakingContract.calculateStakeProfit(
        minStakeLimit.add(100)
      );
      timestamp = (await time.latest()) + 10;
      await time.setNextBlockTimestamp(timestamp);
      await expect(stakingContract.connect(acc).withdraw(2))
        .to.emit(stakingContract, "Claimed")
        .withArgs(acc.address, 2, profit, true, timestamp);
    });
  });

  describe("Helpers", () => {
    // Helpers: Should return only active stakes
  });
});
