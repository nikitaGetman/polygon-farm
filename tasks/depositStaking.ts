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
    const staking = await ethers.getContractAt<Staking>(
      stakingArtifact.abi,
      taskArgs.contract,
      account
    );

    const tokenName = taskArgs.isToken2 ? "Token2" : "Token1";
    const token = await ethers.getContract(tokenName, account);

    const tx = await token.approve(staking.address, taskArgs.amount);
    await tx.wait();

    await staking.deposit(taskArgs.amount, taskArgs.isToken2);

    console.log(
      `Account (${taskArgs.account}) deposited ${taskArgs.amount} Tokens to staking contract (${taskArgs.contract})`
    );
  });
