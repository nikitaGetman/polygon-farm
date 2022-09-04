import { task } from "hardhat/config";

task("balance-token1", "Get account balance of token 1")
  .addParam("account", "Account name or address")
  .setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;

    const token = await ethers.getContract("Token1");

    const balance = await token.balanceOf(accountAddr);
    const balanceString = ethers.utils.formatEther(balance);

    console.log(`[Token1] Balance of "${taskArgs.account}": ${balanceString}`);
  });

task("balance-token2", "Get account balance of token 2")
  .addParam("account", "Account name or address")
  .setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;

    const token = await ethers.getContract("Token2");

    const balance = await token.balanceOf(accountAddr);
    const balanceString = ethers.utils.formatEther(balance);

    console.log(`[Token2] Balance of "${taskArgs.account}": ${balanceString}`);
  });

task("balance-mock-erc20", "Get account balance of mock erc20")
  .addParam("account", "Account name or address")
  .setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;

    const token = await ethers.getContract("ERC20Burnable");

    const balance = await token.balanceOf(accountAddr);
    const balanceString = ethers.utils.formatEther(balance);

    console.log(
      `[ERC20Burnable] Balance of "${taskArgs.account}": ${balanceString}`
    );
  });
