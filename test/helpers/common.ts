import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { AccessControl } from "typechain-types";

export async function grantAdminRole(
  contract: AccessControl,
  admin: SignerWithAddress,
  account: SignerWithAddress | string
) {
  await grantRole(
    contract,
    admin,
    typeof account === "string" ? account : account.address,
    "DEFAULT_ADMIN_ROLE"
  );
}

export async function grantRole(
  contract: any,
  admin: SignerWithAddress,
  accountAddress: string,
  role: string
) {
  const Role = await contract[role]();
  await contract.connect(admin).grantRole(Role, accountAddress);
}
