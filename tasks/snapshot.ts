import { task, types } from "hardhat/config";
import type { Token1 } from "../typechain-types";

task("snapshot", "Create snapshot token 1")
  .addOptionalParam("account", "Account name or address", "admin", types.string)
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;

    const token = await ethers.getContract<Token1>(
      "Token1",
      await ethers.getSigner(accountAddr)
    );

    const tx = await token.snapshot();
    await tx.wait();
    const id = await token.snapshotCount();

    console.log(`[Token1] Snapshot ${id} created for Token1`);
  });
