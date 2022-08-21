import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { SwapTokens__factory } from "../typechain-types";

describe("Swap Tokens Contract", function () {
  async function deployContractFixture() {
    // const [adminAccount, holderAccount, ...restSigners] =
    //   await ethers.getSigners();
    // const token = await new SwapTokens__factory(adminAccount).deploy(
    //   initialSupply,
    //   holderAccount.address
    // );
    // await token.deployed();
    // return {
    //   token,
    //   initialSupply,
    //   adminAccount,
    //   holderAccount,
    //   restSigners,
    // };
  }

  describe("Deployment", function () {
    it("Should deploy with correct rights for admin", async function () {
      //   const { token, adminAccount, holderAccount } = await loadFixture(
      //     deployTokenFixture
      //   );
      //   expect(await token.isWhitelistRestrictionMode()).to.be.eq(true);
      //   const MinterRole = await token.MINTER_ROLE();
      //   expect(await token.hasRole(MinterRole, adminAccount.address)).to.be.eq(
      //     true
      //   );
      //   expect(await token.hasRole(MinterRole, holderAccount.address)).to.be.eq(
      //     false
      //   );
      //   expect(await token.isAddressInWhiteList(adminAccount.address)).to.be.eq(
      //     true
      //   );
      //   expect(await token.isAddressInWhiteList(holderAccount.address)).to.be.eq(
      //     true
      //   );
    });
  });

  describe("Roles", function () {});
});
