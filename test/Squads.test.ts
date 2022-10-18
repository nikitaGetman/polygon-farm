import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { Squads__factory } from "typechain-types";
import {
  autoStakeToken,
  autoSubscribeToReferral,
  autoSubscribeToSquad,
  autoSubscribeToStaking,
  deployReferralManagerFixture,
  deploySquadsFixture,
  grantAdminRole,
} from "./helpers";
import { SQUADS } from "config";

const ONE_YEAR_SECS = 60 * 60 * 24 * 365;

describe("Squads", () => {
  //*
  it("Should deploy with correct params", async () => {
    const { adminAccount, referralManager, token1, stakingContract } =
      await loadFixture(deployReferralManagerFixture);

    const squadsManager = new Squads__factory(adminAccount);

    await expect(
      squadsManager.deploy(
        ethers.constants.AddressZero,
        referralManager.address,
        stakingContract.address
      )
    ).to.be.reverted;

    await expect(
      squadsManager.deploy(
        token1.address,
        ethers.constants.AddressZero,
        stakingContract.address
      )
    ).to.be.reverted;

    await expect(
      squadsManager.deploy(
        token1.address,
        referralManager.address,
        ethers.constants.AddressZero
      )
    ).to.be.reverted;

    await expect(
      squadsManager.deploy(
        token1.address,
        referralManager.address,
        stakingContract.address
      )
    ).not.to.be.reverted;
  });

  it("Should subscribe", async () => {
    const {
      squads,
      adminAccount,
      squadsManager,
      restSigners,
      token1,
      token1Holder,
    } = await loadFixture(deploySquadsFixture);

    const [acc1] = restSigners;

    // Should not subscribe without tokens
    await expect(squadsManager.connect(acc1).subscribe(0)).to.be.reverted;

    // Should not subscribe with wrong  planId
    await expect(
      squadsManager.connect(acc1).subscribe(squads.length)
    ).to.be.revertedWith("Incorrect plan id");

    await token1
      .connect(token1Holder)
      .transfer(
        acc1.address,
        BigNumber.from(squads.slice(-1)[0].subscriptionCost).mul(10)
      );

    await token1
      .connect(acc1)
      .approve(squadsManager.address, ethers.constants.MaxUint256);

    for (let i = 0; i < squads.length; i++) {
      expect(
        await squadsManager.userHasPlanSubscription(acc1.address, i)
      ).to.eq(false);

      const timestamp = (await time.latest()) + 100;
      await time.setNextBlockTimestamp(timestamp);
      await expect(squadsManager.connect(acc1).subscribe(i))
        .to.changeTokenBalance(
          token1,
          acc1.address,
          BigNumber.from(squads[i].subscriptionCost).mul(-1)
        )
        .to.emit(squadsManager, "Subscribed")
        .withArgs(acc1.address, i, timestamp);

      expect(
        await squadsManager.userHasPlanSubscription(acc1.address, i)
      ).to.eq(true);

      // Subscription expires after 1 year

      await time.increase(ONE_YEAR_SECS - 10);

      expect(
        await squadsManager.userHasPlanSubscription(acc1.address, i)
      ).to.eq(true);

      await time.increase(20);

      expect(
        await squadsManager.userHasPlanSubscription(acc1.address, i)
      ).to.eq(false);

      // Should not subscribe with inactive planId
      await squadsManager.connect(adminAccount).updatePlanActivity(0, false);

      await expect(squadsManager.connect(acc1).subscribe(0)).to.be.revertedWith(
        "Plan is not active"
      );

      await squadsManager.connect(adminAccount).updatePlanActivity(0, true);

      await expect(squadsManager.connect(acc1).subscribe(0)).not.to.be.reverted;
    }
  });
  // */
  it("Should add member in squad", async () => {
    const {
      squadsManager,
      stakingContract,
      adminAccount,
      referralManager,
      restSigners,
      token1,
      token1Holder,
    } = await loadFixture(deploySquadsFixture);

    const [referrer, acc1, acc2, acc3, acc4, newStaking] = restSigners;

    const squadPlanIndex = 0;
    const squadPlan = SQUADS[squadPlanIndex];
    const stakeAmount = BigNumber.from(squadPlan.stakingThreshold);

    await autoSubscribeToReferral({
      token: token1,
      tokenHolder: token1Holder,
      referralManager,
      account: referrer,
      levels: 1,
    });

    await autoSubscribeToSquad({
      token: token1,
      tokenHolder: token1Holder,
      account: referrer,
      squadsManager,
      planId: squadPlanIndex,
    });

    // Should not add member if user has no sufficient staking
    const commonStakingProps = {
      planId: 1,
      token1,
      token1Holder,
      stakingContract,
      adminAccount,
      referrer,
      stakeAmount,
    };
    // staking sufficient for other plan
    await autoStakeToken({
      ...commonStakingProps,
      stakeAmount: BigNumber.from(SQUADS[2].stakingThreshold),
      referrer: undefined,
      acc: referrer,
    });

    await autoStakeToken({ ...commonStakingProps, acc: acc1 });

    let members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(0);

    // Add staking for user
    await autoStakeToken({
      ...commonStakingProps,
      referrer: undefined,
      acc: referrer,
    });

    members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(0);

    // Should not add member if it stakes less than threshold
    await autoStakeToken({
      ...commonStakingProps,
      acc: acc1,
      stakeAmount: undefined, // stake amount is min available in staking contract
    });

    members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(0);

    // Should not add member if it stakes in wrong staking plan
    await autoStakeToken({
      ...commonStakingProps,
      acc: acc1,
      planId: 0,
    });

    members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(0);

    // Should add member if it stakes enough
    await autoStakeToken({ ...commonStakingProps, acc: acc1 });

    members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(1);
    expect(members[0]).to.eq(acc1.address);

    // Should not add member if member is zero address
    await expect(
      squadsManager.tryToAddMember(
        0,
        referrer.address,
        ethers.constants.AddressZero,
        stakeAmount
      )
    ).to.be.reverted;

    // Should not add member if staking contract not authorized
    await squadsManager
      .connect(adminAccount)
      .updateStakingContract(ethers.constants.AddressZero);

    await autoStakeToken({ ...commonStakingProps, acc: acc2 });

    members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(1);
    expect(members[0]).to.eq(acc1.address);

    await squadsManager
      .connect(adminAccount)
      .updateStakingContract(stakingContract.address);

    // Set staking manually for acc2
    await autoSubscribeToStaking(
      1,
      acc2,
      token1,
      token1Holder,
      stakingContract
    );
    await token1.connect(token1Holder).transfer(acc2.address, stakeAmount);

    await expect(
      stakingContract
        .connect(acc2)
        .deposit(1, stakeAmount, false, referrer.address)
    )
      .to.emit(squadsManager, "MemberAdded")
      .withArgs(referrer.address, squadPlanIndex, acc2.address, 2);

    members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(2);
    expect(members[0]).to.eq(acc1.address);
    expect(members[1]).to.eq(acc2.address);

    // Should not add member if it already in squad
    await autoStakeToken({
      planId: 1,
      token1,
      token1Holder,
      stakingContract,
      acc: acc1,
      referrer,
      stakeAmount,
    });

    members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(2);
    expect(members[0]).to.eq(acc1.address);
    expect(members[1]).to.eq(acc2.address);

    // Should not add member if user has no plan subscription
    expect(await squadsManager.userHasPlanSubscription(acc1.address, 1)).to.eq(
      false
    );

    await autoStakeToken({
      ...commonStakingProps,
      acc: acc1,
      stakeAmount: BigNumber.from(SQUADS[1].stakingThreshold),
    });

    members = await squadsManager.getUserSquadMembers(referrer.address, 1);
    expect(members.length).to.eq(0);

    // Should add only first level referrals in team
    await autoSubscribeToReferral({
      token: token1,
      tokenHolder: token1Holder,
      referralManager,
      account: acc3,
      levels: 1,
    });

    await autoSubscribeToSquad({
      token: token1,
      tokenHolder: token1Holder,
      account: acc3,
      squadsManager,
      planId: squadPlanIndex,
    });

    await autoStakeToken({ ...commonStakingProps, acc: acc3 });

    members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(3);
    expect(members[0]).to.eq(acc1.address);
    expect(members[1]).to.eq(acc2.address);
    expect(members[2]).to.eq(acc3.address);

    await autoStakeToken({ ...commonStakingProps, referrer: acc3, acc: acc4 });

    members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(3);
    expect(members[0]).to.eq(acc1.address);
    expect(members[1]).to.eq(acc2.address);
    expect(members[2]).to.eq(acc3.address);

    members = await squadsManager.getUserSquadMembers(
      acc3.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(1);
    expect(members[0]).to.eq(acc4.address);
  });

  it("Should fill squad and add reward", async () => {
    const {
      squadsManager,
      stakingContract,
      adminAccount,
      referralManager,
      restSigners,
      token1,
      token1Holder,
    } = await loadFixture(deploySquadsFixture);

    const [referrer, acc1, acc2, acc3, acc4, acc5, acc6] = restSigners;

    let squadPlanIndex = 0;
    let squadPlan = SQUADS[squadPlanIndex];
    let stakeAmount = BigNumber.from(squadPlan.stakingThreshold);

    await autoSubscribeToReferral({
      token: token1,
      tokenHolder: token1Holder,
      referralManager,
      account: referrer,
      levels: 1,
    });

    await autoSubscribeToSquad({
      token: token1,
      tokenHolder: token1Holder,
      account: referrer,
      squadsManager,
      planId: squadPlanIndex,
    });

    await autoStakeToken({
      planId: 1,
      token1,
      token1Holder,
      stakingContract,
      acc: referrer,
      stakeAmount,
    });

    // Fill squad
    const commonStakingProps = {
      planId: 1,
      token1,
      token1Holder,
      stakingContract,
      adminAccount,
      referrer,
      stakeAmount,
    };
    await autoStakeToken({ ...commonStakingProps, acc: acc1 });
    await autoStakeToken({ ...commonStakingProps, acc: acc2 });
    await autoStakeToken({ ...commonStakingProps, acc: acc3 });
    await autoStakeToken({ ...commonStakingProps, acc: acc4 });
    await autoStakeToken({ ...commonStakingProps, acc: acc5 });

    let members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(5);
    expect(members[0]).to.eq(acc1.address);
    expect(members[1]).to.eq(acc2.address);
    expect(members[2]).to.eq(acc3.address);
    expect(members[3]).to.eq(acc4.address);
    expect(members[4]).to.eq(acc5.address);

    // Add last member
    await autoSubscribeToStaking(
      1,
      acc6,
      token1,
      token1Holder,
      stakingContract
    );
    await token1.connect(token1Holder).transfer(acc6.address, stakeAmount);

    await expect(
      stakingContract
        .connect(acc6)
        .deposit(1, stakeAmount, false, referrer.address)
    )
      .to.emit(squadsManager, "SquadFilled")
      .withArgs(referrer.address, squadPlanIndex, 1);

    // Subscription expires after team filled
    let squadInfo = await squadsManager.getUserSquadInfo(
      squadPlanIndex,
      referrer.address
    );
    expect(squadInfo.subscription).to.eq(0);
    expect(squadInfo.squadsFilled).to.eq(1);

    let refRewardInfo = await referralManager.getUserInfo(referrer.address);
    const stakeProfit = await stakingContract.calculateStakeProfit(
      1,
      stakeAmount
    );
    const refReward = await referralManager.calculateRefReward(stakeProfit, 1);
    const squadReward = refRewardInfo.totalDividends.sub(refReward.mul(6));
    expect(squadReward).to.eq(squadPlan.reward);

    members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(6);
    expect(members[0]).to.eq(acc1.address);
    expect(members[1]).to.eq(acc2.address);
    expect(members[2]).to.eq(acc3.address);
    expect(members[3]).to.eq(acc4.address);
    expect(members[4]).to.eq(acc5.address);
    expect(members[5]).to.eq(acc6.address);

    await referralManager
      .connect(referrer)
      .claimDividends(refRewardInfo.totalDividends);

    // -----------------
    // Filling squad second time
    // -----------------
    await autoSubscribeToSquad({
      token: token1,
      tokenHolder: token1Holder,
      account: referrer,
      squadsManager,
      planId: squadPlanIndex,
    });

    await autoStakeToken({ ...commonStakingProps, acc: acc1 });
    await autoStakeToken({ ...commonStakingProps, acc: acc2 });
    await autoStakeToken({ ...commonStakingProps, acc: acc3 });
    await autoStakeToken({ ...commonStakingProps, acc: acc4 });
    await autoStakeToken({ ...commonStakingProps, acc: acc5 });

    members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(5);
    expect(members[0]).to.eq(acc1.address);
    expect(members[1]).to.eq(acc2.address);
    expect(members[2]).to.eq(acc3.address);
    expect(members[3]).to.eq(acc4.address);
    expect(members[4]).to.eq(acc5.address);

    // Add last member
    await autoSubscribeToStaking(
      1,
      acc6,
      token1,
      token1Holder,
      stakingContract
    );
    await token1.connect(token1Holder).transfer(acc6.address, stakeAmount);

    await expect(
      stakingContract
        .connect(acc6)
        .deposit(1, stakeAmount, false, referrer.address)
    )
      .to.emit(squadsManager, "SquadFilled")
      .withArgs(referrer.address, squadPlanIndex, 2);

    await referralManager
      .connect(referrer)
      .claimDividends(refReward.mul(6).add(squadPlan.reward));

    squadInfo = await squadsManager.getUserSquadInfo(
      squadPlanIndex,
      referrer.address
    );
    expect(squadInfo.subscription).to.eq(0);
    expect(squadInfo.squadsFilled).to.eq(2);

    members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(6);
    expect(members[0]).to.eq(acc1.address);
    expect(members[1]).to.eq(acc2.address);
    expect(members[2]).to.eq(acc3.address);
    expect(members[3]).to.eq(acc4.address);
    expect(members[4]).to.eq(acc5.address);
    expect(members[5]).to.eq(acc6.address);

    // -----------------
    // Filling new squad after referral subscription expires
    // -----------------
    squadPlanIndex = 1;
    squadPlan = SQUADS[squadPlanIndex];
    stakeAmount = BigNumber.from(squadPlan.stakingThreshold);
    commonStakingProps.stakeAmount = stakeAmount;

    await time.increase(ONE_YEAR_SECS + 10);

    expect(
      await referralManager.userHasSubscription(referrer.address, 1)
    ).to.eq(false);

    await autoSubscribeToSquad({
      token: token1,
      tokenHolder: token1Holder,
      account: referrer,
      squadsManager,
      planId: squadPlanIndex,
    });

    await autoStakeToken({
      planId: 1,
      token1,
      token1Holder,
      stakingContract,
      acc: referrer,
      stakeAmount,
    });

    await autoStakeToken({ ...commonStakingProps, acc: acc1 });
    await autoStakeToken({ ...commonStakingProps, acc: acc2 });
    await autoStakeToken({ ...commonStakingProps, acc: acc3 });
    await autoStakeToken({ ...commonStakingProps, acc: acc4 });
    await autoStakeToken({ ...commonStakingProps, acc: acc5 });

    // Add last member
    await autoSubscribeToStaking(
      1,
      acc6,
      token1,
      token1Holder,
      stakingContract
    );
    await token1.connect(token1Holder).transfer(acc6.address, stakeAmount);

    await expect(
      stakingContract
        .connect(acc6)
        .deposit(1, stakeAmount, false, referrer.address)
    )
      .to.emit(squadsManager, "SquadFilled")
      .withArgs(referrer.address, squadPlanIndex, 1);

    // Subscription expires after team filled
    squadInfo = await squadsManager.getUserSquadInfo(
      squadPlanIndex,
      referrer.address
    );
    expect(squadInfo.subscription).to.eq(0);
    expect(squadInfo.squadsFilled).to.eq(1);

    refRewardInfo = await referralManager.getUserInfo(referrer.address);

    const totalReward = refRewardInfo.totalDividends.sub(
      refRewardInfo.totalClaimedDividends
    );

    expect(totalReward).to.eq(squadPlan.reward);

    // Check getUserSquadsInfo
    const squadsInfo = await squadsManager.getUserSquadsInfo(referrer.address);

    expect(squadsInfo[0].subscription).to.eq(0);
    expect(squadsInfo[0].squadsFilled).to.eq(2);
    expect(squadsInfo[1].subscription).to.eq(0);
    expect(squadsInfo[1].squadsFilled).to.eq(1);
    expect(squadsInfo[2].subscription).to.eq(0);
    expect(squadsInfo[2].squadsFilled).to.eq(0);

    members = await squadsManager.getUserSquadMembers(
      referrer.address,
      squadPlanIndex
    );
    expect(members.length).to.eq(6);
    expect(members[0]).to.eq(acc1.address);
    expect(members[1]).to.eq(acc2.address);
    expect(members[2]).to.eq(acc3.address);
    expect(members[3]).to.eq(acc4.address);
    expect(members[4]).to.eq(acc5.address);
    expect(members[5]).to.eq(acc6.address);

    members = await squadsManager.getUserSquadMembers(referrer.address, 0);
    expect(members.length).to.eq(6);
    expect(members[0]).to.eq(acc1.address);
    expect(members[1]).to.eq(acc2.address);
    expect(members[2]).to.eq(acc3.address);
    expect(members[3]).to.eq(acc4.address);
    expect(members[4]).to.eq(acc5.address);
    expect(members[5]).to.eq(acc6.address);
  });

  it("Should return sufficient planId by staking amount", async () => {
    const { squads, squadsManager } = await loadFixture(deploySquadsFixture);

    expect(await squadsManager.getSufficientPlanIdByStakingAmount(0)).to.eq(-1);

    //   amount == threshold
    for (let i = 0; i < squads.length; i++) {
      const { stakingThreshold } = squads[i];
      expect(
        await squadsManager.getSufficientPlanIdByStakingAmount(stakingThreshold)
      ).to.eq(i);
    }
    //   amount == threshold - 1
    for (let i = 0; i < squads.length; i++) {
      const { stakingThreshold } = squads[i];
      expect(
        await squadsManager.getSufficientPlanIdByStakingAmount(
          BigNumber.from(stakingThreshold).sub(1)
        )
      ).to.eq(i - 1);
    }
    //   amount == threshold + 1
    for (let i = 0; i < squads.length; i++) {
      const { stakingThreshold } = squads[i];
      expect(
        await squadsManager.getSufficientPlanIdByStakingAmount(
          BigNumber.from(stakingThreshold).add(1)
        )
      ).to.eq(i);
    }
  });
  //*
  describe("Roles / Administration", () => {
    // addPlan + getPlans
    it("Should add plan only by Admin", async () => {
      const { squadsManager, restSigners, adminAccount } = await loadFixture(
        deploySquadsFixture
      );

      const [acc] = restSigners;

      const plans = await squadsManager.getPlans();

      const subscriptionCost = BigNumber.from(10).pow(18).mul(250);
      const stakingThreshold = BigNumber.from(10).pow(18).mul(750);
      const reward = stakingThreshold;
      const squadSize = 10;
      const stakingPlanId = 2;

      await expect(
        squadsManager
          .connect(acc)
          .addPlan(
            subscriptionCost,
            reward,
            stakingThreshold,
            squadSize,
            stakingPlanId
          )
      ).to.be.reverted;

      await grantAdminRole(squadsManager, adminAccount, acc);

      await expect(
        squadsManager
          .connect(acc)
          .addPlan(
            subscriptionCost,
            reward,
            stakingThreshold,
            squadSize,
            stakingPlanId
          )
      )
        .to.emit(squadsManager, "SquadPlanCreated")
        .withArgs(
          3,
          subscriptionCost,
          reward,
          stakingThreshold,
          squadSize,
          stakingPlanId
        );

      const newPlans = await squadsManager.getPlans();
      const lastPlan = newPlans[newPlans.length - 1];

      expect(newPlans.length).to.eq(plans.length + 1);
      expect(lastPlan.subscriptionCost).to.eq(subscriptionCost);
      expect(lastPlan.stakingThreshold).to.eq(stakingThreshold);
      expect(lastPlan.reward).to.eq(reward);
      expect(lastPlan.squadSize).to.eq(squadSize);
      expect(lastPlan.stakingPlanId).to.eq(stakingPlanId);
    });

    it("Should update plan params only by Admin", async () => {
      // updatePlanSubscriptionCost
      // updatePlanReward
      // updatePlanStakingThreshold
      // updatePlanSquadSize
      // updatePlanAuthorizedContract
      // updatePlanActivity
      const { squadsManager, restSigners, adminAccount } = await loadFixture(
        deploySquadsFixture
      );

      const [acc] = restSigners;

      const planId = 1;
      const subscriptionCost = BigNumber.from(10).pow(18).mul(250);
      const stakingThreshold = BigNumber.from(10).pow(18).mul(750);
      const reward = stakingThreshold;
      const squadSize = 10;
      const stakingPlanId = 1;

      await expect(
        squadsManager
          .connect(acc)
          .updatePlanSubscriptionCost(planId, subscriptionCost)
      ).to.be.reverted;
      await expect(squadsManager.connect(acc).updatePlanReward(planId, reward))
        .to.be.reverted;
      await expect(
        squadsManager
          .connect(acc)
          .updatePlanStakingThreshold(planId, stakingThreshold)
      ).to.be.reverted;
      await expect(
        squadsManager.connect(acc).updatePlanSquadSize(planId, squadSize)
      ).to.be.reverted;
      await expect(squadsManager.connect(acc).updatePlanStakingId(planId, 0)).to
        .be.reverted;
      await expect(squadsManager.connect(acc).updatePlanActivity(planId, false))
        .to.be.reverted;

      const plans = await squadsManager.getPlans();
      const plan = plans[planId];

      expect(plan.subscriptionCost).to.eq(SQUADS[planId].subscriptionCost);
      expect(plan.stakingThreshold).to.eq(SQUADS[planId].stakingThreshold);
      expect(plan.reward).to.eq(SQUADS[planId].reward);
      expect(plan.squadSize).to.eq(SQUADS[planId].squadSize);
      expect(plan.stakingPlanId).to.eq(stakingPlanId);

      await grantAdminRole(squadsManager, adminAccount, acc);

      await squadsManager
        .connect(acc)
        .updatePlanSubscriptionCost(planId, subscriptionCost);
      await squadsManager.connect(acc).updatePlanReward(planId, reward);
      await squadsManager
        .connect(acc)
        .updatePlanStakingThreshold(planId, stakingThreshold);
      await squadsManager.connect(acc).updatePlanSquadSize(planId, squadSize);
      await squadsManager.connect(acc).updatePlanStakingId(planId, 0);
      await expect(squadsManager.connect(acc).updatePlanActivity(planId, false))
        .to.emit(squadsManager, "SquadActivityChanged")
        .withArgs(planId, false);

      const newPlans = await squadsManager.getPlans();
      const newPlan = newPlans[planId];

      expect(newPlan.subscriptionCost).to.eq(subscriptionCost);
      expect(newPlan.stakingThreshold).to.eq(stakingThreshold);
      expect(newPlan.reward).to.eq(reward);
      expect(newPlan.squadSize).to.eq(squadSize);
      expect(newPlan.stakingPlanId).to.eq(0);
    });

    it("Should change contract params only by admin", async () => {
      // updateSubscriptionPeriod + updateSubscriptionToken + updateSubscriptionPeriod
      const { squadsManager, restSigners, adminAccount } = await loadFixture(
        deploySquadsFixture
      );

      const [acc, newToken, newRefManager] = restSigners;

      await expect(squadsManager.connect(acc).updateSubscriptionPeriod(1)).to.be
        .reverted;
      await expect(
        squadsManager.connect(acc).updateSubscriptionToken(newToken.address)
      ).to.be.reverted;
      await expect(
        squadsManager
          .connect(acc)
          .updateSubscriptionReferralManager(newRefManager.address)
      ).to.be.reverted;

      await grantAdminRole(squadsManager, adminAccount, acc);

      await expect(squadsManager.connect(acc).updateSubscriptionPeriod(1)).not
        .to.be.reverted;
      await expect(
        squadsManager.connect(acc).updateSubscriptionToken(newToken.address)
      ).not.to.be.reverted;
      await expect(
        squadsManager
          .connect(acc)
          .updateSubscriptionReferralManager(newRefManager.address)
      ).not.to.be.reverted;

      expect(await squadsManager.SUBSCRIPTION_PERIOD_DAYS()).to.eq(1);
      expect(await squadsManager.subscriptionToken()).to.eq(newToken.address);
      expect(await squadsManager.referralManager()).to.eq(
        newRefManager.address
      );
    });
  });
  // */
});
