import { task, types } from "hardhat/config";
import type { Token1 } from "../typechain-types";

task("snapshot", "Create snapshot token 1")
  .addOptionalParam("account", "Account name or address", "admin", types.string)
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;

    const tokenAddress = (await deployments.get("Token1")).address;
    const tokenArtifact = await deployments.getArtifact("Token1");

    const token = (await ethers.getContractAtFromArtifact(
      tokenArtifact,
      tokenAddress,
      await ethers.getSigner(accountAddr)
    )) as Token1;

    await token.snapshot();
    const id = await token.snapshotCount();

    console.log(`[Token1] Snapshot ${id} created for Token1`);
  });
