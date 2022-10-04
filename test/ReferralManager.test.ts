import {
  loadFixture,
  mine,
  time,
} from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { ReferralManager__factory } from "typechain-types";
import {
  autoStakeToken,
  autoSubscribeToStaking,
  autoSubscribeToReferral,
  createReferralChain,
  grantAdminRole,
  deployReferralManagerFixture,
} from "./helpers";

const secondsInDay = 60 * 60 * 24;

describe("ReferralManager", () => {
  //*
  describe("Deployment", () => {
    it("Should not deploy with incorrect initial data", async () => {
      const {
        token1,
        token2,
        referralRewardPool,
        adminAccount,
        fullSubscriptionCost,
        levelSubscriptionCost,
      } = await loadFixture(deployReferralManagerFixture);

      const referralManager = new ReferralManager__factory(adminAccount);

      await expect(
        referralManager.deploy(
          ethers.constants.AddressZero,
          token2.address,
          referralRewardPool.address,
          fullSubscriptionCost,
          levelSubscriptionCost
        )
      ).to.be.reverted;
      await expect(
        referralManager.deploy(
          token1.address,
          ethers.constants.AddressZero,
          referralRewardPool.address,
          fullSubscriptionCost,
          levelSubscriptionCost
        )
      ).to.be.reverted;
      await expect(
        referralManager.deploy(
          token1.address,
          token2.address,
          ethers.constants.AddressZero,
          fullSubscriptionCost,
          levelSubscriptionCost
        )
      ).to.be.reverted;
      await expect(
        referralManager.deploy(
          token1.address,
          token2.address,
          referralRewardPool.address,
          0,
          levelSubscriptionCost
        )
      ).to.be.reverted;
      await expect(
        referralManager.deploy(
          token1.address,
          token2.address,
          referralRewardPool.address,
          fullSubscriptionCost,
          0
        )
      ).to.be.reverted;
    });

    it("Should deploy with correct initial data", async () => {
      const {
        token1,
        token2,
        referralRewardPool,
        adminAccount,
        fullSubscriptionCost,
        levelSubscriptionCost,
      } = await loadFixture(deployReferralManagerFixture);

      const referralManager = await new ReferralManager__factory(
        adminAccount
      ).deploy(
        token1.address,
        token2.address,
        referralRewardPool.address,
        fullSubscriptionCost,
        levelSubscriptionCost
      );
      const AdminRole = await referralManager.DEFAULT_ADMIN_ROLE();
      expect(
        await referralManager.hasRole(AdminRole, adminAccount.address)
      ).to.eq(true);

      expect(await referralManager.subscriptionToken()).to.eq(token1.address);
      expect(await referralManager.rewardToken()).to.eq(token2.address);
      expect(await referralManager.fullSubscriptionCost()).to.eq(
        fullSubscriptionCost
      );
      expect(await referralManager.levelSubscriptionCost()).to.eq(
        levelSubscriptionCost
      );
    });
  });

  describe("Subscription / Adding referrals", () => {
    it("Should subscribe to all levels", async () => {
      const {
        referralManager,
        restSigners,
        referralLevels,
        token1,
        token1Holder,
        fullSubscriptionCost,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc] = restSigners;

      for (let i = 1; i <= referralLevels; i++) {
        expect(await referralManager.userHasSubscription(acc.address, i)).to.eq(
          false
        );
      }

      await expect(referralManager.connect(acc).subscribeToAllLevels()).to.be
        .reverted;

      await token1
        .connect(token1Holder)
        .transfer(acc.address, fullSubscriptionCost);
      await token1
        .connect(acc)
        .approve(referralManager.address, fullSubscriptionCost);

      await expect(
        referralManager.connect(acc).subscribeToAllLevels()
      ).to.changeTokenBalance(
        token1,
        acc.address,
        fullSubscriptionCost.mul(-1)
      );

      for (let i = 1; i <= referralLevels; i++) {
        expect(await referralManager.userHasSubscription(acc.address, i)).to.eq(
          true
        );
      }
    });

    it("Should subscribe to some levels", async () => {
      const {
        referralManager,
        restSigners,
        referralLevels,
        token1,
        token1Holder,
        levelSubscriptionCost,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc] = restSigners;
      await token1
        .connect(acc)
        .approve(referralManager.address, ethers.constants.MaxInt256);

      await expect(
        referralManager.connect(acc).subscribeToLevel(0)
      ).to.be.revertedWith("Too low level");
      await expect(
        referralManager.connect(acc).subscribeToLevel(referralLevels + 1)
      ).to.be.revertedWith("Too big level");

      await token1
        .connect(token1Holder)
        .transfer(acc.address, levelSubscriptionCost.mul(referralLevels));

      for (let i = 1; i <= referralLevels; i++) {
        await expect(
          referralManager.connect(acc).subscribeToLevel(i)
        ).to.changeTokenBalance(
          token1,
          acc.address,
          levelSubscriptionCost.mul(-1)
        );

        for (let j = 1; j <= referralLevels; j++) {
          expect(
            await referralManager.userHasSubscription(acc.address, j)
          ).to.eq(j <= i);
        }
      }
    });

    it("Should expire after subscription period", async () => {
      const {
        referralManager,
        restSigners,
        referralLevels,
        token1,
        token1Holder,
        fullSubscriptionCost,
        levelSubscriptionCost,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc1, acc2, acc3] = restSigners;

      // Setup accounts
      await token1
        .connect(token1Holder)
        .transfer(acc1.address, fullSubscriptionCost);
      await token1
        .connect(token1Holder)
        .transfer(acc2.address, levelSubscriptionCost.mul(2));
      await token1
        .connect(token1Holder)
        .transfer(acc3.address, levelSubscriptionCost.mul(referralLevels));
      await token1
        .connect(acc1)
        .approve(referralManager.address, fullSubscriptionCost);
      await token1
        .connect(acc2)
        .approve(referralManager.address, levelSubscriptionCost.mul(2));
      await token1
        .connect(acc3)
        .approve(
          referralManager.address,
          levelSubscriptionCost.mul(referralLevels)
        );

      await expect(
        referralManager.connect(acc1).subscribeToAllLevels()
      ).to.changeTokenBalance(
        token1,
        acc1.address,
        fullSubscriptionCost.mul(-1)
      );
      await expect(
        referralManager.connect(acc2).subscribeToLevel(2)
      ).to.changeTokenBalance(
        token1,
        acc2.address,
        levelSubscriptionCost.mul(-1)
      );
      await expect(
        referralManager.connect(acc3).subscribeToLevel(referralLevels)
      ).to.changeTokenBalance(
        token1,
        acc3.address,
        levelSubscriptionCost.mul(-1)
      );

      // Before subscription expiration
      await time.increase(365 * secondsInDay - 5);
      expect(
        await referralManager.userHasSubscription(acc1.address, referralLevels)
      ).to.eq(true);
      expect(await referralManager.userHasSubscription(acc1.address, 1)).to.eq(
        true
      );
      expect(await referralManager.userHasSubscription(acc1.address, 2)).to.eq(
        true
      );
      expect(await referralManager.userHasSubscription(acc2.address, 1)).to.eq(
        false
      );
      expect(await referralManager.userHasSubscription(acc2.address, 2)).to.eq(
        true
      );
      expect(await referralManager.userHasSubscription(acc2.address, 3)).to.eq(
        false
      );
      expect(
        await referralManager.userHasSubscription(acc3.address, referralLevels)
      ).to.eq(true);

      // After subscription expiration
      await time.increase(10);
      expect(
        await referralManager.userHasSubscription(acc1.address, referralLevels)
      ).to.eq(false);
      expect(await referralManager.userHasSubscription(acc2.address, 2)).to.eq(
        false
      );
      expect(
        await referralManager.userHasSubscription(acc3.address, referralLevels)
      ).to.eq(false);
    });

    it("Should set referrer only by authorized address", async () => {
      const {
        referralManager,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc, referrer, notAuthorizedAcc, authorizedAcc] = restSigners;

      await expect(
        referralManager
          .connect(notAuthorizedAcc)
          .setUserReferrer(acc.address, referrer.address)
      ).to.be.revertedWith("Address not authorized");

      await referralManager
        .connect(adminAccount)
        .authorizeContract(authorizedAcc.address);

      await autoSubscribeToReferral({
        referralManager,
        token: token1,
        tokenHolder: token1Holder,
        account: referrer,
      });

      await expect(
        referralManager
          .connect(authorizedAcc)
          .setUserReferrer(acc.address, referrer.address)
      ).to.not.be.reverted;

      const referralInfo = await referralManager.getUserInfo(acc.address);
      const referrerInfo = await referralManager.getUserInfo(referrer.address);

      expect(referralInfo.referrer).to.eq(referrer.address);
      expect(referrerInfo.referrals_1_lvl).to.eq(1);
    });

    it("Should validate referrer address", async () => {
      const {
        referralManager,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc, referrer, authorizedAcc] = restSigners;

      await referralManager
        .connect(adminAccount)
        .authorizeContract(authorizedAcc.address);

      await expect(
        referralManager
          .connect(authorizedAcc)
          .setUserReferrer(ethers.constants.AddressZero, referrer.address)
      ).to.be.revertedWith("User is zero address");
      await expect(
        referralManager
          .connect(authorizedAcc)
          .setUserReferrer(acc.address, ethers.constants.AddressZero)
      ).to.be.revertedWith("Referrer is zero address");
      await expect(
        referralManager
          .connect(authorizedAcc)
          .setUserReferrer(acc.address, acc.address)
      ).to.be.revertedWith("Referrer can not be user");
      await expect(
        referralManager
          .connect(authorizedAcc)
          .setUserReferrer(acc.address, referrer.address)
      ).to.be.revertedWith("Referrer has no subscription");

      await autoSubscribeToReferral({
        referralManager,
        token: token1,
        tokenHolder: token1Holder,
        account: referrer,
      });

      await expect(
        referralManager
          .connect(authorizedAcc)
          .setUserReferrer(acc.address, referrer.address)
      ).to.not.be.reverted;

      await expect(
        referralManager
          .connect(authorizedAcc)
          .setUserReferrer(acc.address, referrer.address)
      ).to.be.revertedWith("Referrer is already specified");

      const referralInfo = await referralManager.getUserInfo(acc.address);
      const referrerInfo = await referralManager.getUserInfo(referrer.address);

      expect(referralInfo.referrer).to.eq(referrer.address);
      expect(referralInfo.totalReferrals).to.eq(0);
      expect(referralInfo.referrals_1_lvl).to.eq(0);
      expect(referralInfo.totalDividends).to.eq(0);
      expect(referralInfo.totalClaimedDividends).to.eq(0);
      expect(referrerInfo.referrer).to.eq(ethers.constants.AddressZero);
      expect(referrerInfo.totalReferrals).to.eq(1);
      expect(referrerInfo.referrals_1_lvl).to.eq(1);
      expect(referrerInfo.totalDividends).to.eq(0);
      expect(referrerInfo.totalClaimedDividends).to.eq(0);
    });

    it("Should add referrals only when subscribed", async () => {
      const {
        referralManager,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc1, acc2, acc3, referrer, authorizedAcc] = restSigners;

      await referralManager
        .connect(adminAccount)
        .authorizeContract(authorizedAcc.address);

      await autoSubscribeToReferral({
        referralManager,
        token: token1,
        tokenHolder: token1Holder,
        account: referrer,
      });

      await referralManager
        .connect(authorizedAcc)
        .setUserReferrer(acc1.address, referrer.address);

      await time.increase(365 * secondsInDay + 1);

      await expect(
        referralManager
          .connect(authorizedAcc)
          .setUserReferrer(acc2.address, referrer.address)
      ).to.be.reverted;

      await autoSubscribeToReferral({
        referralManager,
        token: token1,
        tokenHolder: token1Holder,
        account: referrer,
      });

      await referralManager
        .connect(authorizedAcc)
        .setUserReferrer(acc2.address, referrer.address);

      await autoSubscribeToReferral({
        referralManager,
        token: token1,
        tokenHolder: token1Holder,
        account: acc1,
      });

      await referralManager
        .connect(authorizedAcc)
        .setUserReferrer(acc3.address, acc1.address);

      const referral1Info = await referralManager.getUserInfo(acc1.address);
      const referral2Info = await referralManager.getUserInfo(acc2.address);
      const referral3Info = await referralManager.getUserInfo(acc3.address);
      const referrerInfo = await referralManager.getUserInfo(referrer.address);

      expect(referrerInfo.referrer).to.eq(ethers.constants.AddressZero);
      expect(referrerInfo.totalReferrals).to.eq(3);
      expect(referrerInfo.referrals_1_lvl).to.eq(2);

      expect(referral1Info.referrer).to.eq(referrer.address);
      expect(referral1Info.totalReferrals).to.eq(1);
      expect(referral1Info.referrals_1_lvl).to.eq(1);

      expect(referral2Info.referrer).to.eq(referrer.address);
      expect(referral2Info.totalReferrals).to.eq(0);
      expect(referral2Info.referrals_1_lvl).to.eq(0);

      expect(referral3Info.referrer).to.eq(acc1.address);
      expect(referral3Info.totalReferrals).to.eq(0);
      expect(referral3Info.referrals_1_lvl).to.eq(0);
    });

    it("Should set my referrer", async () => {
      const { referralManager, restSigners, token1, token1Holder } =
        await loadFixture(deployReferralManagerFixture);

      const [referrer, acc] = restSigners;

      await autoSubscribeToReferral({
        referralManager,
        token: token1,
        tokenHolder: token1Holder,
        account: referrer,
      });

      await referralManager.connect(acc).setMyReferrer(referrer.address);

      const referrerInfo = await referralManager.getUserInfo(referrer.address);
      const referralInfo = await referralManager.getUserInfo(acc.address);

      expect(referrerInfo.totalReferrals).to.eq(1);
      expect(referrerInfo.referrals_1_lvl).to.eq(1);

      expect(referralInfo.referrer).to.eq(referrer.address);
      expect(referralInfo.totalReferrals).to.eq(0);
      expect(referralInfo.referrals_1_lvl).to.eq(0);
    });
  });
  // */
  describe("Referral rewards", () => {
    //*
    // default rewards (for 1 level)
    it("Should assign referral dividends and claim rewards", async () => {
      const {
        referralManager,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
        stakings,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc, referrer] = restSigners;
      const stakingContract = stakings[0].contract;
      const amount = await stakingContract.MIN_STAKE_LIMIT();

      await referralManager
        .connect(adminAccount)
        .authorizeContract(stakingContract.address);

      await autoSubscribeToReferral({
        referralManager,
        token: token1,
        tokenHolder: token1Holder,
        account: referrer,
      });

      await autoStakeToken({
        acc: referrer,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
        stakeAmount: amount,
      });

      await autoSubscribeToStaking(
        acc,
        token1,
        token1Holder,
        stakingContract,
        adminAccount
      );

      await token1.connect(token1Holder).transfer(acc.address, amount);
      await token1
        .connect(acc)
        .approve(stakingContract.address, ethers.constants.MaxUint256);

      await expect(
        stakingContract.connect(acc).deposit(amount, false, acc.address)
      ).to.be.revertedWith("Referrer can not be sender");

      await expect(
        stakingContract.connect(acc).deposit(amount, false, referrer.address)
      ).to.emit(referralManager, "ReferralAdded");

      let userInfo = await referralManager.getUserInfo(referrer.address);
      const stakingReward = await stakingContract.calculateStakeProfit(amount);
      const waitedReward = await referralManager.calculateRefReward(
        stakingReward.toString(),
        1
      );
      expect(userInfo.totalDividends).to.eq(waitedReward);
      expect(userInfo.totalClaimedDividends).to.eq(0);

      await expect(
        referralManager.connect(referrer).claimDividends(waitedReward.add(1))
      ).to.be.revertedWith("Insufficient amount");

      await referralManager.connect(referrer).claimDividends(0);
      userInfo = await referralManager.getUserInfo(referrer.address);
      expect(userInfo.totalClaimedDividends).to.eq(0);

      await referralManager
        .connect(referrer)
        .claimDividends(waitedReward.div(10));
      userInfo = await referralManager.getUserInfo(referrer.address);
      expect(userInfo.totalClaimedDividends).to.eq(waitedReward.div(10));

      await referralManager
        .connect(referrer)
        .claimDividends(waitedReward.div(10).mul(9));
      userInfo = await referralManager.getUserInfo(referrer.address);
      expect(userInfo.totalClaimedDividends).to.eq(waitedReward);
      expect(userInfo.totalDividends).to.eq(waitedReward);

      await expect(
        referralManager.connect(referrer).claimDividends(1)
      ).to.be.revertedWith("Insufficient amount");
    });
    // */

    // default rewards (for 10 levels), no rewards for 11 lvl
    it("Should assign referral dividends till 10 lvl", async () => {
      const {
        referralManager,
        referralLevels,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
        stakings,
      } = await loadFixture(deployReferralManagerFixture);

      const [referrer] = restSigners;
      const stakingContract = stakings[0].contract;
      const amount = await stakingContract.MIN_STAKE_LIMIT();

      await referralManager
        .connect(adminAccount)
        .authorizeContract(stakingContract.address);

      await autoStakeToken({
        acc: referrer,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
        stakeAmount: amount.mul(100),
      });

      await createReferralChain({
        token: token1,
        tokenHolder: token1Holder,
        referralManager,
        stakingContract,
        signers: restSigners,
        adminAccount,
        levels: referralLevels + 2,
      });

      const referrerInfo = await referralManager.getUserInfo(referrer.address);

      expect(referrerInfo.totalDividends).to.eq(
        BigNumber.from(10).pow(15).mul(55)
      );
      expect(referrerInfo.totalReferrals).to.eq(10);
      expect(
        await referralManager.getUserLvlReferralsCount(
          referrer.address,
          referralLevels
        )
      ).to.eq(1);
    });

    it("Should not allow cycles in chain", async () => {
      const {
        referralManager,
        referralLevels,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
        stakings,
      } = await loadFixture(deployReferralManagerFixture);

      const [referrer] = restSigners;
      const stakingContract = stakings[0].contract;
      const amount = await stakingContract.MIN_STAKE_LIMIT();

      await referralManager
        .connect(adminAccount)
        .authorizeContract(stakingContract.address);

      await autoStakeToken({
        acc: referrer,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
        stakeAmount: amount.mul(100),
      });

      await createReferralChain({
        token: token1,
        tokenHolder: token1Holder,
        referralManager,
        stakingContract,
        signers: restSigners,
        adminAccount,
        levels: referralLevels,
      });

      const lastPartner = restSigners[referralLevels - 1];
      await token1.connect(token1Holder).transfer(referrer.address, amount);
      await expect(
        stakingContract
          .connect(referrer)
          .deposit(amount, false, lastPartner.address)
      ).to.be.revertedWith("Cyclic chain!");
    });
    //* /
    // should truncate reward with current locked token1
    it("Should truncate reward with current locked token1", async () => {
      const {
        referralManager,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
        stakings,
      } = await loadFixture(deployReferralManagerFixture);

      const [referrer] = restSigners;
      const stakingContract = stakings[0].contract;
      const amount = await stakingContract.MIN_STAKE_LIMIT();

      await referralManager
        .connect(adminAccount)
        .authorizeContract(stakingContract.address);

      await autoStakeToken({
        acc: referrer,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
        stakeAmount: amount,
      });

      const getStakeParams = (level: number, params: any) => {
        return { ...params, stakeAmount: amount.mul(100) };
      };

      await createReferralChain({
        token: token1,
        tokenHolder: token1Holder,
        referralManager,
        stakingContract,
        signers: restSigners,
        adminAccount,
        getStakeParams,
      });

      const userInfo = await referralManager.getUserInfo(referrer.address);
      expect(userInfo.totalDividends).to.eq(amount.mul(10)); // cause 10 referrals
      expect(userInfo.totalReferrals).to.eq(10);
    });
    // no rewards if subscription expired
    it("Should not assign reward if subscription expired", async () => {
      const {
        referralManager,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
        stakings,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc, referrer] = restSigners;
      const stakingContract = stakings[0].contract;
      const amount = await stakingContract.MIN_STAKE_LIMIT();

      await referralManager
        .connect(adminAccount)
        .authorizeContract(stakingContract.address);

      await autoSubscribeToReferral({
        referralManager,
        token: token1,
        tokenHolder: token1Holder,
        account: referrer,
      });

      await autoStakeToken({
        acc: referrer,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
        stakeAmount: amount.mul(3),
      });

      await autoSubscribeToStaking(
        acc,
        token1,
        token1Holder,
        stakingContract,
        adminAccount
      );

      // This stake should be Ok
      await token1.connect(token1Holder).transfer(acc.address, amount.mul(3));
      await token1
        .connect(acc)
        .approve(stakingContract.address, ethers.constants.MaxUint256);

      await expect(
        stakingContract
          .connect(acc)
          .deposit(amount.mul(2), false, referrer.address)
      ).to.emit(referralManager, "ReferralAdded");

      // There referrer has expired subscription
      await time.increase(365 * secondsInDay + 10);
      await autoSubscribeToStaking(
        acc,
        token1,
        token1Holder,
        stakingContract,
        adminAccount
      );
      await stakingContract
        .connect(acc)
        .deposit(amount, false, referrer.address);

      const userInfo = await referralManager.getUserInfo(referrer.address);
      const stakingReward = await stakingContract.calculateStakeProfit(
        amount.mul(2)
      );
      const waitedReward = await referralManager.calculateRefReward(
        stakingReward.toString(),
        1
      );
      expect(userInfo.totalDividends).to.eq(waitedReward);
      expect(userInfo.totalClaimedDividends).to.eq(0);
    });

    it("Should assign reward only for token1 stakes", async () => {
      const {
        referralManager,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
        stakings,
        token2,
        referralRewardPool,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc, referrer] = restSigners;
      const stakingContract = stakings[0].contract;
      const amount = await stakingContract.MIN_STAKE_LIMIT();

      await referralManager
        .connect(adminAccount)
        .authorizeContract(stakingContract.address);

      await autoSubscribeToReferral({
        referralManager,
        token: token1,
        tokenHolder: token1Holder,
        account: referrer,
      });

      await autoStakeToken({
        acc: referrer,
        adminAccount,
        token1,
        token1Holder,
        stakingContract,
        stakeAmount: amount,
      });

      await autoSubscribeToStaking(
        acc,
        token1,
        token1Holder,
        stakingContract,
        adminAccount
      );

      await token2
        .connect(referralRewardPool)
        .transfer(acc.address, amount.mul(2));
      await token2
        .connect(acc)
        .approve(stakingContract.address, ethers.constants.MaxUint256);

      await expect(
        stakingContract.connect(acc).deposit(amount, true, referrer.address)
      ).not.to.emit(referralManager, "ReferralAdded");

      let userInfo = await referralManager.getUserInfo(referrer.address);
      expect(userInfo.totalDividends).to.eq(0);

      await stakingContract
        .connect(adminAccount)
        .updateShouldAddReferrerOnToken2Stake(true);

      await expect(
        stakingContract.connect(acc).deposit(amount, true, referrer.address)
      ).to.emit(referralManager, "ReferralAdded");

      userInfo = await referralManager.getUserInfo(referrer.address);
      const stakingReward = await stakingContract.calculateStakeProfit(amount);
      const waitedReward = await referralManager.calculateRefReward(
        stakingReward.toString(),
        1
      );
      expect(userInfo.totalDividends).to.eq(waitedReward);
      expect(userInfo.totalClaimedDividends).to.eq(0);
    });
    // can add user dividends only by authorized contracts
    it("Should add user dividends only by authorized contracts", async () => {
      const {
        referralManager,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
        stakings,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc, referrer] = restSigners;
      const stakingContract = stakings[0].contract;

      await referralManager
        .connect(adminAccount)
        .authorizeContract(stakingContract.address);

      await autoSubscribeToReferral({
        referralManager,
        token: token1,
        tokenHolder: token1Holder,
        account: referrer,
      });

      await autoSubscribeToStaking(
        acc,
        token1,
        token1Holder,
        stakingContract,
        adminAccount
      );

      const amount = (await stakingContract.MIN_STAKE_LIMIT()).mul(2);
      await token1.connect(token1Holder).transfer(acc.address, amount);
      await token1
        .connect(acc)
        .approve(stakingContract.address, ethers.constants.MaxUint256);

      await expect(
        stakingContract
          .connect(acc)
          .deposit(amount.div(2), false, referrer.address)
      ).to.emit(referralManager, "ReferralAdded");

      await referralManager
        .connect(adminAccount)
        .removeContractAuthorization(stakingContract.address);

      await expect(
        stakingContract
          .connect(acc)
          .deposit(amount.div(2), false, referrer.address)
      ).to.be.revertedWith("Address not authorized");
    });
    // */
  });
  //*
  describe("Roles / Administration", () => {
    it("Should authorize contract only by admin", async () => {
      const { referralManager, adminAccount, restSigners } = await loadFixture(
        deployReferralManagerFixture
      );

      const [acc1, acc2, newContract] = restSigners;

      await expect(
        referralManager.connect(acc1).authorizeContract(newContract.address)
      ).to.be.reverted;
      expect(await referralManager.isAuthorized(newContract.address)).to.eq(
        false
      );

      await grantAdminRole(referralManager, adminAccount, acc2);

      await expect(
        referralManager.connect(acc2).authorizeContract(newContract.address)
      ).not.to.be.reverted;

      expect(await referralManager.isAuthorized(newContract.address)).to.eq(
        true
      );
    });

    it("Should remove contract authorization only by admin", async () => {
      const { referralManager, adminAccount, restSigners } = await loadFixture(
        deployReferralManagerFixture
      );

      const [acc1, acc2, newContract] = restSigners;

      await referralManager
        .connect(adminAccount)
        .authorizeContract(newContract.address);

      await expect(
        referralManager
          .connect(acc1)
          .removeContractAuthorization(newContract.address)
      ).to.be.reverted;
      expect(await referralManager.isAuthorized(newContract.address)).to.eq(
        true
      );

      await grantAdminRole(referralManager, adminAccount, acc2);

      await expect(
        referralManager
          .connect(acc2)
          .removeContractAuthorization(newContract.address)
      ).not.to.be.reverted;

      expect(await referralManager.isAuthorized(newContract.address)).to.eq(
        false
      );
    });

    it("Should update subscription period only by admin", async () => {
      const { referralManager, adminAccount, restSigners } = await loadFixture(
        deployReferralManagerFixture
      );

      const [acc1, acc2] = restSigners;

      await expect(referralManager.connect(acc1).updateSubscriptionPeriod(10))
        .to.be.reverted;
      expect(await referralManager.SUBSCRIPTION_PERIOD_DAYS()).to.eq(365);

      await grantAdminRole(referralManager, adminAccount, acc2);

      await expect(referralManager.connect(acc2).updateSubscriptionPeriod(10))
        .not.to.be.reverted;

      expect(await referralManager.SUBSCRIPTION_PERIOD_DAYS()).to.eq(10);
    });

    it("Should update referral percent only by admin", async () => {
      const { referralManager, adminAccount, restSigners } = await loadFixture(
        deployReferralManagerFixture
      );

      const [acc1, acc2] = restSigners;

      await expect(referralManager.connect(acc1).updateReferralPercent(1, 300))
        .to.be.reverted;
      expect(await referralManager.REFERRAL_PERCENTS(0)).to.eq(100);

      await grantAdminRole(referralManager, adminAccount, acc2);

      await expect(referralManager.connect(acc2).updateReferralPercent(0, 300))
        .to.be.reverted;
      await expect(referralManager.connect(acc2).updateReferralPercent(1, 300))
        .not.to.be.reverted;

      expect(await referralManager.REFERRAL_PERCENTS(0)).to.eq(300);

      await expect(referralManager.connect(acc2).updateReferralPercent(11, 300))
        .to.be.reverted;
    });

    it("Should update subscription token only by admin", async () => {
      const { referralManager, adminAccount, restSigners, token1 } =
        await loadFixture(deployReferralManagerFixture);

      const [acc1, acc2, newToken] = restSigners;

      await expect(
        referralManager.connect(acc1).updateSubscriptionToken(newToken.address)
      ).to.be.reverted;
      expect(await referralManager.subscriptionToken()).to.eq(token1.address);

      await grantAdminRole(referralManager, adminAccount, acc2);

      await expect(
        referralManager.connect(acc2).updateSubscriptionToken(newToken.address)
      ).not.to.be.reverted;

      expect(await referralManager.subscriptionToken()).to.eq(newToken.address);
    });

    it("Should update reward token only by admin", async () => {
      const { referralManager, adminAccount, restSigners, token2 } =
        await loadFixture(deployReferralManagerFixture);

      const [acc1, acc2, newToken] = restSigners;

      await expect(
        referralManager.connect(acc1).updateRewardToken(newToken.address)
      ).to.be.reverted;
      expect(await referralManager.rewardToken()).to.eq(token2.address);

      await grantAdminRole(referralManager, adminAccount, acc2);

      await expect(
        referralManager.connect(acc2).updateRewardToken(newToken.address)
      ).not.to.be.reverted;

      expect(await referralManager.rewardToken()).to.eq(newToken.address);
    });

    it("Should update reward pool only by admin", async () => {
      const { referralManager, adminAccount, restSigners } = await loadFixture(
        deployReferralManagerFixture
      );

      const [acc1, acc2, newPool] = restSigners;

      await expect(
        referralManager.connect(acc1).updateRewardPool(newPool.address)
      ).to.be.reverted;

      await grantAdminRole(referralManager, adminAccount, acc2);

      await expect(
        referralManager.connect(acc2).updateRewardPool(newPool.address)
      ).not.to.be.reverted;
    });

    it("Should update level subscription cost only by admin", async () => {
      const {
        referralManager,
        adminAccount,
        restSigners,
        levelSubscriptionCost,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc1, acc2] = restSigners;
      const newCost = BigNumber.from(10).pow(10);

      await expect(
        referralManager.connect(acc1).updateLevelSubscriptionCost(newCost)
      ).to.be.reverted;
      expect(await referralManager.levelSubscriptionCost()).to.eq(
        levelSubscriptionCost
      );

      await grantAdminRole(referralManager, adminAccount, acc2);

      await expect(
        referralManager.connect(acc2).updateLevelSubscriptionCost(newCost)
      ).not.to.be.reverted;

      expect(await referralManager.levelSubscriptionCost()).to.eq(newCost);
    });

    it("Should update full subscription cost only by admin", async () => {
      const {
        referralManager,
        adminAccount,
        restSigners,
        fullSubscriptionCost,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc1, acc2] = restSigners;
      const newCost = BigNumber.from(10).pow(10);

      await expect(
        referralManager.connect(acc1).updateFullSubscriptionCost(newCost)
      ).to.be.reverted;
      expect(await referralManager.fullSubscriptionCost()).to.eq(
        fullSubscriptionCost
      );

      await grantAdminRole(referralManager, adminAccount, acc2);

      await expect(
        referralManager.connect(acc2).updateFullSubscriptionCost(newCost)
      ).not.to.be.reverted;

      expect(await referralManager.fullSubscriptionCost()).to.eq(newCost);
    });
  });

  describe("Events", () => {
    it("Should emit Subscribed on level subscription", async () => {
      const {
        referralManager,
        restSigners,
        referralLevels,
        token1,
        token1Holder,
        levelSubscriptionCost,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc] = restSigners;
      const subscriptionCost = levelSubscriptionCost.mul(100);
      await token1
        .connect(token1Holder)
        .transfer(acc.address, subscriptionCost);
      await token1
        .connect(acc)
        .approve(referralManager.address, ethers.constants.MaxInt256);

      let timestamp = (await time.latest()) + 100;
      await time.setNextBlockTimestamp(timestamp);
      await expect(referralManager.connect(acc).subscribeToLevel(5))
        .to.emit(referralManager, "Subscribed")
        .withArgs(acc.address, 5, timestamp);

      await mine();
      timestamp = (await time.latest()) + 100;
      await time.setNextBlockTimestamp(timestamp);
      await expect(referralManager.connect(acc).subscribeToAllLevels())
        .to.emit(referralManager, "Subscribed")
        .withArgs(acc.address, referralLevels + 1, timestamp);
    });
    it("Should emit ReferralAdded", async () => {
      const {
        referralManager,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
        stakings,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc, referrer] = restSigners;
      const stakingContract = stakings[0].contract;

      await referralManager
        .connect(adminAccount)
        .authorizeContract(stakingContract.address);

      await autoSubscribeToReferral({
        referralManager,
        token: token1,
        tokenHolder: token1Holder,
        account: referrer,
      });

      await autoSubscribeToStaking(
        acc,
        token1,
        token1Holder,
        stakingContract,
        adminAccount
      );

      const amount = await stakingContract.MIN_STAKE_LIMIT();
      await token1.connect(token1Holder).transfer(acc.address, amount);
      await token1
        .connect(acc)
        .approve(stakingContract.address, ethers.constants.MaxUint256);

      await expect(
        stakingContract.connect(acc).deposit(amount, false, referrer.address)
      )
        .to.emit(referralManager, "ReferralAdded")
        .withArgs(referrer.address, acc.address);
    });
  });
  // */
  //*
  describe("Helpers", () => {
    // getReferralLevels
    it("Should return referral levels", async () => {
      const { referralManager, referralLevels } = await loadFixture(
        deployReferralManagerFixture
      );

      expect(await referralManager.getReferralLevels()).to.eq(referralLevels);
      expect(await referralManager.LEVELS()).to.eq(referralLevels);
    });
    // getUserInfo
    it("Should return user info", async () => {
      const {
        referralManager,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
        stakings,
      } = await loadFixture(deployReferralManagerFixture);

      let secondLevelPartners = 3;
      const getStakeParams = (level: number, params: any) => {
        if (level === 2 && secondLevelPartners > 1) {
          secondLevelPartners--;
          return { ...params, repeat: true };
        }
        return { ...params, repeat: false };
      };

      const [referrer, account] = await createReferralChain({
        token: token1,
        tokenHolder: token1Holder,
        referralManager,
        stakingContract: stakings[0].contract,
        signers: restSigners,
        adminAccount,
        getStakeParams,
        levels: 5,
      });

      const accInfo = await referralManager.getUserInfo(account.address);
      expect(accInfo.totalReferrals).to.eq(6);
      expect(accInfo.referrals_1_lvl).to.eq(3);
      expect(accInfo.referrer).to.eq(referrer.address);
      expect(accInfo.totalClaimedDividends).to.eq(0);
    });
    // getUserReferrer
    it("Should return user referrer", async () => {
      const {
        referralManager,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc, referrer, authorizedAcc] = restSigners;

      await referralManager
        .connect(adminAccount)
        .authorizeContract(authorizedAcc.address);

      await autoSubscribeToReferral({
        referralManager,
        token: token1,
        tokenHolder: token1Holder,
        account: referrer,
      });

      await referralManager
        .connect(authorizedAcc)
        .setUserReferrer(acc.address, referrer.address);

      expect(await referralManager.getUserReferrer(acc.address)).to.eq(
        referrer.address
      );
      expect(await referralManager.getUserReferrer(referrer.address)).to.eq(
        ethers.constants.AddressZero
      );
    });
    // getUser1LvlReferrals
    it("Should return user 1 lvl referrals", async () => {
      const {
        referralManager,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
        stakings,
      } = await loadFixture(deployReferralManagerFixture);

      let firstLevelPartners = 5;
      const getStakeParams = (level: number, params: any) => {
        if (level === 1 && firstLevelPartners > 1) {
          firstLevelPartners--;
          return { ...params, repeat: true };
        }
        return { ...params, repeat: false };
      };

      const [referrer, ...referralSigners] = await createReferralChain({
        token: token1,
        tokenHolder: token1Holder,
        referralManager,
        stakingContract: stakings[0].contract,
        levels: 3,
        signers: restSigners,
        adminAccount,
        getStakeParams,
      });

      const referralInfo = await referralManager.getUserInfo(referrer.address);
      expect(referralInfo.totalReferrals).to.eq(7);
      expect(referralInfo.referrals_1_lvl).to.eq(5);

      const lvl1Addresses = referralSigners
        .filter((signer) => signer.level === 1)
        .map((signer) => signer.address);
      const referrals = await referralManager.getUser1LvlReferrals(
        referrer.address
      );

      expect(lvl1Addresses).to.have.members(referrals);
    });
    // getUserReferrals
    it("Should return user referrals", async () => {
      const {
        referralManager,
        referralLevels,
        restSigners,
        adminAccount,
        token1,
        token1Holder,
        stakings,
      } = await loadFixture(deployReferralManagerFixture);

      let firstLevelPartners = 3;
      const getStakeParams = (level: number, params: any) => {
        if (level === 1 && firstLevelPartners > 1) {
          firstLevelPartners--;
          return { ...params, repeat: true };
        }
        return { ...params, repeat: false };
      };

      const [referrer, ...referralSigners] = await createReferralChain({
        token: token1,
        tokenHolder: token1Holder,
        referralManager,
        stakingContract: stakings[0].contract,
        signers: restSigners,
        adminAccount,
        getStakeParams,
        levels: 12,
      });

      const referralInfo = await referralManager.getUserInfo(referrer.address);
      expect(referralInfo.totalReferrals).to.eq(12);
      expect(referralInfo.referrals_1_lvl).to.eq(3);

      const refAddresses = referralSigners
        .filter((signer) => signer.level <= referralLevels)
        .map((signer) => signer.address);
      const ref1lvlAddresses = referralSigners
        .filter((signer) => signer.level === 1)
        .map((signer) => signer.address);

      const contractReferralsData = await referralManager.getUserReferrals(
        referrer.address,
        0
      );
      const contractReferrals = contractReferralsData.map(
        (ref) => ref.referralAddress
      );
      const contract1lvlReferrals = contractReferralsData
        .filter((ref) => ref.level.toString() === "1")
        .map((ref) => ref.referralAddress);

      expect(contract1lvlReferrals).to.have.members(ref1lvlAddresses);
      expect(contractReferrals).to.have.members(refAddresses);
    });
    // userHasSubscription
    it("Should return user has subscription", async () => {
      const {
        referralManager,
        restSigners,
        referralLevels,
        token1,
        token1Holder,
      } = await loadFixture(deployReferralManagerFixture);

      const [acc] = restSigners;

      await autoSubscribeToReferral({
        referralManager,
        token: token1,
        tokenHolder: token1Holder,
        account: acc,
      });

      await time.increase(365 * secondsInDay - 5);
      expect(await referralManager.userHasSubscription(acc.address, 1)).to.eq(
        true
      );
      expect(await referralManager.userHasSubscription(acc.address, 2)).to.eq(
        false
      );
      expect(
        await referralManager.userHasSubscription(acc.address, referralLevels)
      ).to.eq(false);

      await time.increase(10);
      expect(await referralManager.userHasSubscription(acc.address, 1)).to.eq(
        false
      );
    });
    // calculateRefReward
    it("Should calculate referrer reward", async () => {
      const { referralManager } = await loadFixture(
        deployReferralManagerFixture
      );

      await expect(referralManager.calculateRefReward(100, 0)).to.be.reverted;
      expect(await referralManager.calculateRefReward(100, 1)).to.eq(100);
      expect(await referralManager.calculateRefReward(100, 2)).to.eq(90);
      expect(await referralManager.calculateRefReward(100, 3)).to.eq(80);
      expect(await referralManager.calculateRefReward(100, 4)).to.eq(70);
      expect(await referralManager.calculateRefReward(100, 5)).to.eq(60);
      expect(await referralManager.calculateRefReward(100, 6)).to.eq(50);
      expect(await referralManager.calculateRefReward(100, 7)).to.eq(40);
      expect(await referralManager.calculateRefReward(100, 8)).to.eq(30);
      expect(await referralManager.calculateRefReward(100, 9)).to.eq(20);
      expect(await referralManager.calculateRefReward(100, 10)).to.eq(10);
      await expect(referralManager.calculateRefReward(100, 11)).to.be.reverted;
    });
    // isAuthorized
    it("Should return is contract authorized", async () => {
      const { referralManager, adminAccount, restSigners } = await loadFixture(
        deployReferralManagerFixture
      );

      const [newContract] = restSigners;

      expect(await referralManager.isAuthorized(newContract.address)).to.eq(
        false
      );

      await referralManager
        .connect(adminAccount)
        .authorizeContract(newContract.address);
      expect(await referralManager.isAuthorized(newContract.address)).to.eq(
        true
      );

      await referralManager
        .connect(adminAccount)
        .removeContractAuthorization(newContract.address);
      expect(await referralManager.isAuthorized(newContract.address)).to.eq(
        false
      );
    });
  });
  // */
});
