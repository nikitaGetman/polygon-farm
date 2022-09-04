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

    const tokenAddress = (await deployments.get("Token1")).address;
    const tokenArtifact = await deployments.getArtifact("Token1");

    const token = (await ethers.getContractAtFromArtifact(
      tokenArtifact,
      tokenAddress,
      await ethers.getSigner(accountAddr)
    )) as Token1;

    await token.pause();

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

    const tokenAddress = (await deployments.get("Token2")).address;
    const tokenArtifact = await deployments.getArtifact("Token2");

    const token = (await ethers.getContractAtFromArtifact(
      tokenArtifact,
      tokenAddress,
      await ethers.getSigner(accountAddr)
    )) as Token2;

    await token.pause();

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

    const tokenAddress = (await deployments.get("Token1")).address;
    const tokenArtifact = await deployments.getArtifact("Token1");

    const token = (await ethers.getContractAtFromArtifact(
      tokenArtifact,
      tokenAddress,
      await ethers.getSigner(accountAddr)
    )) as Token1;

    await token.unpause();

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

    const tokenAddress = (await deployments.get("Token2")).address;
    const tokenArtifact = await deployments.getArtifact("Token2");

    const token = (await ethers.getContractAtFromArtifact(
      tokenArtifact,
      tokenAddress,
      await ethers.getSigner(accountAddr)
    )) as Token2;

    await token.unpause();

    console.log(`[Token2] unpaused`);
  });
