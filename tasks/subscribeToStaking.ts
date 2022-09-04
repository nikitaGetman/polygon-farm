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
    const staking = (await ethers.getContractAtFromArtifact(
      stakingArtifact,
      taskArgs.contract,
      account
    )) as Staking;

    const subscriptionCost = await staking.subscriptionCost();

    const tokenAddress = (await deployments.get("Token1")).address;
    const tokenArtifact = await deployments.getArtifact("Token1");

    const token = (await ethers.getContractAtFromArtifact(
      tokenArtifact,
      tokenAddress,
      account
    )) as Token1;

    const tx = await token.approve(staking.address, subscriptionCost);
    await tx.wait();

    await staking.subscribe();

    console.log(
      `Account (${taskArgs.account}) subscribed to staking contract (${taskArgs.contract})`
    );
  });

// 0x851356ae760d987E095750cCeb3bC6014560891C
// 0x998abeb3E57409262aE5b751f60747921B33613E
//
