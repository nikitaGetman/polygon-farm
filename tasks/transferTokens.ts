import { task, types } from "hardhat/config";

task("transfer-tokens", "Refill account balance of tokens")
  .addParam("from", "From account name")
  .addParam("to", "To account name")
  .addParam("amount", "Amount to transfer")
  .addOptionalParam("isToken2", "Transfer token 2?", false, types.boolean)
  .addOptionalParam("isMockToken", "Transfer mock token?", false, types.boolean)
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const fromAccountAddr =
      (await getNamedAccounts())[taskArgs.from] || taskArgs.from;
    const toAccountAddr =
      (await getNamedAccounts())[taskArgs.to] || taskArgs.to;
    const fromAccount = await ethers.getSigner(fromAccountAddr);

    const tokenName = taskArgs.isToken2
      ? "Token2"
      : taskArgs.isMockToken
      ? "ERC20BurnableMock"
      : "Token1";
    const tokenAddress = (await deployments.get(tokenName)).address;
    const tokenArtifact = await deployments.getArtifact(tokenName);

    const token = await ethers.getContractAtFromArtifact(
      tokenArtifact,
      tokenAddress,
      fromAccount
    );

    const tx = await token.transfer(toAccountAddr, taskArgs.amount);
    await tx.wait();

    const fromBalance = await token.balanceOf(fromAccountAddr);
    const toBalance = await token.balanceOf(toAccountAddr);

    console.log(
      `${taskArgs.amount} tokens transferred from '${taskArgs.from}' to '${taskArgs.to}'`
    );
    console.log(`Balance of "${taskArgs.from}": ${fromBalance}`);
    console.log(`Balance of "${taskArgs.to}": ${toBalance}`);
  });
