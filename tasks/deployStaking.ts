import { task, types } from "hardhat/config";
import { getStakingName } from "utils/getStakingName";
import type { Token2 } from "../typechain-types";

task("deploy-staking", "Deploy staking contract with params")
  .addParam("token1", "Token1 address")
  .addParam("token2", "Token2 address")
  .addParam("rewardPool", "Reward pool address")
  .addParam("durationDays", "Staking duration (days)", 0, types.int)
  .addParam("rewardPercent", "Reward for staking (percents)", 0, types.int)
  .addParam("subscriptionCost", "Cost of subscription", "0", types.string)
  .addOptionalParam(
    "subscriptionPeriodDays",
    "Period of subscription",
    365,
    types.int
  )
  .addOptionalParam(
    "account",
    "Account name or address",
    "deployer",
    types.string
  )
  .addOptionalParam("contractName", "Account name or address")
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const deployer =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;
    const rewardPoolAddress =
      (await getNamedAccounts())[taskArgs.rewardPool] || taskArgs.rewardPool;
    const { admin } = await getNamedAccounts();
    const { deploy } = deployments;

    const rewardPercent = taskArgs.rewardPercent * 10; // multiply for percent divider
    const stakingName =
      taskArgs.contractName ||
      getStakingName({
        durationDays: taskArgs.durationDays,
      });

    const staking = await deploy(stakingName, {
      from: deployer,
      contract: "Staking",
      args: [
        taskArgs.token1,
        taskArgs.token2,
        rewardPoolAddress,
        taskArgs.durationDays,
        rewardPercent,
        taskArgs.subscriptionCost,
        taskArgs.subscriptionPeriodDays,
      ],
      log: true,
      autoMine: true,
    });

    // Approve staking pool tokens for staking contract
    const token1 = await ethers.getContract(
      "Token1",
      await ethers.getSigner(rewardPoolAddress)
    );
    await token1.approve(staking.address, ethers.constants.MaxUint256);

    // Add staking contract to Token2 whitelist
    const token2 = await ethers.getContract<Token2>(
      "Token2",
      await ethers.getSigner(admin)
    );
    await token2.addToWhitelist([staking.address]);

    console.log(
      `Staking contract deployed to "${staking.address}". Duration: ${taskArgs.durationDays}. Reward: ${taskArgs.rewardPercent}. Reward pool: "${rewardPoolAddress}"`
    );
    console.log("Staking contract added to Token2 Whitelist");

    return staking;
  });
