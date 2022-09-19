import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { AccessControl } from "typechain-types";

export async function grantAdminRole(
  contract: AccessControl,
  admin: SignerWithAddress,
  account: SignerWithAddress
) {
  const AdminRole = await contract.DEFAULT_ADMIN_ROLE();
  await contract.connect(admin).grantRole(AdminRole, account.address);
}
