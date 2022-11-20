import { task, types } from "hardhat/config";
import { Squads } from "typechain-types";

task("add-squad-plan", "Add squad plan")
  .addParam(
    "subscriptionCost",
    "Squad plan subscription cost",
    "",
    types.string
  )
  .addParam("reward", "Squad plan reward", "", types.string)
  .addParam(
    "stakingThreshold",
    "Squad plan staking threshold",
    "",
    types.string
  )
  .addParam("squadSize", "Squad size", 0, types.int)
  .addParam(
    "stakingPlanId",
    "Squad plan required staking plan id",
    0,
    types.int
  )
  .setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
    const { admin } = await getNamedAccounts();
    const adminSigner = await ethers.getSigner(admin);
    const squadsManager = await ethers.getContract<Squads>(
      "Squads",
      adminSigner
    );

    const tx = await squadsManager.addPlan(
      taskArgs.subscriptionCost,
      taskArgs.reward,
      taskArgs.stakingThreshold,
      taskArgs.squadSize,
      taskArgs.stakingPlanId
    );

    await tx.wait();
  });
