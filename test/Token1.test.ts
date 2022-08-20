import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { Token1__factory } from "../typechain-types";

describe("ERC20-1", function () {
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
    it("Should deploy with correct initialSupply", async function () {
      const { token, adminAccount, holderAccount, initialSupply } =
        await loadFixture(deployTokenFixture);

      const adminBalance = await token.balanceOf(adminAccount.address);
      const holderBalance = await token.balanceOf(holderAccount.address);

      expect(adminBalance).to.be.eq(BigNumber.from(0));
      expect(holderBalance).to.be.eq(initialSupply);

      expect(await token.totalSupply()).to.be.eq(initialSupply);
      expect(await token.totalBurn()).to.be.eq(BigNumber.from(0));
    });

    it("Should deploy with correct rights for admin", async function () {
      const { token, adminAccount, holderAccount } = await loadFixture(
        deployTokenFixture
      );

      const AdminRole = await token.DEFAULT_ADMIN_ROLE();
      const PauserRole = await token.PAUSER_ROLE();
      const SnapshotRole = await token.SNAPSHOT_ROLE();

      expect(await token.hasRole(AdminRole, adminAccount.address)).to.be.eq(
        true
      );
      expect(await token.hasRole(SnapshotRole, adminAccount.address)).to.be.eq(
        true
      );
      expect(await token.hasRole(PauserRole, adminAccount.address)).to.be.eq(
        true
      );
      expect(await token.hasRole(AdminRole, holderAccount.address)).to.be.eq(
        false
      );
      expect(await token.hasRole(SnapshotRole, holderAccount.address)).to.be.eq(
        false
      );
      expect(await token.hasRole(PauserRole, holderAccount.address)).to.be.eq(
        false
      );
    });
  });

  describe("Transfers", function () {
    it("Should not transfer with zero balance", async function () {
      const { token, restSigners } = await loadFixture(deployTokenFixture);

      const [acc1, acc2] = restSigners;

      const initialBalance = await token.balanceOf(acc2.address);

      // Zero balance
      await expect(
        token.connect(acc1).transfer(acc2.address, 100)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      expect(await token.balanceOf(acc2.address)).to.equal(initialBalance);
    });

    it("Should transfer tokens", async function () {
      const { token, holderAccount, restSigners } = await loadFixture(
        deployTokenFixture
      );

      const [acc1] = restSigners;

      await expect(
        token.connect(holderAccount).transfer(acc1.address, 100)
      ).to.changeTokenBalances(token, [holderAccount, acc1], [-100, 100]);
    });

    it("Should not transfer tokens when paused", async function () {
      const { token, adminAccount, holderAccount, restSigners } =
        await loadFixture(deployTokenFixture);

      const [acc1] = restSigners;

      const initialBalance = await token.balanceOf(holderAccount.address);

      await token.connect(adminAccount).pause();

      await expect(
        token.connect(holderAccount).transfer(acc1.address, 100)
      ).to.be.revertedWith("Pausable: paused");

      expect(await token.balanceOf(holderAccount.address)).to.equal(
        initialBalance
      );
      expect(await token.balanceOf(acc1.address)).to.equal(BigNumber.from(0));
    });

    // TODO: add checks for black and white lists
  });

  describe("Roles", function () {
    it("Should pause only with Pauser role", async function () {
      const { token, adminAccount, restSigners } = await loadFixture(
        deployTokenFixture
      );

      // With Admin role
      await expect(await token.connect(adminAccount).pause())
        .to.emit(token, "Paused")
        .withArgs(adminAccount.address);

      await expect(await token.connect(adminAccount).unpause())
        .to.emit(token, "Unpaused")
        .withArgs(adminAccount.address);

      // With no role
      const [acc1, acc2] = restSigners;
      const PauserRole = await token.PAUSER_ROLE();
      await expect(token.connect(acc1).pause()).to.be.reverted;
      await token.connect(adminAccount).pause();
      await expect(token.connect(acc1).unpause()).to.be.reverted;

      // Grant role
      await expect(
        await token.connect(adminAccount).grantRole(PauserRole, acc2.address)
      )
        .to.emit(token, "RoleGranted")
        .withArgs(PauserRole, acc2.address, adminAccount.address);

      await expect(await token.connect(acc2).unpause())
        .to.emit(token, "Unpaused")
        .withArgs(acc2.address);

      await expect(await token.connect(acc2).pause())
        .to.emit(token, "Paused")
        .withArgs(acc2.address);

      // Revoke role
      await expect(
        await token.connect(adminAccount).revokeRole(PauserRole, acc2.address)
      )
        .to.emit(token, "RoleRevoked")
        .withArgs(PauserRole, acc2.address, adminAccount.address);

      await expect(token.connect(acc2).unpause()).to.be.reverted;
    });

    it("Should add to blacklist only by Admin", async () => {
      const { token, adminAccount, holderAccount, restSigners } =
        await loadFixture(deployTokenFixture);

      const [acc1, acc2, acc3] = restSigners;

      await token
        .connect(adminAccount)
        .addToBlacklist([acc1.address, acc2.address]);
      expect(await token.isAddressInBlacklist(acc1.address)).to.be.eq(true);
      expect(await token.isAddressInBlacklist(acc2.address)).to.be.eq(true);
      expect(await token.isAddressInBlacklist(acc3.address)).to.be.eq(false);

      await expect(token.connect(holderAccount).addToBlacklist([acc3.address]))
        .to.be.reverted;
      expect(await token.isAddressInBlacklist(acc3.address)).to.be.eq(false);
    });

    it("Should remove from blacklist only by Admin", async () => {
      const { token, adminAccount, holderAccount, restSigners } =
        await loadFixture(deployTokenFixture);

      const [acc1, acc2, acc3] = restSigners;

      await token
        .connect(adminAccount)
        .addToBlacklist([acc1.address, acc2.address, acc3.address]);

      await token.removeFromBlacklist([acc1.address, acc2.address]);

      expect(await token.isAddressInBlacklist(acc1.address)).to.be.eq(false);
      expect(await token.isAddressInBlacklist(acc2.address)).to.be.eq(false);
      expect(await token.isAddressInBlacklist(acc3.address)).to.be.eq(true);

      await expect(
        token.connect(holderAccount).removeFromBlacklist([acc3.address])
      ).to.be.reverted;
      expect(await token.isAddressInBlacklist(acc3.address)).to.be.eq(true);
    });

    it("Should add to whitelist only by Admin", async () => {
      const { token, adminAccount, holderAccount, restSigners } =
        await loadFixture(deployTokenFixture);

      const [acc1, acc2, acc3] = restSigners;

      await token
        .connect(adminAccount)
        .addToWhitelist([acc1.address, acc2.address]);
      expect(await token.isAddressInWhiteList(acc1.address)).to.be.eq(true);
      expect(await token.isAddressInWhiteList(acc2.address)).to.be.eq(true);
      expect(await token.isAddressInWhiteList(acc3.address)).to.be.eq(false);

      await expect(token.connect(holderAccount).addToWhitelist([acc3.address]))
        .to.be.reverted;
      expect(await token.isAddressInWhiteList(acc3.address)).to.be.eq(false);
    });

    it("Should remove from whitelist only by Admin", async () => {
      const { token, adminAccount, holderAccount, restSigners } =
        await loadFixture(deployTokenFixture);

      const [acc1, acc2, acc3] = restSigners;

      await token
        .connect(adminAccount)
        .addToWhitelist([acc1.address, acc2.address, acc3.address]);

      await token.removeFromWhitelist([acc1.address, acc2.address]);

      expect(await token.isAddressInWhiteList(acc1.address)).to.be.eq(false);
      expect(await token.isAddressInWhiteList(acc2.address)).to.be.eq(false);
      expect(await token.isAddressInWhiteList(acc3.address)).to.be.eq(true);

      await expect(
        token.connect(holderAccount).removeFromWhitelist([acc3.address])
      ).to.be.reverted;
      expect(await token.isAddressInWhiteList(acc3.address)).to.be.eq(true);
    });

    it("Should toggle whitelist mode only by Admin", async () => {
      const { token, adminAccount, restSigners } = await loadFixture(
        deployTokenFixture
      );

      const [acc1] = restSigners;

      expect(await token.isWhitelistRestrictionMode()).to.be.eq(false);

      await token.connect(adminAccount).onWhitelistMode();
      expect(await token.isWhitelistRestrictionMode()).to.be.eq(true);

      await expect(token.connect(acc1).offWhitelistMode()).to.be.reverted;
      expect(await token.isWhitelistRestrictionMode()).to.be.eq(true);

      await token.connect(adminAccount).offWhitelistMode();
      expect(await token.isWhitelistRestrictionMode()).to.be.eq(false);

      await expect(token.connect(acc1).onWhitelistMode()).to.be.reverted;
      expect(await token.isWhitelistRestrictionMode()).to.be.eq(false);
    });

    // TODO: add tests for snapshot role
  });

  describe("Blacklist / Whitelist", function () {
    async function deployWithMoney() {
      const { token, holderAccount, restSigners, ...params } =
        await loadFixture(deployTokenFixture);

      const [accWithBalance, accWithApproveFromHolder] = restSigners;

      await token.connect(holderAccount).transfer(accWithBalance.address, 1000);

      return {
        token,
        holderAccount,
        accWithBalance,
        accWithApproveFromHolder,
        ...params,
      };
    }

    it("Should not transfer if sender in blacklist", async () => {});
    it("Should not transfer if receiver in blacklist", async () => {});
    it("Should not transfer if spender in blacklist", async () => {});
    it("Should not transfer if sender/spender/receiver not in whitelist", async () => {});
    it("Should not transfer if sender in whitelist, but receiver in blacklist", async () => {});
    it("Should not transfer if sender in whitelist, but spender in blacklist", async () => {});
    it("Should not transfer if spender in whitelist, but sender in blacklist", async () => {});
    it("Should not transfer if spender in whitelist, but receiver in blacklist", async () => {});
    it("Should not transfer if receiver in whitelist, but sender in blacklist", async () => {});
    it("Should not transfer if receiver in whitelist, but spender in blacklist", async () => {});
  });

  // TODO: test Events in separate suite
});
