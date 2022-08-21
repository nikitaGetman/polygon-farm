import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { Token1__factory } from "../typechain-types";

describe("Token 1", function () {
  async function deployTokenFixture() {
    const initialSupply = BigNumber.from(10).pow(18).mul(21_000_000);

    const [adminAccount, holderAccount, ...restSigners] =
      await ethers.getSigners();

    const token = await new Token1__factory(adminAccount).deploy(
      initialSupply,
      holderAccount.address
    );
    await token.deployed();
    return {
      token,
      initialSupply,
      adminAccount,
      holderAccount,
      restSigners,
    };
  }

  describe("Deployment", function () {
    it("Should deploy with correct rights for admin", async function () {
      const { token, adminAccount, holderAccount } = await loadFixture(
        deployTokenFixture
      );

      const SnapshotRole = await token.SNAPSHOT_ROLE();
      expect(await token.hasRole(SnapshotRole, adminAccount.address)).to.be.eq(
        true
      );
      expect(await token.hasRole(SnapshotRole, holderAccount.address)).to.be.eq(
        false
      );
    });
  });

  describe("Roles", function () {
    it("Should snapshot only with Snapshot role", async function () {
      const { token, adminAccount, restSigners } = await loadFixture(
        deployTokenFixture
      );

      // With Admin role
      await expect(await token.connect(adminAccount).snapshot())
        .to.emit(token, "Snapshot")
        .withArgs(1);

      // With no role
      const [acc1, acc2] = restSigners;
      await expect(token.connect(acc1).snapshot()).to.be.reverted;

      // Grant role
      const SnapshotRole = await token.SNAPSHOT_ROLE();
      await expect(
        await token.connect(adminAccount).grantRole(SnapshotRole, acc2.address)
      )
        .to.emit(token, "RoleGranted")
        .withArgs(SnapshotRole, acc2.address, adminAccount.address);

      await expect(await token.connect(acc2).snapshot())
        .to.emit(token, "Snapshot")
        .withArgs(2);

      // Revoke role
      await expect(
        await token.connect(adminAccount).revokeRole(SnapshotRole, acc2.address)
      )
        .to.emit(token, "RoleRevoked")
        .withArgs(SnapshotRole, acc2.address, adminAccount.address);

      await expect(token.connect(acc2).snapshot()).to.be.reverted;
    });
  });
});
