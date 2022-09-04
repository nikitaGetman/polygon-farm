import { task } from "hardhat/config";

task("balance-token1", "Get account balance of token 1")
  .addParam("account", "Account name or address")
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;

    const tokenAddress = (await deployments.get("Token1")).address;
    const tokenArtifact = await deployments.getArtifact("Token1");

    const token = await ethers.getContractAtFromArtifact(
      tokenArtifact,
      tokenAddress
    );

    const balance = await token.balanceOf(accountAddr);
    const balanceString = ethers.utils.formatEther(balance);

    console.log(`[Token1] Balance of "${taskArgs.account}": ${balanceString}`);
  });

task("balance-token2", "Get account balance of token 2")
  .addParam("account", "Account name or address")
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;

    const tokenAddress = (await deployments.get("Token2")).address;
    const tokenArtifact = await deployments.getArtifact("Token2");

    const token = await ethers.getContractAtFromArtifact(
      tokenArtifact,
      tokenAddress
    );

    const balance = await token.balanceOf(accountAddr);
    const balanceString = ethers.utils.formatEther(balance);

    console.log(`[Token2] Balance of "${taskArgs.account}": ${balanceString}`);
  });

task("balance-mock-erc20", "Get account balance of mock erc20")
  .addParam("account", "Account name or address")
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;

    const tokenAddress = (await deployments.get("ERC20Burnable")).address;
    const tokenArtifact = await deployments.getArtifact("ERC20Burnable");

    const token = await ethers.getContractAtFromArtifact(
      tokenArtifact,
      tokenAddress
    );

    const balance = await token.balanceOf(accountAddr);
    const balanceString = ethers.utils.formatEther(balance);

    console.log(
      `[ERC20Burnable] Balance of "${taskArgs.account}": ${balanceString}`
    );
  });
