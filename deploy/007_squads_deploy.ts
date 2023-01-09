import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { SQUADS } from "config";
import { ReferralManager, Staking } from "typechain-types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers, run, network } = hre;
  const { deploy } = deployments;

  const { deployer, admin } = await getNamedAccounts();

  const token1Address = (await deployments.get("Token1")).address;
  const referralManager = await ethers.getContract<ReferralManager>(
    "ReferralManager",
    await ethers.getSigner(admin)
  );
  const stakingContract = await ethers.getContract<Staking>(
    "Staking",
    await ethers.getSigner(admin)
  );

  const squadManager = await deploy("Squads", {
    from: deployer,
    args: [token1Address, referralManager.address, stakingContract.address],
    log: true,
    autoMine: true,
    // gasPrice: ethers.BigNumber.from(10).pow(10),
  });

  if (squadManager.newlyDeployed) {
    console.log("Authorize SquadManager in ReferralManager contract");
    let tx = await referralManager.authorizeContract(squadManager.address);
    await tx.wait();
    console.log("Update SquadManager in Staking contract");
    tx = await stakingContract.updateSquadsManager(squadManager.address);
    await tx.wait();

    if (!network.live) {
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
  }
};
func.tags = ["Squads"];
func.dependencies = ["Token1", "Token2", "ReferralManager", "Staking"];
export default func;
