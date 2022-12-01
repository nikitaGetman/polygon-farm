import { task, types } from "hardhat/config";
import type { Token1, Token2 } from "../typechain-types";

task("pause-token1", "Pause token 1")
  .addOptionalParam(
    "account",
    "Admin account name or address",
    "admin",
    types.string
  )
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;

    const token = await ethers.getContract<Token1>(
      "Token1",
      await ethers.getSigner(accountAddr)
    );

    const tx = await token.pause();
    await tx.wait();

    console.log(`[Token1] paused`);
  });

task("pause-token2", "Pause token 2")
  .addOptionalParam(
    "account",
    "Admin account name or address",
    "admin",
    types.string
  )
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;

    const token = await ethers.getContract<Token2>(
      "Token2",
      await ethers.getSigner(accountAddr)
    );

    const tx = await token.pause();
    await tx.wait();

    console.log(`[Token2] paused`);
  });

task("unpause-token1", "Pause token 1")
  .addOptionalParam(
    "account",
    "Admin account name or address",
    "admin",
    types.string
  )
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;

    const token = await ethers.getContract<Token1>(
      "Token1",
      await ethers.getSigner(accountAddr)
    );

    const tx = await token.unpause();
    await tx.wait();

    console.log(`[Token1] unpaused`);
  });

task("unpause-token2", "Pause token 2")
  .addOptionalParam(
    "account",
    "Admin account name or address",
    "admin",
    types.string
  )
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;

    const token = await ethers.getContract<Token2>(
      "Token2",
      await ethers.getSigner(accountAddr)
    );

    const tx = await token.unpause();
    await tx.wait();

    console.log(`[Token2] unpaused`);
  });
