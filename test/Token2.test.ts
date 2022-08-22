import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { Token2__factory } from "typechain-types";

describe("Token 2", function () {
  async function deployTokenFixture() {
    const initialSupply = BigNumber.from(10).pow(18).mul(21_000_000);

    const [adminAccount, holderAccount, ...restSigners] =
      await ethers.getSigners();

    const token = await new Token2__factory(adminAccount).deploy(
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

      expect(await token.isWhitelistRestrictionMode()).to.be.eq(true);

      const MinterRole = await token.MINTER_ROLE();
      expect(await token.hasRole(MinterRole, adminAccount.address)).to.be.eq(
        true
      );
      expect(await token.hasRole(MinterRole, holderAccount.address)).to.be.eq(
        false
      );

      expect(await token.isAddressInWhiteList(adminAccount.address)).to.be.eq(
        true
      );
      expect(await token.isAddressInWhiteList(holderAccount.address)).to.be.eq(
        true
      );
    });
  });

  describe("Mint", function () {
    it("Should add/remove to whitelist on granting/revoking Minter role", async function () {
      const { token, adminAccount, restSigners } = await loadFixture(
        deployTokenFixture
      );

      const [acc1] = restSigners;

      expect(await token.isAddressInWhiteList(acc1.address)).to.be.eq(false);

      const MinterRole = token.MINTER_ROLE();
      await token.connect(adminAccount).grantRole(MinterRole, acc1.address);
      expect(await token.isAddressInWhiteList(acc1.address)).to.be.eq(true);

      await token.revokeRole(MinterRole, acc1.address);
      expect(await token.isAddressInWhiteList(acc1.address)).to.be.eq(false);

      const PauserRole = token.PAUSER_ROLE();
      await token.connect(adminAccount).grantRole(PauserRole, acc1.address);
      expect(await token.isAddressInWhiteList(acc1.address)).to.be.eq(false);

      await token.revokeRole(PauserRole, acc1.address);
      expect(await token.isAddressInWhiteList(acc1.address)).to.be.eq(false);
    });
    it("Should mint only with Minter role", async function () {
      const { token, adminAccount, restSigners } = await loadFixture(
        deployTokenFixture
      );

      const [acc1, acc2] = restSigners;

      const initialSupply = await token.totalMinted();

      // With Admin role
      await expect(await token.connect(adminAccount).mint(acc1.address, 1000))
        .to.changeTokenBalance(token, acc1, 1000)
        .to.emit(token, "Transfer")
        .withArgs(ethers.constants.AddressZero, acc1.address, 1000);

      expect(await token.totalMinted()).to.be.eq(initialSupply.add(1000));

      // With no role
      await expect(token.connect(acc2).mint(acc1.address, 1000)).to.be.reverted;
      expect(await token.balanceOf(acc1.address)).to.be.eq(1000);

      // Grant role
      const MinterRole = await token.MINTER_ROLE();
      await expect(
        await token.connect(adminAccount).grantRole(MinterRole, acc2.address)
      )
        .to.emit(token, "RoleGranted")
        .withArgs(MinterRole, acc2.address, adminAccount.address);

      await expect(await token.connect(acc2).mint(acc1.address, 1000))
        .to.changeTokenBalance(token, acc1, 1000)
        .to.emit(token, "Transfer")
        .withArgs(ethers.constants.AddressZero, acc1.address, 1000);

      expect(await token.totalMinted()).to.be.eq(initialSupply.add(2000));

      // Revoke role
      await expect(
        await token.connect(adminAccount).revokeRole(MinterRole, acc2.address)
      )
        .to.emit(token, "RoleRevoked")
        .withArgs(MinterRole, acc2.address, adminAccount.address);

      await expect(token.connect(acc2).mint(acc1.address, 1000)).to.be.reverted;
      expect(await token.balanceOf(acc1.address)).to.be.eq(2000);
      expect(await token.totalMinted()).to.be.eq(initialSupply.add(2000));
    });
    it("Should emit Transfer on mint", async () => {
      const { token, adminAccount, restSigners } = await loadFixture(
        deployTokenFixture
      );

      const [acc1] = restSigners;
      await expect(await token.connect(adminAccount).mint(acc1.address, 1000))
        .to.emit(token, "Transfer")
        .withArgs(ethers.constants.AddressZero, acc1.address, 1000);
    });
  });
});
