import { task, types } from "hardhat/config";
import type { BasicToken } from "../typechain-types";

task("add-to-whitelist", "Add addresses to token whitelist")
  .addParam("addresses", "Addresses to add to whitelist")
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
    const tx = await token.addToWhitelist(accountsToBlock);
    await tx.wait();

    console.log(
      `[${tokenName}] addresses added to whitelist(${
        accountsToBlock.length
      }): [${accountsToBlock.join(", ")}]`
    );
  });

task("remove-from-whitelist", "Remove addresses from token whitelist")
  .addParam("addresses", "Addresses to remove from whitelist")
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
    const tx = await token.removeFromWhitelist(accountsToBlock);
    await tx.wait();

    console.log(
      `[${tokenName}] addresses removed from whitelist(${
        accountsToBlock.length
      }): [${accountsToBlock.join(", ")}]`
    );
  });
