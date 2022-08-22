import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { BasicToken__factory } from "typechain-types";

describe("BasicToken", function () {
  async function deployTokenFixture() {
    const initialSupply = BigNumber.from(10).pow(18).mul(21_000_000);

    const [adminAccount, holderAccount, ...restSigners] =
      await ethers.getSigners();

    const token = await new BasicToken__factory(adminAccount).deploy(
      initialSupply,
      holderAccount.address,
      "BasicToken",
      "BST"
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
      expect(await token.totalMinted()).to.be.eq(initialSupply);
      expect(await token.totalBurn()).to.be.eq(BigNumber.from(0));
    });

    it("Should deploy with correct rights for admin", async function () {
      const { token, adminAccount, holderAccount } = await loadFixture(
        deployTokenFixture
      );

      const AdminRole = await token.DEFAULT_ADMIN_ROLE();
      const PauserRole = await token.PAUSER_ROLE();

      expect(await token.hasRole(AdminRole, adminAccount.address)).to.be.eq(
        true
      );
      expect(await token.hasRole(PauserRole, adminAccount.address)).to.be.eq(
        true
      );
      expect(await token.hasRole(AdminRole, holderAccount.address)).to.be.eq(
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

      const [acc1, acc2] = restSigners;

      await expect(
        token.connect(holderAccount).transfer(acc1.address, 100)
      ).to.changeTokenBalances(token, [holderAccount, acc1], [-100, 100]);

      await expect(
        token.connect(acc1).transfer(acc2.address, 100)
      ).to.changeTokenBalances(token, [acc1, acc2], [-100, 100]);
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

    it("Should not transfer more than have", async function () {
      const { token, holderAccount, restSigners } = await loadFixture(
        deployTokenFixture
      );

      const [acc1, acc2, acc3] = restSigners;

      await token.connect(holderAccount).transfer(acc1.address, 100);
      await token.connect(acc1).approve(acc2.address, 100);

      await expect(token.connect(acc1).transfer(acc3.address, 101)).to.be
        .reverted;
      await expect(
        token.connect(acc2).transferFrom(acc1.address, acc3.address, 101)
      ).to.be.reverted;

      expect(await token.balanceOf(acc1.address)).to.be.eq(100);
      expect(await token.balanceOf(acc3.address)).to.be.eq(0);
    });

    it("Should not burn more than have", async function () {
      const { token, holderAccount, restSigners } = await loadFixture(
        deployTokenFixture
      );

      const [acc1, acc2] = restSigners;

      await token.connect(holderAccount).transfer(acc1.address, 100);
      await token.connect(holderAccount).approve(acc2.address, 100);

      await expect(token.connect(acc1).burn(101)).to.be.reverted;
      await expect(await token.connect(acc1).burn(100)).to.changeTokenBalance(
        token,
        acc1.address,
        -100
      );

      await expect(token.connect(acc2).burnFrom(holderAccount.address, 101)).to
        .be.reverted;
      await expect(
        await token.connect(acc2).burnFrom(holderAccount.address, 100)
      ).to.changeTokenBalance(token, holderAccount.address, -100);
    });

    it("Should increase totalBurn on burn", async function () {
      const { token, holderAccount, restSigners } = await loadFixture(
        deployTokenFixture
      );

      const [acc1] = restSigners;

      const initialSupply = await token.totalMinted();
      expect(await token.totalSupply()).to.be.eq(initialSupply);
      expect(await token.totalBurn()).to.be.eq(0);

      await token.connect(holderAccount).burn(100);
      expect(await token.totalMinted()).to.be.eq(initialSupply);
      expect(await token.totalSupply()).to.be.eq(initialSupply.sub(100));
      expect(await token.totalBurn()).to.be.eq(100);

      await token.connect(holderAccount).approve(acc1.address, 100);
      await token.connect(acc1).burnFrom(holderAccount.address, 100);
      expect(await token.totalMinted()).to.be.eq(initialSupply);
      expect(await token.totalSupply()).to.be.eq(initialSupply.sub(200));
      expect(await token.totalBurn()).to.be.eq(200);
    });
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

    it("Should add to blacklist only by Admin", async function () {
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

    it("Should remove from blacklist only by Admin", async function () {
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

    it("Should add to whitelist only by Admin", async function () {
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

    it("Should remove from whitelist only by Admin", async function () {
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

    it("Should toggle whitelist mode only by Admin", async function () {
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
  });

  describe("Pause", function () {
    it("Should not transfer when paused", async function () {
      const { token, adminAccount, holderAccount, restSigners } =
        await loadFixture(deployTokenFixture);

      const [acc1, acc2, acc3] = restSigners;

      await token.connect(holderAccount).transfer(acc1.address, 100);
      await token.connect(acc1).increaseAllowance(acc2.address, 100);
      await token.connect(adminAccount).pause();

      await expect(
        token.connect(acc1).transfer(acc3.address, 10)
      ).to.be.revertedWith("Pausable: paused");

      await expect(
        token.connect(acc2).transferFrom(acc1.address, acc3.address, 10)
      ).to.be.revertedWith("Pausable: paused");

      expect(await token.balanceOf(acc1.address)).to.eq(100);
      expect(await token.balanceOf(acc2.address)).to.eq(0);
      expect(await token.balanceOf(acc3.address)).to.eq(0);

      await token.connect(adminAccount).unpause();
      await token.connect(acc1).transfer(acc3.address, 10);
      await token.connect(acc2).transferFrom(acc1.address, acc3.address, 10);

      expect(await token.balanceOf(acc1.address)).to.eq(80);
      expect(await token.balanceOf(acc2.address)).to.eq(0);
      expect(await token.balanceOf(acc3.address)).to.eq(20);
    });
  });

  describe("Blacklist / Whitelist", function () {
    async function deployWithMoneyFixture() {
      const { token, holderAccount, restSigners, ...params } =
        await loadFixture(deployTokenFixture);

      const [accSender, accReceiver, accSpender] = restSigners;

      await expect(
        token.connect(holderAccount).transfer(accSender.address, 2000)
      ).to.changeTokenBalances(
        token,
        [holderAccount, accSender],
        [-2000, 2000]
      );

      await token.connect(accSender).approve(accSpender.address, 1000);

      return {
        token,
        holderAccount,
        accSender,
        accReceiver,
        accSpender,
        ...params,
      };
    }

    it("Should not transfer if sender in blacklist", async () => {
      const { token, adminAccount, accSender, accReceiver } = await loadFixture(
        deployWithMoneyFixture
      );

      await token.connect(adminAccount).addToBlacklist([accSender.address]);

      await expect(
        token.connect(accSender).transfer(accReceiver.address, 10)
      ).to.be.revertedWith("Blacklist: sender is in blacklist");

      await token
        .connect(adminAccount)
        .removeFromBlacklist([accSender.address]);

      await expect(token.connect(accSender).transfer(accReceiver.address, 10))
        .not.to.be.reverted;
    });
    it("Should not transfer if receiver in blacklist", async () => {
      const { token, adminAccount, accSender, accReceiver } = await loadFixture(
        deployWithMoneyFixture
      );

      await token.connect(adminAccount).addToBlacklist([accReceiver.address]);

      await expect(
        token.connect(accSender).transfer(accReceiver.address, 10)
      ).to.be.revertedWith("Blacklist: receiver is in blacklist");

      await token
        .connect(adminAccount)
        .removeFromBlacklist([accReceiver.address]);

      await expect(token.connect(accSender).transfer(accReceiver.address, 10))
        .not.to.be.reverted;
    });
    it("Should not transfer if spender in blacklist", async () => {
      const { token, adminAccount, accSender, accReceiver, accSpender } =
        await loadFixture(deployWithMoneyFixture);

      await token.connect(adminAccount).addToBlacklist([accSpender.address]);

      await expect(
        token
          .connect(accSpender)
          .transferFrom(accSender.address, accReceiver.address, 10)
      ).to.be.revertedWith("Blacklist: spender is in blacklist");

      await token
        .connect(adminAccount)
        .removeFromBlacklist([accSpender.address]);

      await expect(
        token
          .connect(accSpender)
          .transferFrom(accSender.address, accReceiver.address, 10)
      ).not.to.be.reverted;
    });
    it("Should not transfer if sender/spender/receiver not in whitelist", async () => {
      const { token, adminAccount, accSender, accReceiver, accSpender } =
        await loadFixture(deployWithMoneyFixture);

      await token.connect(adminAccount).onWhitelistMode();

      await expect(
        token.connect(accSender).transfer(accReceiver.address, 10)
      ).to.be.revertedWith("Whitelist: sender or receiver is not in whitelist");

      await expect(
        token
          .connect(accSpender)
          .transferFrom(accSender.address, accReceiver.address, 10)
      ).to.be.revertedWith("Whitelist: sender or receiver is not in whitelist");
    });
    it("Should transfer if sender in whitelist", async () => {
      const { token, adminAccount, accSender, accReceiver, accSpender } =
        await loadFixture(deployWithMoneyFixture);

      await token.connect(adminAccount).onWhitelistMode();
      await token.addToWhitelist([accSender.address]);

      await expect(token.connect(accSender).transfer(accReceiver.address, 10))
        .not.to.be.reverted;

      await expect(
        token
          .connect(accSpender)
          .transferFrom(accSender.address, accReceiver.address, 10)
      ).not.to.be.reverted;
    });
    it("Should transfer if spender in whitelist", async () => {
      const { token, adminAccount, accSender, accReceiver, accSpender } =
        await loadFixture(deployWithMoneyFixture);

      await token.connect(adminAccount).onWhitelistMode();
      await token.addToWhitelist([accSpender.address]);

      await expect(
        token
          .connect(accSpender)
          .transferFrom(accSender.address, accReceiver.address, 10)
      ).not.to.be.reverted;
    });
    it("Should transfer if receiver in whitelist", async () => {
      const { token, adminAccount, accSender, accReceiver, accSpender } =
        await loadFixture(deployWithMoneyFixture);

      await token.connect(adminAccount).onWhitelistMode();
      await token.addToWhitelist([accReceiver.address]);

      await expect(token.connect(accSender).transfer(accReceiver.address, 10))
        .not.to.be.reverted;

      await expect(
        token
          .connect(accSpender)
          .transferFrom(accSender.address, accReceiver.address, 10)
      ).not.to.be.reverted;
    });
    it("Should not transfer if sender in whitelist, but receiver in blacklist", async () => {
      const { token, adminAccount, accSender, accReceiver, accSpender } =
        await loadFixture(deployWithMoneyFixture);

      await token.connect(adminAccount).onWhitelistMode();
      await token.addToWhitelist([accSender.address]);
      await token.addToBlacklist([accReceiver.address]);

      await expect(
        token.connect(accSender).transfer(accReceiver.address, 10)
      ).to.be.revertedWith("Blacklist: receiver is in blacklist");

      await expect(
        token
          .connect(accSpender)
          .transferFrom(accSender.address, accReceiver.address, 10)
      ).to.be.revertedWith("Blacklist: receiver is in blacklist");
    });
    it("Should not transfer if sender in whitelist, but spender in blacklist", async () => {
      const { token, adminAccount, accSender, accReceiver, accSpender } =
        await loadFixture(deployWithMoneyFixture);

      await token.connect(adminAccount).onWhitelistMode();
      await token.addToWhitelist([accSender.address]);
      await token.addToBlacklist([accSpender.address]);

      await expect(
        token
          .connect(accSpender)
          .transferFrom(accSender.address, accReceiver.address, 10)
      ).to.be.revertedWith("Blacklist: spender is in blacklist");
    });
    it("Should not transfer if spender in whitelist, but sender in blacklist", async () => {
      const { token, adminAccount, accSender, accReceiver, accSpender } =
        await loadFixture(deployWithMoneyFixture);

      await token.connect(adminAccount).onWhitelistMode();
      await token.addToWhitelist([accSpender.address]);
      await token.addToBlacklist([accSender.address]);

      await expect(
        token
          .connect(accSpender)
          .transferFrom(accSender.address, accReceiver.address, 10)
      ).to.be.revertedWith("Blacklist: sender is in blacklist");
    });
    it("Should not transfer if spender in whitelist, but receiver in blacklist", async () => {
      const { token, adminAccount, accSender, accReceiver, accSpender } =
        await loadFixture(deployWithMoneyFixture);

      await token.connect(adminAccount).onWhitelistMode();
      await token.addToWhitelist([accSpender.address]);
      await token.addToBlacklist([accReceiver.address]);

      await expect(
        token
          .connect(accSpender)
          .transferFrom(accSender.address, accReceiver.address, 10)
      ).to.be.revertedWith("Blacklist: receiver is in blacklist");
    });
    it("Should not transfer if receiver in whitelist, but sender in blacklist", async () => {
      const { token, adminAccount, accSender, accReceiver, accSpender } =
        await loadFixture(deployWithMoneyFixture);

      await token.connect(adminAccount).onWhitelistMode();
      await token.addToWhitelist([accReceiver.address]);
      await token.addToBlacklist([accSender.address]);

      await expect(
        token.connect(accSender).transfer(accReceiver.address, 10)
      ).to.be.revertedWith("Blacklist: sender is in blacklist");

      await expect(
        token
          .connect(accSpender)
          .transferFrom(accSender.address, accReceiver.address, 10)
      ).to.be.revertedWith("Blacklist: sender is in blacklist");
    });
    it("Should not transfer if receiver in whitelist, but spender in blacklist", async () => {
      const { token, adminAccount, accSender, accReceiver, accSpender } =
        await loadFixture(deployWithMoneyFixture);

      await token.connect(adminAccount).onWhitelistMode();
      await token.addToWhitelist([accReceiver.address]);
      await token.addToBlacklist([accSpender.address]);

      await expect(
        token
          .connect(accSpender)
          .transferFrom(accSender.address, accReceiver.address, 10)
      ).to.be.revertedWith("Blacklist: spender is in blacklist");
    });
  });

  describe("Events", function () {
    it("Should emit Paused / Unpaused event", async function () {
      const { token, adminAccount, restSigners } = await loadFixture(
        deployTokenFixture
      );

      const [acc1] = restSigners;
      const PauserRole = await token.PAUSER_ROLE();

      await token.connect(adminAccount).grantRole(PauserRole, acc1.address);

      await expect(await token.connect(acc1).pause())
        .to.emit(token, "Paused")
        .withArgs(acc1.address);

      await expect(await token.connect(acc1).unpause())
        .to.emit(token, "Unpaused")
        .withArgs(acc1.address);
    });

    it("Should emit Transfer / Approval event", async function () {
      const { token, holderAccount, restSigners } = await loadFixture(
        deployTokenFixture
      );

      const [acc1, acc2] = restSigners;

      await expect(
        await token.connect(holderAccount).transfer(acc1.address, 100)
      )
        .to.emit(token, "Transfer")
        .withArgs(holderAccount.address, acc1.address, 100);

      await expect(
        await token.connect(holderAccount).approve(acc2.address, 100)
      )
        .to.emit(token, "Approval")
        .withArgs(holderAccount.address, acc2.address, 100);

      await expect(
        await token
          .connect(acc2)
          .transferFrom(holderAccount.address, acc1.address, 100)
      )
        .to.emit(token, "Transfer")
        .withArgs(holderAccount.address, acc1.address, 100);
    });

    it("Should emit Transfer on burn", async function () {
      const { token, holderAccount, restSigners } = await loadFixture(
        deployTokenFixture
      );

      await expect(await token.connect(holderAccount).burn(50))
        .to.emit(token, "Transfer")
        .withArgs(holderAccount.address, ethers.constants.AddressZero, 50);

      const [acc1] = restSigners;
      await token.connect(holderAccount).approve(acc1.address, 100);

      await expect(
        await token.connect(acc1).burnFrom(holderAccount.address, 30)
      )
        .to.emit(token, "Transfer")
        .withArgs(holderAccount.address, ethers.constants.AddressZero, 30);
    });

    it("Should emit RoleGranted / RoleRevoked", async function () {
      const { token, adminAccount, restSigners } = await loadFixture(
        deployTokenFixture
      );

      const [acc1] = restSigners;
      const PauserRole = await token.PAUSER_ROLE();

      await expect(
        await token.connect(adminAccount).grantRole(PauserRole, acc1.address)
      )
        .to.emit(token, "RoleGranted")
        .withArgs(PauserRole, acc1.address, adminAccount.address);

      await expect(
        await token.connect(adminAccount).revokeRole(PauserRole, acc1.address)
      )
        .to.emit(token, "RoleRevoked")
        .withArgs(PauserRole, acc1.address, adminAccount.address);
    });
  });
});
