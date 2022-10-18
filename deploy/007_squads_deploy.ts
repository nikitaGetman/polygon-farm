import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { SQUADS } from "config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers, run } = hre;
  const { deploy } = deployments;

  const { deployer, admin } = await getNamedAccounts();

  const token1Address = (await deployments.get("Token1")).address;
  const referralManagerAddress = (await deployments.get("ReferralManager"))
    .address;
  const stakingContract = await ethers.getContract(
    "Staking",
    await ethers.getSigner(admin)
  );

  const squadManager = await deploy("Squads", {
    from: deployer,
    args: [token1Address, referralManagerAddress, stakingContract.address],
    log: true,
    autoMine: true,
    gasPrice: ethers.BigNumber.from(10).pow(10),
  });

  if (squadManager.newlyDeployed) {
    const referralManager = await ethers.getContract(
      "ReferralManager",
      await ethers.getSigner(admin)
    );
    await referralManager.authorizeContract(squadManager.address);
    await stakingContract.updateSquadsManager(squadManager.address);

    for (let i = 0; i < SQUADS.length; i++) {
      console.log("Add plan " + (i + 1));
      await run("add-squad-plan", {
        subscriptionCost: SQUADS[i].subscriptionCost.toString(),
        reward: SQUADS[i].reward.toString(),
        stakingThreshold: SQUADS[i].stakingThreshold.toString(),
        squadSize: SQUADS[i].squadSize,
        stakingPlanId: SQUADS[i].stakingPlanId,
      });
    }
  }
};
func.tags = ["Squads"];
func.dependencies = ["Token1", "Token2", "ReferralManager", "Staking"];
export default func;
