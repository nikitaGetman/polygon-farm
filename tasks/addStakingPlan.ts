import { task, types } from "hardhat/config";

task("add-staking-plan", "Add staking plan")
  .addParam("durationDays", "Staking duration (days)", 0, types.int)
  .addParam("rewardPercent", "Reward for staking (percents)", 0, types.int)
  .addParam("subscriptionCost", "Cost of subscription", "0", types.string)
  .addOptionalParam(
    "subscriptionDurationDays",
    "Duration of subscription in days",
    365,
    types.int
  )
  .setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
    const { admin } = await getNamedAccounts();
    const staking = await ethers.getContract(
      "Staking",
      await ethers.getSigner(admin)
    );

    await staking.addStakingPlan(
      taskArgs.subscriptionCost,
      taskArgs.subscriptionDurationDays,
      taskArgs.durationDays,
      taskArgs.rewardPercent
    );
  });
