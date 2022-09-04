import { task, types } from "hardhat/config";
import type { Staking } from "../typechain-types";

task("deposit-staking", "Deposit to staking contract")
  .addParam("account", "Account who deposit")
  .addParam("contract", "Staking contract address")
  .addParam("amount", "Amount of tokens to deposit")
  .addOptionalParam("isToken2", "Is depositing token 2?", false, types.boolean)
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

    const tokenName = taskArgs.isToken2 ? "Token2" : "Token1";
    const tokenAddress = (await deployments.get(tokenName)).address;
    const tokenArtifact = await deployments.getArtifact(tokenName);

    const token = await ethers.getContractAtFromArtifact(
      tokenArtifact,
      tokenAddress,
      account
    );

    const tx = await token.approve(staking.address, taskArgs.amount);
    await tx.wait();

    await staking.deposit(taskArgs.amount, taskArgs.isToken2);

    console.log(
      `Account (${taskArgs.account}) deposited ${taskArgs.amount} Tokens to staking contract (${taskArgs.contract})`
    );
  });
