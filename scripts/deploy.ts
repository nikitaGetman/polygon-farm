import { ethers } from "hardhat";
import { Token1__factory } from "../typechain-types";

async function main() {
  const config = {
    initialSupply: 21_000_000,
    holderAddress: "0xSomeAddress",
  };

  const initialSupply = ethers.BigNumber.from(10)
    .pow(18)
    .mul(config.initialSupply);
  const signers = await ethers.getSigners();

  const [adminAccount] = signers;

  const token = await new Token1__factory(adminAccount).deploy(
    initialSupply,
    config.holderAddress
  );

  await token.deployed();
  console.log("Token1 is deployed to:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
