import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  ReferralManager,
  Squads,
  Staking,
  Token1,
  Token2,
} from "typechain-types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log("---- UPDATE CONFIGURATIONS ----");
  const { getNamedAccounts, ethers } = hre;

  const { admin } = await getNamedAccounts();

  const token1 = await ethers.getContract<Token1>("Token1", admin);
  const token2 = await ethers.getContract<Token2>("Token2", admin);
  const staking = await ethers.getContract<Staking>("Staking", admin);
  const referralManager = await ethers.getContract<ReferralManager>(
    "ReferralManager",
    admin
  );
  const squadsManager = await ethers.getContract<Squads>("Squads", admin);

  // check Token1 in Staking
  const stakingToken1 = await staking.token1();
  if (stakingToken1 !== token1.address) {
    console.log("Update Token1 in Staking");
    const tx = await staking.updateToken1(token1.address);
    await tx.wait();
  }
  // check Token2 in Staking
  const stakingToken2 = await staking.token2();
  if (stakingToken2 !== token2.address) {
    console.log("Update Token2 in Staking");
    const tx = await staking.updateToken2(token2.address);
    await tx.wait();
  }
  // check ReferralManager in Staking
  const stakingRefManager = await staking.referralManager();
  if (stakingRefManager !== referralManager.address) {
    console.log("Update ReferralManager in Staking");
    const tx = await staking.updateReferralManager(referralManager.address);
    await tx.wait();
  }
  // check ReferralManager in Staking
  const stakingSquads = await staking.squadsManager();
  if (stakingSquads !== squadsManager.address) {
    console.log("Update SquadsManager in Staking");
    const tx = await staking.updateSquadsManager(squadsManager.address);
    await tx.wait();
  }

  // check Token1 in ReferralManager
  const refManagerToken1 = await referralManager.subscriptionToken();
  if (refManagerToken1 !== token1.address) {
    console.log("Update subscription token to Token1 in Referral Manager");
    const tx = await referralManager.updateSubscriptionToken(token1.address);
    await tx.wait();
  }
  // check Token2 in ReferralManager
  const refManagerToken2 = await referralManager.rewardToken();
  if (refManagerToken2 !== token2.address) {
    console.log("Update reward token to Token2 in Referral Manager");
    const tx = await referralManager.updateRewardToken(token2.address);
    await tx.wait();
  }
  // check Staking in Referral Manager
  const isAuthorized = await referralManager.isAuthorized(staking.address);
  if (!isAuthorized) {
    console.log("Authorize staking in Referral Manager");
    const tx = await referralManager.authorizeContract(staking.address);
    await tx.wait();
  }

  // check Token1 in Squads
  const token1Squads = await squadsManager.subscriptionToken();
  if (token1Squads !== token1.address) {
    console.log("Update Subscription token to Token1 in Squads");
    const tx = await squadsManager.updateSubscriptionToken(token1.address);
    await tx.wait();
  }
  // check Staking in Squads
  const squadsStaking = await squadsManager.stakingContract();
  if (squadsStaking !== staking.address) {
    console.log("Update Staking in Squads");
    const tx = await squadsManager.updateStakingContract(staking.address);
    await tx.wait();
  }
  // check ReferralManager in Squads
  const squadsRefManager = await squadsManager.referralManager();
  if (squadsRefManager !== referralManager.address) {
    console.log("Update ReferralManager in Squads");
    const tx = await squadsManager.updateSubscriptionReferralManager(
      referralManager.address
    );
    await tx.wait();
  }

  //   TODO: add VendorSell and Lottery contracts

  console.log("---- EVERYTHING UP TO DATE ----");
};
func.tags = ["Update"];
func.dependencies = ["ReferralManager", "Staking"];
export default func;
