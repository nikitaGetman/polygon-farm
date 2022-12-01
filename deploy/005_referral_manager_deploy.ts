import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import {
  REFERRAL_MANAGER_FULL_SUBSCRIPTION_COST,
  REFERRAL_MANAGER_LEVEL_SUBSCRIPTION_COST,
} from "config";
import { Token2 } from "typechain-types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;

  const { deployer, admin, referralRewardPool } = await getNamedAccounts();

  const token1Address = (await deployments.get("Token1")).address;
  const token2 = await ethers.getContract<Token2>("Token2");

  const referralManager = await deploy("ReferralManager", {
    from: deployer,
    args: [
      token1Address,
      token2.address,
      referralRewardPool,
      REFERRAL_MANAGER_FULL_SUBSCRIPTION_COST,
      REFERRAL_MANAGER_LEVEL_SUBSCRIPTION_COST,
    ],
    log: true,
    autoMine: true,
  });

  const referralRewardPoolSigner = await ethers.getSigner(referralRewardPool);
  const adminSigner = await ethers.getSigner(admin);

  let tx = await token2
    .connect(referralRewardPoolSigner)
    .approve(referralManager.address, ethers.constants.MaxUint256);
  await tx.wait();
  tx = await token2
    .connect(adminSigner)
    .addToWhitelist([referralRewardPoolSigner.address]);
  await tx.wait();
};
func.tags = ["ReferralManager"];
func.dependencies = ["Token1", "Token2"];
export default func;
