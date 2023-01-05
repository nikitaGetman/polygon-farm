import { task, types } from "hardhat/config";
import { Staking } from "typechain-types";

task("add-staking-plan", "Add staking plan")
  .addParam("durationDays", "Staking duration (days)", 0, types.int)
  .addParam("apr", "APR for staking (percents)", 0, types.int)
  .addParam("subscriptionCost", "Cost of subscription", "0", types.string)
  .addOptionalParam(
    "subscriptionDurationDays",
    "Duration of subscription in days",
    365,
    types.int
  )
  .setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
    const { admin } = await getNamedAccounts();
    const staking = await ethers.getContract<Staking>(
      "Staking",
      await ethers.getSigner(admin)
    );

    const tx = await staking.addStakingPlan(
      taskArgs.subscriptionCost,
      taskArgs.subscriptionDurationDays,
      taskArgs.durationDays,
      taskArgs.apr
    );

    await tx.wait();
  });
