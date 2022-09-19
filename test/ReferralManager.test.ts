import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import {
  Staking__factory,
  Token1__factory,
  Token2__factory,
  ReferralManager__factory,
  Staking,
} from "typechain-types";
import { grantAdminRole } from "./helpers";

describe("ReferralManager", () => {
  async function deployFixture() {
    const [
      adminAccount,
      token1Holder,
      stakingRewardPool,
      token2Holder,
      referralRewardPool,
      ...restSigners
    ] = await ethers.getSigners();

    // Deploy Tokens
    const initialSupply = BigNumber.from(10).pow(18).mul(21_000_000);
    const token1 = await new Token1__factory(adminAccount).deploy(
      initialSupply,
      token1Holder.address
    );
    await token1.deployed();
    await token1
      .connect(token1Holder)
      .transfer(stakingRewardPool.address, initialSupply);

    const token2 = await new Token2__factory(adminAccount).deploy(
      initialSupply,
      token2Holder.address
    );
    await token2.deployed();
    await token2
      .connect(token2Holder)
      .transfer(referralRewardPool.address, initialSupply);

    // Deploy ReferralManager
    const referralLevels = 10;
    const fullSubscriptionCost = BigNumber.from(10).pow(18).mul(5);
    const levelSubscriptionCost = BigNumber.from(10).pow(18);

    const referralManager = await new ReferralManager__factory(
      adminAccount
    ).deploy(
      token1.address,
      token2.address,
      referralRewardPool.address,
      fullSubscriptionCost,
      levelSubscriptionCost
    );
    await referralManager.deployed();

    // Deploy Staking contracts
    const minStakeLimit = BigNumber.from(10).pow(17);
    const stakings = [
      {
        durationDays: 1,
        rewardPercent: 100,
        subscriptionCost: BigNumber.from(10).pow(18),
        subscriptionPeriod: 365,
        contract: {} as Staking,
      },
      {
        durationDays: 3,
        rewardPercent: 300,
        subscriptionCost: BigNumber.from(10).pow(18),
        subscriptionPeriod: 365,
        contract: {} as Staking,
      },
    ];

    for (let i = 0; i < stakings.length; i++) {
      const stakingContract = await new Staking__factory(adminAccount).deploy(
        token1.address,
        token2.address,
        stakingRewardPool.address,
        referralManager.address,
        stakings[i].durationDays,
        stakings[i].rewardPercent,
        stakings[i].subscriptionCost,
        stakings[i].subscriptionPeriod
      );
      await stakingContract.deployed();

      await token1
        .connect(stakingRewardPool)
        .approve(stakingContract.address, ethers.constants.MaxUint256);
      await token2
        .connect(adminAccount)
        .addToWhitelist([stakingContract.address, referralManager.address]);

      stakings[i].contract = stakingContract;
    }

    // Add Approves
    await token2
      .connect(referralRewardPool)
      .approve(referralManager.address, ethers.constants.MaxUint256);
    await token2
      .connect(adminAccount)
      .addToWhitelist([referralManager.address]);

    return {
      adminAccount,
      token1Holder,
      token2Holder,
      token1,
      token2,
      initialSupply,
      referralManager,
      fullSubscriptionCost,
      levelSubscriptionCost,
      referralLevels,
      stakings,
      stakingRewardPool,
      referralRewardPool,
      restSigners,
      minStakeLimit,
    };
  }

  describe("Deployment", () => {
    it("Should not deploy with incorrect initial data", async () => {
      const {
        token1,
        token2,
        referralRewardPool,
        adminAccount,
        fullSubscriptionCost,
        levelSubscriptionCost,
      } = await loadFixture(deployFixture);

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
      } = await loadFixture(deployFixture);

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

  describe("Subscription", () => {});

  describe("Referral rewards", () => {});

  describe("Roles / Administration", () => {
    it("Should authorize contract only by admin", async () => {
      const { referralManager, adminAccount, restSigners } = await loadFixture(
        deployFixture
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
        deployFixture
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
        deployFixture
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
        deployFixture
      );

      const [acc1, acc2] = restSigners;

      await expect(referralManager.connect(acc1).updateReferralPercent(0, 300))
        .to.be.reverted;
      expect(await referralManager.REFERRAL_PERCENTS(0)).to.eq(100);

      await grantAdminRole(referralManager, adminAccount, acc2);

      await expect(referralManager.connect(acc2).updateReferralPercent(0, 300))
        .not.to.be.reverted;

      expect(await referralManager.REFERRAL_PERCENTS(0)).to.eq(300);

      await expect(referralManager.connect(acc2).updateReferralPercent(10, 300))
        .to.be.reverted;
    });

    it("Should update subscription token only by admin", async () => {
      const { referralManager, adminAccount, restSigners, token1 } =
        await loadFixture(deployFixture);

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
        await loadFixture(deployFixture);

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
        deployFixture
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
      } = await loadFixture(deployFixture);

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
      } = await loadFixture(deployFixture);

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
    it("Should emit Subscribed on level subscription", async () => {});
    it("Should emit Subscribed on full subscription", async () => {});
    it("Should emit ReferralAdded", async () => {});
  });

  describe("Helpers", () => {
    // getReferralLevels
    it("Should return referral levels", async () => {
      const { referralManager, referralLevels } = await loadFixture(
        deployFixture
      );

      expect(await referralManager.getReferralLevels()).to.eq(referralLevels);
      expect(await referralManager.LEVELS()).to.eq(referralLevels);
    });
    // getUserInfo
    it("Should return user info", async () => {});
    // getUserReferrer
    it("Should return user referrer", async () => {});
    // getUser1LvlReferrals
    it("Should return user 1 lvl referrals", async () => {});
    // getUserReferrals
    it("Should return user referrals", async () => {});
    // userHasSubscription
    it("Should return user has subscription", async () => {});
    // calculateRefReward
    it("Should calculate referrer reward", async () => {
      const { referralManager } = await loadFixture(deployFixture);

      expect(await referralManager.calculateRefReward(100, 0)).to.eq(100);
      expect(await referralManager.calculateRefReward(100, 1)).to.eq(90);
      expect(await referralManager.calculateRefReward(100, 2)).to.eq(80);
      expect(await referralManager.calculateRefReward(100, 3)).to.eq(70);
      expect(await referralManager.calculateRefReward(100, 4)).to.eq(60);
      expect(await referralManager.calculateRefReward(100, 5)).to.eq(50);
      expect(await referralManager.calculateRefReward(100, 6)).to.eq(40);
      expect(await referralManager.calculateRefReward(100, 7)).to.eq(30);
      expect(await referralManager.calculateRefReward(100, 8)).to.eq(20);
      expect(await referralManager.calculateRefReward(100, 9)).to.eq(10);
      await expect(referralManager.calculateRefReward(100, 10)).to.be.reverted;
    });
    // isAuthorized
    it("Should return is contract authorized", async () => {
      const { referralManager, adminAccount, restSigners } = await loadFixture(
        deployFixture
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
});
