import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { STAKINGS } from "../config";
import { Staking } from "typechain-types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers, network, run } = hre;
  const { deploy } = deployments;

  const { deployer, admin, stakingPool } = await getNamedAccounts();
  const token1Address = (await deployments.get("Token1")).address;
  const token2Address = (await deployments.get("Token2")).address;
  const referralManagerAddress = (await deployments.get("ReferralManager"))
    .address;

  const staking = await deploy("Staking", {
    from: deployer,
    args: [
      token1Address,
      token2Address,
      stakingPool,
      referralManagerAddress,
      ethers.constants.AddressZero,
    ],
    log: true,
    autoMine: true,
    gasPrice: ethers.BigNumber.from(10).pow(10),
  });

  if (staking.newlyDeployed) {
    for (let i = 0; i < STAKINGS.length; i++) {
      console.log("Add staking plan " + (i + 1));
      await run("add-staking-plan", {
        durationDays: STAKINGS[i].durationDays,
        rewardPercent: STAKINGS[i].rewardPercent,
        subscriptionCost: STAKINGS[i].subscriptionCost.toString(),
        subscriptionPeriodDays: STAKINGS[i].subscriptionDurationDays,
      });
    }

    if (!network.live) {
      const stakingContract = await ethers.getContract<Staking>(
        "Staking",
        admin
      );
      await stakingContract.updateTimeStep(60);
    }

    const token1 = await ethers.getContract("Token1", stakingPool);
    await token1.approve(staking.address, ethers.constants.MaxUint256);
    const token2 = await ethers.getContract("Token2", admin);
    await token2.addToWhitelist([staking.address]);
  }
};
func.tags = ["Staking"];
func.dependencies = ["Token1", "Token2", "ReferralManager"];
export default func;
