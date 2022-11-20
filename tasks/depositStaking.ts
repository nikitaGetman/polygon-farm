import { ethers } from "ethers";
import { task, types } from "hardhat/config";
import { Staking } from "typechain-types";

task("deposit-staking", "Deposit to staking contract")
  .addParam("account", "Account who deposit")
  .addParam("planId", "Staking plan id")
  .addParam("amount", "Amount of tokens to deposit")
  .addOptionalParam("isToken2", "Is depositing token 2?", false, types.boolean)
  .addOptionalParam(
    "referrer",
    "Referrer of member",
    ethers.constants.AddressZero,
    types.string
  )
  .setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;
    const account = await ethers.getSigner(accountAddr);
    const staking = await ethers.getContract<Staking>("Staking", account);
    const tokenName = taskArgs.isToken2 ? "Token2" : "Token1";
    const token = await ethers.getContract(tokenName, account);
    const tx = await token.approve(staking.address, taskArgs.amount);
    await tx.wait();
    const depositTx = await staking.deposit(
      taskArgs.planId,
      taskArgs.amount,
      taskArgs.isToken2,
      taskArgs.referrer
    );
    await depositTx.wait();
    console.log(
      `Account (${taskArgs.account}) deposited ${taskArgs.amount} Tokens to staking contract (${taskArgs.contract})`
    );
  });
