import { task } from "hardhat/config";
import type { Staking, Token1 } from "../typechain-types";

task("subscribe-to-staking", "Subscribe to staking contract")
  .addParam("account", "Subscription account")
  .addParam("contract", "Staking contract address")
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;
    const account = await ethers.getSigner(accountAddr);

    const stakingArtifact = await deployments.getArtifact("Staking");
    const staking = await ethers.getContractAt<Staking>(
      stakingArtifact.abi,
      taskArgs.contract,
      account
    );

    const subscriptionCost = await staking.subscriptionCost();
    const token = await ethers.getContract<Token1>("Token1", account);

    const tx = await token.approve(staking.address, subscriptionCost);
    await tx.wait();

    await staking.subscribe();

    console.log(
      `Account (${taskArgs.account}) subscribed to staking contract (${taskArgs.contract})`
    );
  });
