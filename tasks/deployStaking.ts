import { task, types } from "hardhat/config";
import { getStakingName } from "utils/getStakingName";

task("deploy-staking", "Deploy staking contract with params")
  .addParam("token1", "Token1 address")
  .addParam("token2", "Token2 address")
  .addParam("rewardPool", "Reward pool address")
  .addParam("durationDays", "Staking duration (days)", 0, types.int)
  .addParam("rewardPercent", "Reward for staking (percents)", 0, types.int)
  .addParam("subscriptionCost", "Cost of subscription", 0, types.int)
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

    const token1 = await ethers.getContract(
      "Token1",
      await ethers.getSigner(rewardPoolAddress)
    );

    // Approve staking pool tokens for staking contract
    await token1.approve(staking.address, ethers.constants.MaxUint256);

    console.log(
      `Staking contract deployed to "${staking.address}". Duration: ${taskArgs.durationDays}. Reward: ${taskArgs.rewardPercent}. Reward pool: "${rewardPoolAddress}"`
    );

    return staking;
  });
