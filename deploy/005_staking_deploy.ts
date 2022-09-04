import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { STAKINGS } from "../config";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers, network, run } = hre;
  const { getArtifact } = deployments;

  const { deployer, stakingPool } = await getNamedAccounts();

  const token1Address = (await deployments.get("Token1")).address;
  const token2Address = (await deployments.get("Token2")).address;

  for (let i = 0; i < STAKINGS.length; i++) {
    const staking = STAKINGS[i];

    const stakingDeploy = await run("deploy-staking", {
      token1: token1Address,
      token2: token2Address,
      rewardPool: stakingPool,
      durationDays: staking.durationDays,
      rewardPercent: staking.rewardPercent,
      subscriptionCost: staking.subscriptionCost,
      subscriptionPeriodDays: staking.subscriptionDurationDays,
      account: deployer,
    });

    // Set contract TIME_STEP to 1 minute for testing and activate it
    if (!network.live) {
      const stakingContract = await ethers.getContractAtFromArtifact(
        await getArtifact("Staking"),
        stakingDeploy.address
      );
      await stakingContract.updateTimeStep(60);
      await stakingContract.setActive(true);
    }
  }
};
func.tags = ["Token2"];
export default func;
