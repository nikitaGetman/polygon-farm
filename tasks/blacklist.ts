import { task, types } from "hardhat/config";
import type { BasicToken } from "../typechain-types";

task("add-to-blacklist", "Add addresses to token blacklist")
  .addParam("addresses", "Addresses to add to blacklist")
  .addParam("token", "Token name", "token1", types.string)
  .addOptionalParam("account", "Admin account", "admin", types.string)
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const adminAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;
    const admin = await ethers.getSigner(adminAddr);

    const tokenName = taskArgs.token === "token2" ? "Token2" : "Token1";

    const tokenAddress = (await deployments.get(tokenName)).address;
    const tokenArtifact = await deployments.getArtifact(tokenName);

    const token = (await ethers.getContractAtFromArtifact(
      tokenArtifact,
      tokenAddress,
      admin
    )) as BasicToken;

    const accountsToBlock = taskArgs.addresses.split(",");
    const tx = await token.addToBlacklist(accountsToBlock);
    await tx.wait();

    console.log(
      `[${tokenName}] addresses added to blacklist(${
        accountsToBlock.length
      }): [${accountsToBlock.join(", ")}]`
    );
  });

task("remove-from-blacklist", "Remove addresses from token blacklist")
  .addParam("addresses", "Addresses to remove from blacklist")
  .addParam("token", "Token name", "token1", types.string)
  .addOptionalParam("account", "Admin account", "admin", types.string)
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const adminAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;
    const admin = await ethers.getSigner(adminAddr);

    const tokenName = taskArgs.token === "token2" ? "Token2" : "Token1";

    const tokenAddress = (await deployments.get(tokenName)).address;
    const tokenArtifact = await deployments.getArtifact(tokenName);

    const token = (await ethers.getContractAtFromArtifact(
      tokenArtifact,
      tokenAddress,
      admin
    )) as BasicToken;

    const accountsToBlock = taskArgs.addresses.split(",");
    const tx = await token.removeFromBlacklist(accountsToBlock);
    await tx.wait();

    console.log(
      `[${tokenName}] addresses removed from blacklist(${
        accountsToBlock.length
      }): [${accountsToBlock.join(", ")}]`
    );
  });
