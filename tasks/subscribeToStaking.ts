import { task } from "hardhat/config";
import type { Staking, Token1 } from "../typechain-types";

task("subscribe-to-staking", "Subscribe to staking plan")
  .addParam("account", "Subscription account")
  .addParam("planId", "Staking plan id")
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;
    const account = await ethers.getSigner(accountAddr);
    const staking = await ethers.getContract<Staking>("Staking", account);
    const { subscriptionCost } = await staking.stakingPlans(taskArgs.planId);
    const token = await ethers.getContract<Token1>("Token1", account);
    const tx = await token.approve(staking.address, subscriptionCost);
    await tx.wait();
    const subscribeTx = await staking.subscribe(taskArgs.planId);
    await subscribeTx.wait();
    console.log(
      `Account (${taskArgs.account}) subscribed to staking plan (${taskArgs.planId})`
    );
  });
