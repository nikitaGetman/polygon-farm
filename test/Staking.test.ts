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
        adminAccount,
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

      // Should subscribe only when staking active
      await expect(
        stakingContract.connect(acc1).subscribe()
      ).to.be.revertedWith("Contract is not active");

      await stakingContract.connect(adminAccount).setActive(true);
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
        adminAccount,
      } = await loadFixture(deployFixture);

      const [acc1] = restSigners;

      await token1
        .connect(token1Holder)
        .transfer(acc1.address, subscriptionCost);
      await token1
        .connect(acc1)
        .approve(stakingContract.address, subscriptionCost);

      await stakingContract.connect(adminAccount).setActive(true);
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

      await autoSubscribe(
        acc1,
        token1,
        token1Holder,
        stakingContract,
        adminAccount
      );
      await stakingContract.connect(adminAccount).setActive(false);
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

      await autoSubscribe(
        acc1,
        token1,
        token1Holder,
        stakingContract,
        adminAccount
      );
      await token1.connect(token1Holder).transfer(acc1.address, minStakeLimit);

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

      await autoSubscribe(
        acc1,
        token1,
        token1Holder,
        stakingContract,
        adminAccount
      );
      await token1.connect(token1Holder).transfer(acc1.address, minStakeLimit);

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
        if (!stake.isClaimed) {
          if (stake.isToken2) {
            acc = acc.add(stake.profit);
          } else {
            acc = acc.add(stake.profit).add(stake.amount);
          }
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

  // *

  describe("Roles / Administration", () => {
    it("Should update activity only by Admin", async () => {
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

    it("Should update reward pool only by Admin", async () => {
      const { stakingContract, adminAccount, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, acc2, newPool] = restSigners;

      await expect(
        stakingContract.connect(acc1).updateRewardPool(newPool.address)
      ).to.be.reverted;

      const AdminRole = await stakingContract.DEFAULT_ADMIN_ROLE();
      await stakingContract
        .connect(adminAccount)
        .grantRole(AdminRole, acc2.address);

      await expect(
        stakingContract.connect(acc2).updateRewardPool(newPool.address)
      ).not.to.be.reverted;
    });

    it("Should update token 1 only by Admin", async () => {
      const { stakingContract, adminAccount, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, acc2, newToken] = restSigners;

      await expect(stakingContract.connect(acc1).updateToken1(newToken.address))
        .to.be.reverted;

      const AdminRole = await stakingContract.DEFAULT_ADMIN_ROLE();
      await stakingContract
        .connect(adminAccount)
        .grantRole(AdminRole, acc2.address);

      await expect(stakingContract.connect(acc2).updateToken1(newToken.address))
        .not.to.be.reverted;

      expect(await stakingContract.token1()).to.be.eq(newToken.address);
    });

    it("Should update token 2 only by Admin", async () => {
      const { stakingContract, adminAccount, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, acc2, newToken] = restSigners;

      await expect(stakingContract.connect(acc1).updateToken2(newToken.address))
        .to.be.reverted;

      const AdminRole = await stakingContract.DEFAULT_ADMIN_ROLE();
      await stakingContract
        .connect(adminAccount)
        .grantRole(AdminRole, acc2.address);

      await expect(stakingContract.connect(acc2).updateToken2(newToken.address))
        .not.to.be.reverted;

      expect(await stakingContract.token2()).to.be.eq(newToken.address);
    });

    it("Should update percent divider only by Admin", async () => {
      const { stakingContract, adminAccount, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, acc2] = restSigners;

      await expect(stakingContract.connect(acc1).updatePercentDivider(10)).to.be
        .reverted;

      const AdminRole = await stakingContract.DEFAULT_ADMIN_ROLE();
      await stakingContract
        .connect(adminAccount)
        .grantRole(AdminRole, acc2.address);

      await expect(stakingContract.connect(acc2).updatePercentDivider(10000))
        .not.to.be.reverted;

      expect(await stakingContract.PERCENTS_DIVIDER()).to.be.eq(10000);
    });

    it("Should update time step only by Admin", async () => {
      const { stakingContract, adminAccount, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, acc2] = restSigners;

      await expect(stakingContract.connect(acc1).updateTimeStep(500)).to.be
        .reverted;

      const AdminRole = await stakingContract.DEFAULT_ADMIN_ROLE();
      await stakingContract
        .connect(adminAccount)
        .grantRole(AdminRole, acc2.address);

      await expect(stakingContract.connect(acc2).updateTimeStep(2500)).not.to.be
        .reverted;

      expect(await stakingContract.TIME_STEP()).to.be.eq(2500);
    });

    it("Should update min stake limit only by Admin", async () => {
      const { stakingContract, adminAccount, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, acc2] = restSigners;

      await expect(stakingContract.connect(acc1).updateMinStakeLimit(500)).to.be
        .reverted;

      const AdminRole = await stakingContract.DEFAULT_ADMIN_ROLE();
      await stakingContract
        .connect(adminAccount)
        .grantRole(AdminRole, acc2.address);

      await expect(stakingContract.connect(acc2).updateMinStakeLimit(2500)).not
        .to.be.reverted;

      expect(await stakingContract.MIN_STAKE_LIMIT()).to.be.eq(2500);
    });

    it("Should update duration days only by Admin", async () => {
      const { stakingContract, adminAccount, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, acc2] = restSigners;

      await expect(stakingContract.connect(acc1).updateDurationDays(5)).to.be
        .reverted;

      const AdminRole = await stakingContract.DEFAULT_ADMIN_ROLE();
      await stakingContract
        .connect(adminAccount)
        .grantRole(AdminRole, acc2.address);

      await expect(stakingContract.connect(acc2).updateDurationDays(100)).not.to
        .be.reverted;

      expect(await stakingContract.durationDays()).to.be.eq(100);
    });

    it("Should update reward only by Admin", async () => {
      const { stakingContract, adminAccount, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, acc2] = restSigners;

      await expect(stakingContract.connect(acc1).updateReward(5)).to.be
        .reverted;

      const AdminRole = await stakingContract.DEFAULT_ADMIN_ROLE();
      await stakingContract
        .connect(adminAccount)
        .grantRole(AdminRole, acc2.address);

      await expect(stakingContract.connect(acc2).updateReward(100)).not.to.be
        .reverted;

      expect(await stakingContract.reward()).to.be.eq(100);
    });

    it("Should update subscription cost only by Admin", async () => {
      const { stakingContract, adminAccount, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, acc2] = restSigners;

      await expect(stakingContract.connect(acc1).updateSubscriptionCost(5)).to
        .be.reverted;

      const AdminRole = await stakingContract.DEFAULT_ADMIN_ROLE();
      await stakingContract
        .connect(adminAccount)
        .grantRole(AdminRole, acc2.address);

      await expect(stakingContract.connect(acc2).updateSubscriptionCost(100))
        .not.to.be.reverted;

      expect(await stakingContract.subscriptionCost()).to.be.eq(100);
    });

    it("Should update subscription period only by Admin", async () => {
      const { stakingContract, adminAccount, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, acc2] = restSigners;

      await expect(stakingContract.connect(acc1).updateSubscriptionPeriod(5)).to
        .be.reverted;

      const AdminRole = await stakingContract.DEFAULT_ADMIN_ROLE();
      await stakingContract
        .connect(adminAccount)
        .grantRole(AdminRole, acc2.address);

      await expect(stakingContract.connect(acc2).updateSubscriptionPeriod(100))
        .not.to.be.reverted;

      expect(await stakingContract.subscriptionPeriodDays()).to.be.eq(100);
    });

    it("Should update subscription token only by Admin", async () => {
      const { stakingContract, adminAccount, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, acc2, newToken] = restSigners;

      await expect(
        stakingContract.connect(acc1).updateSubscriptionToken(newToken.address)
      ).to.be.reverted;

      const AdminRole = await stakingContract.DEFAULT_ADMIN_ROLE();
      await stakingContract
        .connect(adminAccount)
        .grantRole(AdminRole, acc2.address);

      await expect(
        stakingContract.connect(acc2).updateSubscriptionToken(newToken.address)
      ).not.to.be.reverted;

      expect(await stakingContract.subscriptionToken()).to.be.eq(
        newToken.address
      );
    });
  });

  // */

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
      await autoSubscribe(
        acc,
        token1,
        token1Holder,
        stakingContract,
        adminAccount
      );

      await token1
        .connect(token1Holder)
        .transfer(acc.address, minStakeLimit.mul(10));

      let profit = await stakingContract.calculateStakeProfit(
        minStakeLimit.add(10)
      );
      let timestamp = (await time.latest()) + 100;
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
      timestamp = (await time.latest()) + 100;
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
      timestamp = (await time.latest()) + 100;
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
      let timestamp = (await time.latest()) + 1000;
      await time.setNextBlockTimestamp(timestamp);
      await expect(stakingContract.connect(acc).withdraw(0))
        .to.emit(stakingContract, "Claimed")
        .withArgs(acc.address, 0, minStakeLimit.add(profit), false, timestamp);

      profit = await stakingContract.calculateStakeProfit(
        minStakeLimit.mul(10)
      );
      timestamp = (await time.latest()) + 1000;
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
      timestamp = (await time.latest()) + 1000;
      await time.setNextBlockTimestamp(timestamp);
      await expect(stakingContract.connect(acc).withdraw(2))
        .to.emit(stakingContract, "Claimed")
        .withArgs(acc.address, 2, profit, true, timestamp);
    });
  });

  describe("Helpers", () => {
    // getUserStakes
    it("Should return correct user stakes", async () => {
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
        rewardPercent,
      } = await loadFixture(deployFixture);

      const [acc] = restSigners;

      const startTime = await time.latest();
      const endTime = startTime + durationDays * 3600 * 24;

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
        stakeAmount: minStakeLimit.add(50),
        isToken2: true,
      });

      await waitForStakeFinished(durationDays);
      await stakingContract.connect(acc).withdraw(1);

      const userStakes = await stakingContract.getUserStakes(acc.address);

      let profit = await stakingContract.calculateStakeProfit(
        minStakeLimit.add(10)
      );
      expect(userStakes[0].stakeId).to.be.eq(0);
      expect(userStakes[0].amount).to.be.eq(minStakeLimit.add(10));
      expect(userStakes[0].timeStart)
        .to.be.greaterThan(startTime)
        .and.be.lessThan(startTime + 1000);
      expect(userStakes[0].timeEnd)
        .to.be.greaterThan(endTime)
        .and.be.lessThan(endTime + 1000);
      expect(userStakes[0].percent).to.be.eq(rewardPercent);
      expect(userStakes[0].profit).to.be.eq(profit);
      expect(userStakes[0].isToken2).to.be.eq(false);
      expect(userStakes[0].isClaimed).to.be.eq(false);

      profit = await stakingContract.calculateStakeProfit(minStakeLimit.mul(2));
      expect(userStakes[1].stakeId).to.be.eq(1);
      expect(userStakes[1].amount).to.be.eq(minStakeLimit.mul(2));
      expect(userStakes[1].timeStart)
        .to.be.greaterThan(startTime)
        .and.be.lessThan(startTime + 1000);
      expect(userStakes[1].timeEnd)
        .to.be.greaterThan(endTime)
        .and.be.lessThan(endTime + 1000);
      expect(userStakes[1].percent).to.be.eq(rewardPercent);
      expect(userStakes[1].profit).to.be.eq(profit);
      expect(userStakes[1].isToken2).to.be.eq(false);
      expect(userStakes[1].isClaimed).to.be.eq(true);

      profit = await stakingContract.calculateStakeProfit(
        minStakeLimit.add(50)
      );
      expect(userStakes[2].stakeId).to.be.eq(2);
      expect(userStakes[2].amount).to.be.eq(minStakeLimit.add(50));
      expect(userStakes[2].timeStart)
        .to.be.greaterThan(startTime)
        .and.be.lessThan(startTime + 1000);
      expect(userStakes[2].timeEnd)
        .to.be.greaterThan(endTime)
        .and.be.lessThan(endTime + 1000);
      expect(userStakes[2].percent).to.be.eq(rewardPercent);
      expect(userStakes[2].profit).to.be.eq(profit);
      expect(userStakes[2].isToken2).to.be.eq(true);
      expect(userStakes[2].isClaimed).to.be.eq(false);
    });
    // getTimestamp
    it("Should return correct timestamp", async () => {
      const { stakingContract } = await loadFixture(deployFixture);

      const nextTime = (await time.latest()) + 100;
      await time.setNextBlockTimestamp(nextTime);
      await mine();

      expect(await stakingContract.getTimestamp()).to.be.eq(nextTime);
    });
    // calculateStakeProfit
    it("Should return correct stake profit", async () => {
      const { stakingContract, rewardPercent } = await loadFixture(
        deployFixture
      );

      const amount = BigNumber.from(345_987_000_000);
      const percentsDivider = await stakingContract.PERCENTS_DIVIDER();
      const profit = await stakingContract.calculateStakeProfit(amount);
      const expectedProfit = amount.mul(rewardPercent).div(percentsDivider);
      expect(profit).to.be.eq(expectedProfit);
    });
    // calculateStakeReward
    it("Should return correct stake reward for token 1", async () => {
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

      await expect(
        stakingContract.calculateStakeReward(acc.address, 0)
      ).to.be.revertedWithPanic(50);

      const params = {
        acc,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
      };
      await autoStakeToken({
        ...params,
        stakeAmount: minStakeLimit,
      });

      // Wrong stake id
      await expect(
        stakingContract.calculateStakeReward(acc.address, 1)
      ).to.be.revertedWithPanic(50);

      const stakes = await stakingContract.getUserStakes(acc.address);
      const [stake] = stakes;

      // Just now
      const profit = await stakingContract.calculateStakeProfit(minStakeLimit);
      let expectedReward = BigNumber.from(await time.latest())
        .sub(stake.timeStart)
        .mul(minStakeLimit.add(profit))
        .div(stake.timeEnd.sub(stake.timeStart));
      expect(
        await stakingContract.calculateStakeReward(acc.address, 0)
      ).to.be.eq(expectedReward);

      // A bit later
      await time.setNextBlockTimestamp((await time.latest()) + 10000);
      await mine();

      expectedReward = BigNumber.from(await time.latest())
        .sub(stake.timeStart)
        .mul(minStakeLimit.add(profit))
        .div(stake.timeEnd.sub(stake.timeStart));

      expect(
        await stakingContract.calculateStakeReward(acc.address, 0)
      ).to.be.eq(expectedReward);

      // After ending
      await waitForStakeFinished(durationDays);
      await time.setNextBlockTimestamp((await time.latest()) + 10000);
      await mine();

      expect(
        await stakingContract.calculateStakeReward(acc.address, 0)
      ).to.be.eq(minStakeLimit.add(profit));

      // Claimed
      await stakingContract.connect(acc).withdraw(0);
      expect(
        await stakingContract.calculateStakeReward(acc.address, 0)
      ).to.be.eq(0);
    });

    it("Should return correct stake reward for token 1", async () => {
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

      await expect(
        stakingContract.calculateStakeReward(acc.address, 0)
      ).to.be.revertedWithPanic(50);

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
        stakeAmount: minStakeLimit,
        isToken2: true,
      });

      // Wrong stake id
      await expect(
        stakingContract.calculateStakeReward(acc.address, 1)
      ).to.be.revertedWithPanic(50);

      const stakes = await stakingContract.getUserStakes(acc.address);
      const [stake] = stakes;

      // Just now
      const profit = await stakingContract.calculateStakeProfit(minStakeLimit);
      let expectedReward = BigNumber.from(await time.latest())
        .sub(stake.timeStart)
        .mul(profit)
        .div(stake.timeEnd.sub(stake.timeStart));
      expect(
        await stakingContract.calculateStakeReward(acc.address, 0)
      ).to.be.eq(expectedReward);

      // A bit later
      await time.setNextBlockTimestamp((await time.latest()) + 10000);
      await mine();

      expectedReward = BigNumber.from(await time.latest())
        .sub(stake.timeStart)
        .mul(profit)
        .div(stake.timeEnd.sub(stake.timeStart));

      expect(
        await stakingContract.calculateStakeReward(acc.address, 0)
      ).to.be.eq(expectedReward);

      // After ending
      await waitForStakeFinished(durationDays);
      await time.setNextBlockTimestamp((await time.latest()) + 10000);
      await mine();

      expect(
        await stakingContract.calculateStakeReward(acc.address, 0)
      ).to.be.eq(profit);

      // Claimed
      await stakingContract.connect(acc).withdraw(0);
      expect(
        await stakingContract.calculateStakeReward(acc.address, 0)
      ).to.be.eq(0);
    });
  });
});
