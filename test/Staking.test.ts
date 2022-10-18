import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { Staking__factory } from "typechain-types";
import {
  autoStakeToken,
  autoSubscribeToStaking,
  deployStakingFixture,
  grantAdminRole,
  waitForStakeFinished,
} from "./helpers";
import { StakingPlan } from "types";

describe("Staking", function () {
  //*
  describe("Deploy", () => {
    it("Should deploy with correct initial data", async () => {
      const { stakingContract, adminAccount, stakingPlans } = await loadFixture(
        deployStakingFixture
      );

      const contractData = await stakingContract.getContractInfo();
      const firstPlanData = contractData[0];

      expect(firstPlanData.isActive).to.eq(true);
      expect(firstPlanData.stakingDuration).to.eq(
        BigNumber.from(stakingPlans[0].durationDays)
      );
      expect(firstPlanData.profitPercent).to.eq(stakingPlans[0].rewardPercent);
      expect(firstPlanData.totalStakedToken1).to.eq(BigNumber.from(0));
      expect(firstPlanData.totalStakedToken2).to.eq(BigNumber.from(0));
      expect(firstPlanData.totalStakesToken1No).to.eq(BigNumber.from(0));
      expect(firstPlanData.totalStakesToken2No).to.eq(BigNumber.from(0));
      expect(firstPlanData.totalClaimed).to.eq(BigNumber.from(0));
      expect(firstPlanData.subscriptionCost).to.eq(
        stakingPlans[0].subscriptionCost
      );
      expect(firstPlanData.subscriptionDuration).to.eq(
        BigNumber.from(stakingPlans[0].subscriptionDurationDays)
      );

      const AdminRole = await stakingContract.DEFAULT_ADMIN_ROLE();
      expect(
        await stakingContract.hasRole(AdminRole, adminAccount.address)
      ).to.eq(true);
    });

    it("Should not deploy with incorrect initial data", async () => {
      const {
        token1,
        token2,
        stakingRewardPool,
        adminAccount,
        referralManager,
      } = await loadFixture(deployStakingFixture);

      const stakingContract = new Staking__factory(adminAccount);

      await expect(
        stakingContract.deploy(
          ethers.constants.AddressZero,
          token2.address,
          stakingRewardPool.address,
          referralManager.address,
          ethers.constants.AddressZero
        )
      ).to.be.reverted;

      await expect(
        stakingContract.deploy(
          token1.address,
          ethers.constants.AddressZero,
          stakingRewardPool.address,
          referralManager.address,
          ethers.constants.AddressZero
        )
      ).to.be.reverted;

      await expect(
        stakingContract.deploy(
          token1.address,
          token2.address,
          ethers.constants.AddressZero,
          referralManager.address,
          ethers.constants.AddressZero
        )
      ).to.be.reverted;

      await expect(
        stakingContract.deploy(
          token1.address,
          token2.address,
          stakingRewardPool.address,
          ethers.constants.AddressZero,
          ethers.constants.AddressZero
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
        stakingPlans,
        adminAccount,
      } = await loadFixture(deployStakingFixture);

      let stakingPlan = stakingPlans[0];
      const [acc1] = restSigners;

      expect(await stakingContract.hasSubscription(0, acc1.address)).to.eq(
        false
      );

      await token1
        .connect(token1Holder)
        .transfer(acc1.address, stakingPlan.subscriptionCost);
      await token1
        .connect(acc1)
        .approve(stakingContract.address, stakingPlan.subscriptionCost);

      // Should subscribe only when staking active
      await stakingContract.connect(adminAccount).updatePlanActivity(0, false);

      await expect(
        stakingContract.connect(acc1).subscribe(0)
      ).to.be.revertedWith("Staking plan is not active");

      await stakingContract.connect(adminAccount).updatePlanActivity(0, true);
      await expect(stakingContract.connect(acc1).subscribe(0))
        .to.emit(stakingContract, "Subscribed")
        .withArgs(acc1.address, 0);
      expect(await stakingContract.hasSubscription(0, acc1.address)).to.eq(
        true
      );

      expect(await token1.totalBurn()).to.eq(stakingPlan.subscriptionCost);

      // Subscribe to second plan
      stakingPlan = stakingPlans[1];

      await token1
        .connect(token1Holder)
        .transfer(acc1.address, stakingPlan.subscriptionCost);
      await token1
        .connect(acc1)
        .approve(stakingContract.address, stakingPlan.subscriptionCost);

      await expect(stakingContract.connect(acc1).subscribe(1))
        .to.emit(stakingContract, "Subscribed")
        .withArgs(acc1.address, 1);

      expect(await stakingContract.hasSubscription(0, acc1.address)).to.eq(
        true
      );
      expect(await stakingContract.hasSubscription(1, acc1.address)).to.eq(
        true
      );
      expect(await stakingContract.hasSubscription(2, acc1.address)).to.eq(
        false
      );
    });

    it("Should be unsubscribed after period expires", async () => {
      const {
        stakingContract,
        restSigners,
        token1Holder,
        token1,
        stakingPlans,
      } = await loadFixture(deployStakingFixture);

      const [acc1] = restSigners;

      await token1
        .connect(token1Holder)
        .transfer(acc1.address, stakingPlans[0].subscriptionCost);
      await token1
        .connect(acc1)
        .approve(stakingContract.address, stakingPlans[0].subscriptionCost);

      await stakingContract.connect(acc1).subscribe(0);

      expect(await stakingContract.hasSubscription(0, acc1.address)).to.eq(
        true
      );

      // Before subscription expired
      await time.increase(
        stakingPlans[0].subscriptionDurationDays * 60 * 60 * 24 - 100
      );
      expect(await stakingContract.hasSubscription(0, acc1.address)).to.eq(
        true
      );

      await token1
        .connect(token1Holder)
        .transfer(acc1.address, stakingPlans[1].subscriptionCost);
      await token1
        .connect(acc1)
        .approve(stakingContract.address, stakingPlans[1].subscriptionCost);

      await stakingContract.connect(acc1).subscribe(1);

      expect(await stakingContract.hasSubscription(1, acc1.address)).to.eq(
        true
      );

      await time.increase(500);
      expect(await stakingContract.hasSubscription(0, acc1.address)).to.eq(
        false
      );
      expect(await stakingContract.hasSubscription(1, acc1.address)).to.eq(
        true
      );
      expect(await stakingContract.hasSubscription(2, acc1.address)).to.eq(
        false
      );

      await time.increase(
        stakingPlans[1].subscriptionDurationDays * 60 * 60 * 24
      );

      expect(await stakingContract.hasSubscription(0, acc1.address)).to.eq(
        false
      );
      expect(await stakingContract.hasSubscription(1, acc1.address)).to.eq(
        false
      );
      expect(await stakingContract.hasSubscription(2, acc1.address)).to.eq(
        false
      );
    });
  });
  // */
  //*
  describe("Deposit", () => {
    it("Should deposit only when plan active", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token2,
        token1Holder,
        token2Holder,
        restSigners,
        minStakeLimit,
      } = await loadFixture(deployStakingFixture);

      const [acc1, acc2] = restSigners;

      await autoSubscribeToStaking(
        0,
        acc1,
        token1,
        token1Holder,
        stakingContract
      );
      await token1.connect(token1Holder).transfer(acc1.address, minStakeLimit);

      await expect(
        stakingContract.connect(adminAccount).updatePlanActivity(0, false)
      )
        .to.emit(stakingContract, "ActivityChanged")
        .withArgs(0, false);

      await expect(
        stakingContract
          .connect(acc1)
          .deposit(0, minStakeLimit, false, ethers.constants.AddressZero)
      ).to.be.revertedWith("Staking plan is not active");

      // Stake in second (active) plan should be available
      await autoStakeToken({
        planId: 1,
        acc: acc2,
        token1,
        token1Holder,
        token2,
        token2Holder,
        isToken2: true,
        stakingContract,
        stakeAmount: minStakeLimit.mul(10),
      });

      await expect(
        stakingContract.connect(adminAccount).updatePlanActivity(0, true)
      )
        .to.emit(stakingContract, "ActivityChanged")
        .withArgs(0, true);

      const profit = await stakingContract.calculateStakeProfit(
        0,
        minStakeLimit
      );

      const timestamp = (await time.latest()) + 100;
      await time.setNextBlockTimestamp(timestamp);

      await expect(
        stakingContract
          .connect(acc1)
          .deposit(0, minStakeLimit, false, ethers.constants.AddressZero)
      )
        .to.emit(stakingContract, "Staked")
        .withArgs(acc1.address, 0, 0, minStakeLimit, profit, false, timestamp);
    });

    it("Should deposit only for subscribers", async () => {
      const {
        stakingContract,
        token1,
        token1Holder,
        restSigners,
        stakingPlans,
        minStakeLimit,
      } = await loadFixture(deployStakingFixture);

      const [acc] = restSigners;

      await expect(
        stakingContract
          .connect(acc)
          .deposit(0, minStakeLimit, false, ethers.constants.AddressZero)
      ).to.be.revertedWith("You are not subscriber");

      const amount = stakingPlans[0].subscriptionCost.add(minStakeLimit);
      await token1.connect(token1Holder).transfer(acc.address, amount);
      await token1.connect(acc).approve(stakingContract.address, amount);

      await stakingContract.connect(acc).subscribe(0);
      await expect(
        stakingContract
          .connect(acc)
          .deposit(0, minStakeLimit, false, ethers.constants.AddressZero)
      ).not.to.be.reverted;

      await expect(
        stakingContract
          .connect(acc)
          .deposit(1, minStakeLimit, false, ethers.constants.AddressZero)
      ).to.be.revertedWith("You are not subscriber");
    });

    it("Should deposit greater than min limit", async () => {
      const {
        stakingContract,
        token1,
        token1Holder,
        restSigners,
        minStakeLimit,
      } = await loadFixture(deployStakingFixture);

      const [acc1] = restSigners;

      await autoSubscribeToStaking(
        0,
        acc1,
        token1,
        token1Holder,
        stakingContract
      );
      await token1.connect(token1Holder).transfer(acc1.address, minStakeLimit);

      await expect(
        stakingContract
          .connect(acc1)
          .deposit(0, minStakeLimit.sub(1), false, ethers.constants.AddressZero)
      ).to.be.revertedWith("Stake amount less than minimum value");
      await expect(
        stakingContract
          .connect(acc1)
          .deposit(0, minStakeLimit, false, ethers.constants.AddressZero)
      ).not.to.be.reverted;
    });

    it("Should deposit only if reward is enough", async () => {
      const {
        stakingContract,
        token1,
        token1Holder,
        stakingRewardPool,
        restSigners,
        minStakeLimit,
      } = await loadFixture(deployStakingFixture);

      const [acc1, acc2] = restSigners;

      await autoSubscribeToStaking(
        0,
        acc1,
        token1,
        token1Holder,
        stakingContract
      );
      await token1.connect(token1Holder).transfer(acc1.address, minStakeLimit);

      const profit = await stakingContract.calculateStakeProfit(
        0,
        minStakeLimit
      );
      await token1
        .connect(stakingRewardPool)
        .transfer(
          acc2.address,
          (await token1.balanceOf(stakingRewardPool.address)).sub(profit).add(1)
        );

      await expect(
        stakingContract
          .connect(acc1)
          .deposit(0, minStakeLimit, false, ethers.constants.AddressZero)
      ).to.be.revertedWith("Not enough tokens for reward");

      await token1.connect(acc2).transfer(stakingRewardPool.address, 1);
      await expect(
        stakingContract
          .connect(acc1)
          .deposit(0, minStakeLimit, false, ethers.constants.AddressZero)
      ).not.to.be.reverted;
    });

    it("Should transfer token1 on deposit", async () => {
      const {
        stakingContract,
        token1,
        stakingRewardPool,
        token1Holder,
        restSigners,
        minStakeLimit,
      } = await loadFixture(deployStakingFixture);

      const [acc] = restSigners;

      expect(await token1.balanceOf(stakingContract.address)).to.eq(0);

      const currentBalance = await token1.balanceOf(stakingRewardPool.address);
      const profit = await stakingContract.calculateStakeProfit(
        0,
        minStakeLimit
      );

      await autoStakeToken({
        planId: 0,
        acc,
        token1,
        token1Holder,
        stakingContract,
      });

      expect(await token1.balanceOf(stakingContract.address)).to.eq(
        minStakeLimit.add(profit)
      );
      expect(await token1.balanceOf(stakingRewardPool.address)).to.eq(
        currentBalance.sub(profit)
      );
    });

    it("Should burn token2 on deposit", async () => {
      const {
        stakingContract,
        token1,
        token2,
        stakingRewardPool,
        token1Holder,
        token2Holder,
        restSigners,
        minStakeLimit,
      } = await loadFixture(deployStakingFixture);

      const [acc] = restSigners;

      expect(await token1.balanceOf(stakingContract.address)).to.eq(0);

      const currentBalance = await token1.balanceOf(stakingRewardPool.address);
      const profit = await stakingContract.calculateStakeProfit(
        0,
        minStakeLimit
      );

      await autoStakeToken({
        planId: 0,
        acc,
        token1,
        token1Holder,
        stakingContract,
        token2,
        token2Holder,
        isToken2: true,
      });

      expect(await token1.balanceOf(stakingContract.address)).to.eq(profit);
      expect(await token2.totalBurn()).to.eq(minStakeLimit);
      expect(await token1.balanceOf(stakingRewardPool.address)).to.eq(
        currentBalance.sub(profit)
      );
    });

    it("Should update contract and user info on deposit", async () => {
      const {
        stakingContract,
        token1,
        token2,
        token1Holder,
        token2Holder,
        restSigners,
        minStakeLimit,
        stakingPlans,
      } = await loadFixture(deployStakingFixture);

      const [acc1, acc2] = restSigners;

      const defaultParams = {
        acc: acc1,
        token1,
        token1Holder,
        stakingContract,
      };

      // Plan 0
      await autoStakeToken({
        ...defaultParams,
        planId: 0,
        stakeAmount: minStakeLimit.add(10),
      });
      await autoStakeToken({
        ...defaultParams,
        planId: 0,
        stakeAmount: minStakeLimit.mul(2),
      });
      await autoStakeToken({
        ...defaultParams,
        planId: 0,
        acc: acc2,
        stakeAmount: minStakeLimit.add(10),
      });
      await autoStakeToken({
        ...defaultParams,
        planId: 0,
        acc: acc2,
        token2,
        token2Holder,
        isToken2: true,
        stakeAmount: minStakeLimit.add(10),
      });
      // Plan 1
      await autoStakeToken({
        ...defaultParams,
        planId: 1,
        stakeAmount: minStakeLimit,
      });
      // Plan 2
      await autoStakeToken({
        ...defaultParams,
        planId: 2,
        stakeAmount: minStakeLimit.mul(2),
        token2,
        token2Holder,
        isToken2: true,
      });

      await autoStakeToken({
        ...defaultParams,
        planId: 2,
        stakeAmount: minStakeLimit,
      });

      // Set time after first stakes ready
      await time.increase(stakingPlans[0].durationDays * 60 * 60 * 24 + 100);

      const profit = await stakingContract.calculateStakeProfit(
        0,
        minStakeLimit.add(10)
      );
      let timestamp = (await time.latest()) + 100;
      await time.setNextBlockTimestamp(timestamp);
      await expect(stakingContract.connect(acc1).withdraw(0, 0))
        .to.emit(stakingContract, "Claimed")
        .withArgs(
          acc1.address,
          0,
          0,
          minStakeLimit.add(10).add(profit),
          false,
          timestamp
        );

      timestamp = (await time.latest()) + 100;
      await time.setNextBlockTimestamp(timestamp);
      await expect(stakingContract.connect(acc2).withdraw(0, 1))
        .to.emit(stakingContract, "Claimed")
        .withArgs(acc2.address, 0, 1, profit, true, timestamp);

      let userData = await stakingContract.getUserPlanInfo(0, acc1.address);
      expect(userData.totalStakedToken1).to.eq(minStakeLimit.mul(3).add(10));
      expect(userData.currentToken1Staked).to.eq(minStakeLimit.mul(2));
      expect(userData.totalStakedToken2).to.eq(0);
      expect(userData.totalClaimed).to.eq(minStakeLimit.add(10).add(profit));
      expect(userData.isSubscribed).to.eq(true);
      userData = await stakingContract.getUserPlanInfo(0, acc2.address);
      expect(userData.totalStakedToken1).to.eq(minStakeLimit.add(10));
      expect(userData.totalStakedToken2).to.eq(minStakeLimit.add(10));
      expect(userData.currentToken1Staked).to.eq(minStakeLimit.add(10));
      expect(userData.totalClaimed).to.eq(profit);
      expect(userData.isSubscribed).to.eq(true);

      userData = await stakingContract.getUserPlanInfo(1, acc1.address);
      expect(userData.totalStakedToken1).to.eq(minStakeLimit);
      expect(userData.currentToken1Staked).to.eq(minStakeLimit);
      expect(userData.totalStakedToken2).to.eq(0);
      expect(userData.totalClaimed).to.eq(0);
      expect(userData.isSubscribed).to.eq(true);

      userData = await stakingContract.getUserPlanInfo(2, acc1.address);
      expect(userData.totalStakedToken1).to.eq(minStakeLimit);
      expect(userData.totalStakedToken2).to.eq(minStakeLimit.mul(2));
      expect(userData.currentToken1Staked).to.eq(minStakeLimit);
      expect(userData.totalClaimed).to.eq(0);
      expect(userData.isSubscribed).to.eq(true);

      // Check contract info
      let contractData = await stakingContract.getStakingPlan(0);
      expect(contractData.isActive).to.eq(true);
      expect(contractData.totalStakesToken1No).to.eq(3);
      expect(contractData.totalStakesToken2No).to.eq(1);
      expect(contractData.totalStakedToken1).to.eq(
        minStakeLimit.mul(4).add(20)
      );
      expect(contractData.totalStakedToken2).to.eq(minStakeLimit.add(10));
      expect(contractData.totalClaimed).to.eq(
        minStakeLimit.add(10).add(profit).add(profit) // 1 token1 stake + 1 token2 stake
      );

      contractData = await stakingContract.getStakingPlan(1);
      expect(contractData.isActive).to.eq(true);
      expect(contractData.totalStakesToken1No).to.eq(1);
      expect(contractData.totalStakesToken2No).to.eq(0);
      expect(contractData.totalStakedToken1).to.eq(minStakeLimit);
      expect(contractData.totalStakedToken2).to.eq(0);
      expect(contractData.totalClaimed).to.eq(0);

      contractData = await stakingContract.getStakingPlan(2);
      expect(contractData.isActive).to.eq(true);
      expect(contractData.totalStakesToken1No).to.eq(1);
      expect(contractData.totalStakesToken2No).to.eq(1);
      expect(contractData.totalStakedToken1).to.eq(minStakeLimit);
      expect(contractData.totalStakedToken2).to.eq(minStakeLimit.mul(2));
      expect(contractData.totalClaimed).to.eq(0);
    });
  });
  // */
  //*
  describe("Withdraw", () => {
    it("Should withdraw only when not claimed and time passed", async () => {
      const {
        stakingContract,
        token1,
        token1Holder,
        restSigners,
        stakingPlans,
      } = await loadFixture(deployStakingFixture);

      const [acc] = restSigners;

      await expect(stakingContract.connect(acc).withdraw(0, 0)).to.be.reverted;

      await autoStakeToken({
        planId: 0,
        acc,
        token1,
        token1Holder,
        stakingContract,
      });
      await autoStakeToken({
        planId: 1,
        acc,
        token1,
        token1Holder,
        stakingContract,
      });

      await expect(
        stakingContract.connect(acc).withdraw(0, 0)
      ).to.be.revertedWith("Stake is not ready yet");

      await waitForStakeFinished(stakingPlans[0].durationDays);

      await autoStakeToken({
        planId: 0,
        acc,
        token1,
        token1Holder,
        stakingContract,
      });

      await expect(stakingContract.connect(acc).withdraw(0, 1)).to.be.reverted;
      await expect(stakingContract.connect(acc).withdraw(0, 2)).to.be.reverted;
      await expect(stakingContract.connect(acc).withdraw(1, 0)).to.be.reverted;
      await expect(stakingContract.connect(acc).withdraw(1, 1)).to.be.reverted;

      await expect(stakingContract.connect(acc).withdraw(0, 0)).not.to.be
        .reverted;

      await expect(
        stakingContract.connect(acc).withdraw(0, 0)
      ).to.be.revertedWith("Stake is already claimed");

      await expect(
        stakingContract.connect(acc).withdraw(1, 0)
      ).to.be.revertedWith("Stake is not ready yet");

      await waitForStakeFinished(stakingPlans[1].durationDays);

      await expect(stakingContract.connect(acc).withdraw(1, 0)).not.to.be
        .reverted;
      await expect(stakingContract.connect(acc).withdraw(0, 1)).not.to.be
        .reverted;
    });

    it("Should withdraw correct amount for token1 and token2", async () => {
      const {
        stakingContract,
        token1,
        token2,
        token1Holder,
        token2Holder,
        restSigners,
        stakingPlans,
        minStakeLimit,
      } = await loadFixture(deployStakingFixture);

      const [acc] = restSigners;

      const reward = await stakingContract.calculateStakeProfit(
        0,
        minStakeLimit
      );

      const defaultParams = {
        planId: 0,
        acc,
        token1,
        token1Holder,
        stakingContract,
      };

      await autoStakeToken(defaultParams);

      await autoStakeToken({
        ...defaultParams,
        token2,
        token2Holder,
        isToken2: true,
      });

      await waitForStakeFinished(stakingPlans[0].durationDays);

      expect(await token1.balanceOf(acc.address)).to.eq(0);
      await expect(
        stakingContract.connect(acc).withdraw(0, 0)
      ).to.changeTokenBalances(
        token1,
        [stakingContract.address, acc.address],
        [minStakeLimit.add(reward).mul(-1), minStakeLimit.add(reward)]
      );

      await expect(
        stakingContract.connect(acc).withdraw(0, 1)
      ).to.changeTokenBalances(
        token1,
        [stakingContract.address, acc.address],
        [reward.mul(-1), reward]
      );
    });
  });
  // */
  //*
  describe("Roles / Administration", () => {
    it("Should update shouldAddReferrerOnToken2Stake, rewardPool, token1, token2, referralManager, squadsManager, PERCENTS_DIVIDER, TIME_STEP, MIN_STAKE_LIMIT only by Admin", async () => {
      const { stakingContract, adminAccount, restSigners } = await loadFixture(
        deployStakingFixture
      );

      const [
        acc,
        newPool,
        newToken1,
        newToken2,
        newReferralManager,
        newSquadsManager,
      ] = restSigners;

      await expect(
        stakingContract.connect(acc).updateShouldAddReferrerOnToken2Stake(true)
      ).to.be.reverted;
      await expect(
        stakingContract.connect(acc).updateRewardPool(newPool.address)
      ).to.be.reverted;
      await expect(stakingContract.connect(acc).updateToken1(newToken1.address))
        .to.be.reverted;
      await expect(stakingContract.connect(acc).updateToken2(newToken2.address))
        .to.be.reverted;
      await expect(
        stakingContract
          .connect(acc)
          .updateReferralManager(newReferralManager.address)
      ).to.be.reverted;
      await expect(
        stakingContract
          .connect(acc)
          .updateSquadsManager(newSquadsManager.address)
      ).to.be.reverted;
      await expect(stakingContract.connect(acc).updatePercentDivider(10)).to.be
        .reverted;
      await expect(stakingContract.connect(acc).updateTimeStep(60)).to.be
        .reverted;
      await expect(stakingContract.connect(acc).updateMinStakeLimit(100)).to.be
        .reverted;

      await grantAdminRole(stakingContract, adminAccount, acc);

      await expect(
        stakingContract.connect(acc).updateShouldAddReferrerOnToken2Stake(true)
      ).not.to.be.reverted;
      await expect(
        stakingContract.connect(acc).updateRewardPool(newPool.address)
      ).not.to.be.reverted;
      await expect(stakingContract.connect(acc).updateToken1(newToken1.address))
        .not.to.be.reverted;
      await expect(stakingContract.connect(acc).updateToken2(newToken2.address))
        .not.to.be.reverted;
      await expect(
        stakingContract
          .connect(acc)
          .updateReferralManager(newReferralManager.address)
      ).not.to.be.reverted;
      await expect(
        stakingContract
          .connect(acc)
          .updateSquadsManager(newSquadsManager.address)
      ).not.to.be.reverted;
      await expect(stakingContract.connect(acc).updatePercentDivider(10)).not.to
        .be.reverted;
      await expect(stakingContract.connect(acc).updateTimeStep(60)).not.to.be
        .reverted;
      await expect(stakingContract.connect(acc).updateMinStakeLimit(100)).not.to
        .be.reverted;

      expect(await stakingContract.shouldAddReferrerOnToken2Stake()).to.eq(
        true
      );
      expect(await stakingContract.token1()).to.eq(newToken1.address);
      expect(await stakingContract.token2()).to.eq(newToken2.address);
      expect(await stakingContract.referralManager()).to.eq(
        newReferralManager.address
      );
      expect(await stakingContract.squadsManager()).to.eq(
        newSquadsManager.address
      );
      expect(await stakingContract.PERCENTS_DIVIDER()).to.eq(10);
      expect(await stakingContract.TIME_STEP()).to.eq(60);
      expect(await stakingContract.MIN_STAKE_LIMIT()).to.eq(100);
    });

    it("Should add plan and update plan activity, duration, reward, subscriptionCost and subscriptionDuration only by Admin", async () => {
      const { stakingContract, adminAccount, restSigners, stakingPlans } =
        await loadFixture(deployStakingFixture);

      const newStakingPlan: StakingPlan = {
        durationDays: 50,
        rewardPercent: 5000, // 500
        subscriptionCost: BigNumber.from(10).pow(21), // 1000 tokens
        subscriptionDurationDays: 100,
      };

      const [acc] = restSigners;

      await expect(stakingContract.connect(acc).updatePlanActivity(0, false)).to
        .be.reverted;
      await expect(stakingContract.connect(acc).updatePlanDurationDays(0, 1)).to
        .be.reverted;
      await expect(stakingContract.connect(acc).updatePlanReward(0, 10)).to.be
        .reverted;
      await expect(
        stakingContract.connect(acc).updatePlanSubscriptionCost(0, 20)
      ).to.be.reverted;
      await expect(
        stakingContract.connect(acc).updatePlanSubscriptionPeriod(0, 3)
      ).to.be.reverted;
      await expect(
        stakingContract
          .connect(acc)
          .addStakingPlan(
            newStakingPlan.subscriptionCost,
            newStakingPlan.subscriptionDurationDays,
            newStakingPlan.durationDays,
            newStakingPlan.rewardPercent
          )
      ).to.be.reverted;

      await grantAdminRole(stakingContract, adminAccount, acc);

      await expect(
        stakingContract
          .connect(acc)
          .addStakingPlan(
            newStakingPlan.subscriptionCost,
            newStakingPlan.subscriptionDurationDays,
            0,
            newStakingPlan.rewardPercent
          )
      ).to.be.reverted;
      await expect(
        stakingContract
          .connect(acc)
          .addStakingPlan(
            newStakingPlan.subscriptionCost,
            newStakingPlan.subscriptionDurationDays,
            newStakingPlan.durationDays,
            0
          )
      ).to.be.reverted;

      await expect(stakingContract.connect(acc).updatePlanActivity(0, false))
        .not.to.be.reverted;
      await expect(stakingContract.connect(acc).updatePlanDurationDays(0, 1))
        .not.to.be.reverted;
      await expect(stakingContract.connect(acc).updatePlanReward(0, 10)).not.to
        .be.reverted;
      await expect(
        stakingContract.connect(acc).updatePlanSubscriptionCost(0, 20)
      ).not.to.be.reverted;
      await expect(
        stakingContract.connect(acc).updatePlanSubscriptionPeriod(0, 3)
      ).not.to.be.reverted;
      await expect(
        stakingContract
          .connect(acc)
          .addStakingPlan(
            newStakingPlan.subscriptionCost,
            newStakingPlan.subscriptionDurationDays,
            newStakingPlan.durationDays,
            newStakingPlan.rewardPercent
          )
      )
        .to.emit(stakingContract, "StakingPlanCreated")
        .withArgs(3, newStakingPlan.durationDays, newStakingPlan.rewardPercent);

      const contractInfo = await stakingContract.getContractInfo();

      expect(contractInfo[0].isActive).to.eq(false);
      expect(contractInfo[0].subscriptionCost).to.eq(20);
      expect(contractInfo[0].subscriptionDuration).to.eq(3);
      expect(contractInfo[0].stakingDuration).to.eq(1);
      expect(contractInfo[0].profitPercent).to.eq(10);

      expect(contractInfo[1].isActive).to.eq(true);
      expect(contractInfo[1].subscriptionCost).to.eq(
        stakingPlans[1].subscriptionCost
      );
      expect(contractInfo[1].subscriptionDuration).to.eq(
        stakingPlans[1].subscriptionDurationDays
      );
      expect(contractInfo[1].stakingDuration).to.eq(
        stakingPlans[1].durationDays
      );
      expect(contractInfo[1].profitPercent).to.eq(
        stakingPlans[1].rewardPercent
      );

      expect(contractInfo[2].isActive).to.eq(true);
      expect(contractInfo[2].subscriptionCost).to.eq(
        stakingPlans[2].subscriptionCost
      );
      expect(contractInfo[2].subscriptionDuration).to.eq(
        stakingPlans[2].subscriptionDurationDays
      );
      expect(contractInfo[2].stakingDuration).to.eq(
        stakingPlans[2].durationDays
      );
      expect(contractInfo[2].profitPercent).to.eq(
        stakingPlans[2].rewardPercent
      );

      expect(contractInfo[3].isActive).to.eq(true);
      expect(contractInfo[3].subscriptionCost).to.eq(
        newStakingPlan.subscriptionCost
      );
      expect(contractInfo[3].subscriptionDuration).to.eq(
        newStakingPlan.subscriptionDurationDays
      );
      expect(contractInfo[3].stakingDuration).to.eq(
        newStakingPlan.durationDays
      );
      expect(contractInfo[3].profitPercent).to.eq(newStakingPlan.rewardPercent);
    });
  });
  // */
  //*
  it("Should emit Staked", async () => {
    const {
      stakingContract,
      token1,
      token1Holder,
      token2,
      token2Holder,
      restSigners,
      minStakeLimit,
    } = await loadFixture(deployStakingFixture);

    const [acc] = restSigners;
    const planId = 2;

    await autoSubscribeToStaking(
      planId,
      acc,
      token1,
      token1Holder,
      stakingContract
    );

    await token1
      .connect(token1Holder)
      .transfer(acc.address, minStakeLimit.mul(10));

    let profit = await stakingContract.calculateStakeProfit(
      planId,
      minStakeLimit.add(10)
    );
    let timestamp = (await time.latest()) + 100;
    await time.setNextBlockTimestamp(timestamp);

    await expect(
      stakingContract
        .connect(acc)
        .deposit(
          planId,
          minStakeLimit.add(10),
          false,
          ethers.constants.AddressZero
        )
    )
      .to.emit(stakingContract, "Staked")
      .withArgs(
        acc.address,
        planId,
        0,
        minStakeLimit.add(10),
        profit,
        false,
        timestamp
      );

    profit = await stakingContract.calculateStakeProfit(
      planId,
      minStakeLimit.mul(3)
    );
    timestamp = (await time.latest()) + 100;
    await time.setNextBlockTimestamp(timestamp);
    await expect(
      stakingContract
        .connect(acc)
        .deposit(
          planId,
          minStakeLimit.mul(3),
          false,
          ethers.constants.AddressZero
        )
    )
      .to.emit(stakingContract, "Staked")
      .withArgs(
        acc.address,
        planId,
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

    profit = await stakingContract.calculateStakeProfit(planId, minStakeLimit);
    timestamp = (await time.latest()) + 100;
    await time.setNextBlockTimestamp(timestamp);

    await expect(
      stakingContract
        .connect(acc)
        .deposit(planId, minStakeLimit, true, ethers.constants.AddressZero)
    )
      .to.emit(stakingContract, "Staked")
      .withArgs(acc.address, planId, 2, minStakeLimit, profit, true, timestamp);
  });
  // */
  //*
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
        stakingPlans,
        minStakeLimit,
      } = await loadFixture(deployStakingFixture);

      const [acc] = restSigners;

      const startTime = await time.latest();
      const planId = 0;
      const endTime = startTime + stakingPlans[planId].durationDays * 3600 * 24;

      const params = {
        planId,
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

      await waitForStakeFinished(stakingPlans[planId].durationDays);
      await stakingContract.connect(acc).withdraw(planId, 1);

      const userStakes = await stakingContract.getUserStakes(
        planId,
        acc.address
      );

      let profit = await stakingContract.calculateStakeProfit(
        planId,
        minStakeLimit.add(10)
      );

      expect(userStakes[0].amount).to.eq(minStakeLimit.add(10));
      expect(userStakes[0].timeStart)
        .to.be.greaterThan(startTime)
        .and.be.lessThan(startTime + 1000);
      expect(userStakes[0].timeEnd)
        .to.be.greaterThan(endTime)
        .and.be.lessThan(endTime + 1000);
      expect(userStakes[0].profitPercent).to.eq(
        stakingPlans[planId].rewardPercent
      );
      expect(userStakes[0].profit).to.eq(profit);
      expect(userStakes[0].isToken2).to.eq(false);
      expect(userStakes[0].isClaimed).to.eq(false);

      profit = await stakingContract.calculateStakeProfit(
        planId,
        minStakeLimit.mul(2)
      );
      expect(userStakes[1].amount).to.eq(minStakeLimit.mul(2));
      expect(userStakes[1].timeStart)
        .to.be.greaterThan(startTime)
        .and.be.lessThan(startTime + 1000);
      expect(userStakes[1].timeEnd)
        .to.be.greaterThan(endTime)
        .and.be.lessThan(endTime + 1000);
      expect(userStakes[1].profitPercent).to.eq(
        stakingPlans[planId].rewardPercent
      );
      expect(userStakes[1].profit).to.eq(profit);
      expect(userStakes[1].isToken2).to.eq(false);
      expect(userStakes[1].isClaimed).to.eq(true);

      profit = await stakingContract.calculateStakeProfit(
        planId,
        minStakeLimit.add(50)
      );
      expect(userStakes[2].amount).to.eq(minStakeLimit.add(50));
      expect(userStakes[2].timeStart)
        .to.be.greaterThan(startTime)
        .and.be.lessThan(startTime + 1000);
      expect(userStakes[2].timeEnd)
        .to.be.greaterThan(endTime)
        .and.be.lessThan(endTime + 1000);
      expect(userStakes[2].profitPercent).to.eq(
        stakingPlans[planId].rewardPercent
      );
      expect(userStakes[2].profit).to.eq(profit);
      expect(userStakes[2].isToken2).to.eq(true);
      expect(userStakes[2].isClaimed).to.eq(false);
    });
    // getTimestamp
    it("Should return correct timestamp", async () => {
      const { stakingContract } = await loadFixture(deployStakingFixture);

      const timestamp = await time.latest();

      expect(await stakingContract.getTimestamp()).to.eq(timestamp);
    });
    // calculateStakeProfit
    it("Should return correct stake profit", async () => {
      const { stakingContract, stakingPlans } = await loadFixture(
        deployStakingFixture
      );

      const amount = BigNumber.from(345_987_000_000);
      const percentsDivider = await stakingContract.PERCENTS_DIVIDER();

      for (let i = 0; i < stakingPlans.length; i++) {
        const profit = await stakingContract.calculateStakeProfit(i, amount);
        const expectedProfit = amount
          .mul(stakingPlans[i].rewardPercent)
          .div(percentsDivider);

        expect(profit).to.eq(expectedProfit);
      }
    });
    // getAvailableStakeReward
    it("Should return correct stake reward for token 1", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        restSigners,
        stakingPlans,
        minStakeLimit,
      } = await loadFixture(deployStakingFixture);

      const [acc] = restSigners;
      const planId = 1;

      await expect(
        stakingContract.getAvailableStakeReward(planId, acc.address, 0)
      ).to.be.revertedWithPanic(50);

      const params = {
        planId,
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
        stakingContract.getAvailableStakeReward(planId, acc.address, 1)
      ).to.be.revertedWithPanic(50);

      const stakes = await stakingContract.getUserStakes(planId, acc.address);
      const [stake] = stakes;

      // Just now
      const profit = await stakingContract.calculateStakeProfit(
        planId,
        minStakeLimit
      );
      let expectedReward = BigNumber.from(await time.latest())
        .sub(stake.timeStart)
        .mul(minStakeLimit.add(profit))
        .div(stake.timeEnd.sub(stake.timeStart));
      expect(
        await stakingContract.getAvailableStakeReward(planId, acc.address, 0)
      ).to.eq(expectedReward);

      // A bit later
      await time.increase(10000);

      expectedReward = BigNumber.from(await time.latest())
        .sub(stake.timeStart)
        .mul(minStakeLimit.add(profit))
        .div(stake.timeEnd.sub(stake.timeStart));

      expect(
        await stakingContract.getAvailableStakeReward(planId, acc.address, 0)
      ).to.eq(expectedReward);

      // After ending
      await waitForStakeFinished(stakingPlans[planId].durationDays);
      await time.increase(10000);

      expect(
        await stakingContract.getAvailableStakeReward(planId, acc.address, 0)
      ).to.eq(minStakeLimit.add(profit));

      // Claimed
      await stakingContract.connect(acc).withdraw(planId, 0);
      expect(
        await stakingContract.getAvailableStakeReward(planId, acc.address, 0)
      ).to.eq(0);
    });

    it("Should return correct stake reward for token 2", async () => {
      const {
        stakingContract,
        adminAccount,
        token1,
        token1Holder,
        token2,
        token2Holder,
        restSigners,
        stakingPlans,
        minStakeLimit,
      } = await loadFixture(deployStakingFixture);

      const [acc] = restSigners;
      const planId = 2;

      await expect(
        stakingContract.getAvailableStakeReward(planId, acc.address, 0)
      ).to.be.revertedWithPanic(50);

      const params = {
        planId,
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
        stakingContract.getAvailableStakeReward(planId, acc.address, 1)
      ).to.be.revertedWithPanic(50);

      const stakes = await stakingContract.getUserStakes(planId, acc.address);
      const [stake] = stakes;

      // Just now
      const profit = await stakingContract.calculateStakeProfit(
        planId,
        minStakeLimit
      );
      let expectedReward = BigNumber.from(await time.latest())
        .sub(stake.timeStart)
        .mul(profit)
        .div(stake.timeEnd.sub(stake.timeStart));
      expect(
        await stakingContract.getAvailableStakeReward(planId, acc.address, 0)
      ).to.eq(expectedReward);

      // A bit later
      await time.increase(10000);

      expectedReward = BigNumber.from(await time.latest())
        .sub(stake.timeStart)
        .mul(profit)
        .div(stake.timeEnd.sub(stake.timeStart));

      expect(
        await stakingContract.getAvailableStakeReward(planId, acc.address, 0)
      ).to.eq(expectedReward);

      // After ending
      await waitForStakeFinished(stakingPlans[planId].durationDays);
      await time.increase(10000);

      expect(
        await stakingContract.getAvailableStakeReward(planId, acc.address, 0)
      ).to.eq(profit);

      // Claimed
      await stakingContract.connect(acc).withdraw(planId, 0);
      expect(
        await stakingContract.getAvailableStakeReward(planId, acc.address, 0)
      ).to.eq(0);
    });
  });
  // */
});
