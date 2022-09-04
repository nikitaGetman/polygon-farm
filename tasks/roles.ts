import { DeploymentsExtension } from "hardhat-deploy/dist/types";
import { task, types } from "hardhat/config";

task("grant-role", "Grant role for account in contract with access control")
  .addParam("contract", "Contract address")
  .addParam("role", "Role name")
  .addParam("account", "Account to grant role")
  .addOptionalParam(
    "adminAccount",
    "Admin account for granting",
    "admin",
    types.string
  )
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;
    const adminAccountAddr =
      (await getNamedAccounts())[taskArgs.adminAccount] ||
      taskArgs.adminAccount;

    const artifact = await getArtifact(taskArgs.contract, deployments);
    const contract = await ethers.getContractAt(
      artifact.abi,
      taskArgs.contract,
      await ethers.getSigner(adminAccountAddr)
    );

    const role = await contract[taskArgs.role]?.();
    await contract.grantRole(role, accountAddr);

    console.log(
      `[AccessControl] Role ${taskArgs.role} granted to ${taskArgs.account}`
    );
  });

task("revoke-role", "Revoke role from account for contract with access control")
  .addParam("contract", "Contract address")
  .addParam("role", "Role name")
  .addParam("account", "Account to grant role")
  .addOptionalParam(
    "adminAccount",
    "Admin account for granting",
    "admin",
    types.string
  )
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;
    const adminAccountAddr =
      (await getNamedAccounts())[taskArgs.adminAccount] ||
      taskArgs.adminAccount;

    const artifact = await getArtifact(taskArgs.contract, deployments);
    const contract = await ethers.getContractAt(
      artifact.abi,
      taskArgs.contract,
      await ethers.getSigner(adminAccountAddr)
    );

    const role = await contract[taskArgs.role]?.();
    await contract.revokeRole(role, accountAddr);

    console.log(
      `[AccessControl] Role ${taskArgs.role} revoked to ${taskArgs.account}`
    );
  });

task("has-role", "Check has role for contracts with access control")
  .addParam("contract", "Contract address")
  .addParam("role", "Role name")
  .addParam("account", "Account to grant role")
  .setAction(async (taskArgs, { ethers, getNamedAccounts, deployments }) => {
    const accountAddr =
      (await getNamedAccounts())[taskArgs.account] || taskArgs.account;

    const artifact = await getArtifact(taskArgs.contract, deployments);
    const contract = await ethers.getContractAt(
      artifact.abi,
      taskArgs.contract
    );

    const role = await contract[taskArgs.role]?.();
    const hasRole = await contract.hasRole(role, accountAddr);

    console.log(
      `[AccessControl] Account ${taskArgs.account} ${
        hasRole ? "HAS role" : "DOES NOT have role"
      } ${taskArgs.role}`
    );
  });

async function getArtifact(
  contract: string,
  deployments: DeploymentsExtension
) {
  const token1Address = (await deployments.get("Token1")).address;
  const token2Address = (await deployments.get("Token2")).address;
  const vestingAddress = (await deployments.get("TokenVesting")).address;
  const vendorAddress = (await deployments.get("VendorSell")).address;

  switch (contract.toLowerCase()) {
    case token1Address.toLowerCase(): {
      return await deployments.getArtifact("Token1");
    }
    case token2Address.toLowerCase(): {
      return await deployments.getArtifact("Token2");
    }
    case vestingAddress.toLowerCase(): {
      return await deployments.getArtifact("TokenVesting");
    }
    case vendorAddress.toLowerCase(): {
      return await deployments.getArtifact("VendorSell");
    }
    default: {
      // else fallback to staking contract artifact
      return await deployments.getArtifact("Staking");
    }
  }
}
