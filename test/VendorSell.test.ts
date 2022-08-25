import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { VendorSell__factory, Token1__factory } from "typechain-types";

describe("Vendor Contract", function () {
  async function deployContractFixture() {
    const [adminAccount, tokenPoolAcc, changeTokenPoolAcc, ...restSigners] =
      await ethers.getSigners();

    const swapRate = 50; // 0.5
    const initialSupply = 1_000_000_000_000;

    const token = await new Token1__factory(adminAccount).deploy(
      initialSupply,
      tokenPoolAcc.address
    );
    const changeToken = await new Token1__factory(adminAccount).deploy(
      initialSupply,
      changeTokenPoolAcc.address
    );

    await token.deployed();
    await changeToken.deployed();

    const swapContract = await new VendorSell__factory(adminAccount).deploy(
      token.address,
      tokenPoolAcc.address,
      changeToken.address,
      changeTokenPoolAcc.address,
      swapRate
    );

    await token
      .connect(tokenPoolAcc)
      .approve(swapContract.address, ethers.constants.MaxUint256);

    await changeToken
      .connect(changeTokenPoolAcc)
      .approve(swapContract.address, ethers.constants.MaxUint256);

    await swapContract.deployed();

    return {
      swapContract,
      adminAccount,
      initialSupply,
      token,
      changeToken,
      tokenPoolAcc,
      changeTokenPoolAcc,
      swapRate,
      restSigners,
    };
  }

  it("Should calculate correct swap rate for token", async function () {
    const { swapContract, swapRate } = await loadFixture(deployContractFixture);

    expect(await swapContract.getEquivalentTokenEstimate(100)).to.be.eq(
      ethers.BigNumber.from(100).mul(swapRate).div(100)
    );
    expect(await swapContract.getEquivalentTokenEstimate(0)).to.be.eq(
      ethers.BigNumber.from(0).mul(swapRate).div(100)
    );
    const largeUint = ethers.constants.MaxUint256.div(1000);
    expect(await swapContract.getEquivalentTokenEstimate(largeUint)).to.be.eq(
      largeUint.mul(swapRate).div(100)
    );
  });
  it("Should calculate correct swap rate for change token", async function () {
    const { swapContract, swapRate } = await loadFixture(deployContractFixture);

    expect(await swapContract.getEquivalentChangeTokenEstimate(100)).to.be.eq(
      (100 * 100) / swapRate
    );
    expect(await swapContract.getEquivalentChangeTokenEstimate(0)).to.be.eq(
      (0 * 100) / swapRate
    );
    const largeUint = ethers.constants.MaxUint256.div(1000);
    expect(
      await swapContract.getEquivalentChangeTokenEstimate(largeUint)
    ).to.be.eq(largeUint.mul(100).div(swapRate));
  });

  it("Should revert if user allowance not enough", async function () {
    const {
      swapContract,
      adminAccount,
      tokenPoolAcc,
      changeTokenPoolAcc,
      token,
      changeToken,
      restSigners,
    } = await loadFixture(deployContractFixture);

    await swapContract.connect(adminAccount).enableSell();

    const [acc1, acc2] = restSigners;

    await token.connect(tokenPoolAcc).transfer(acc1.address, 1000);
    await changeToken.connect(changeTokenPoolAcc).transfer(acc2.address, 1000);

    // No allowance
    await expect(
      swapContract.connect(acc1).sellTokens(1000)
    ).to.be.revertedWith("User allowance of token is not enough");
    await expect(swapContract.connect(acc2).buyTokens(1000)).to.be.revertedWith(
      "User allowance of token is not enough"
    );

    // Low allowance
    await token.connect(acc1).approve(swapContract.address, 10);
    await changeToken.connect(acc2).approve(swapContract.address, 10);

    await expect(
      swapContract.connect(acc1).sellTokens(1000)
    ).to.be.revertedWith("User allowance of token is not enough");
    await expect(swapContract.connect(acc2).buyTokens(1000)).to.be.revertedWith(
      "User allowance of token is not enough"
    );

    // Sufficient allowance
    await token.connect(acc1).approve(swapContract.address, 1000);
    await changeToken.connect(acc2).approve(swapContract.address, 1000);

    await expect(swapContract.connect(acc1).sellTokens(1000)).not.to.be
      .reverted;

    await expect(swapContract.connect(acc2).buyTokens(1000)).not.to.be.reverted;
  });

  it("Should revert if user balance not enough", async function () {
    const {
      swapContract,
      adminAccount,
      tokenPoolAcc,
      changeTokenPoolAcc,
      token,
      changeToken,
      restSigners,
    } = await loadFixture(deployContractFixture);

    await swapContract.connect(adminAccount).enableSell();

    const [acc1, acc2] = restSigners;

    await token.connect(acc1).approve(swapContract.address, 10000);
    await changeToken.connect(acc2).approve(swapContract.address, 10000);

    // No balance
    await expect(
      swapContract.connect(acc1).sellTokens(1000)
    ).to.be.revertedWith("User balance of token is not enough");
    await expect(swapContract.connect(acc2).buyTokens(1000)).to.be.revertedWith(
      "User balance of token is not enough"
    );

    // Low balance
    await token.connect(tokenPoolAcc).transfer(acc1.address, 100);
    await changeToken.connect(changeTokenPoolAcc).transfer(acc2.address, 100);

    await expect(
      swapContract.connect(acc1).sellTokens(1000)
    ).to.be.revertedWith("User balance of token is not enough");
    await expect(swapContract.connect(acc2).buyTokens(1000)).to.be.revertedWith(
      "User balance of token is not enough"
    );

    // Sufficient balance
    await token.connect(tokenPoolAcc).transfer(acc1.address, 1000);
    await changeToken.connect(changeTokenPoolAcc).transfer(acc2.address, 1000);

    await expect(swapContract.connect(acc1).sellTokens(1000)).not.to.be
      .reverted;

    await expect(swapContract.connect(acc2).buyTokens(1000)).not.to.be.reverted;
  });

  it("Should revert if pool allowance not enough", async function () {
    const {
      swapContract,
      adminAccount,
      tokenPoolAcc,
      changeTokenPoolAcc,
      token,
      changeToken,
      restSigners,
    } = await loadFixture(deployContractFixture);

    await swapContract.connect(adminAccount).enableSell();

    const [acc1, acc2] = restSigners;

    await token.connect(tokenPoolAcc).transfer(acc1.address, 1000);
    await changeToken.connect(changeTokenPoolAcc).transfer(acc2.address, 1000);

    await token.connect(acc1).approve(swapContract.address, 1000);
    await changeToken.connect(acc2).approve(swapContract.address, 1000);

    await token.connect(tokenPoolAcc).approve(swapContract.address, 10);
    await changeToken
      .connect(changeTokenPoolAcc)
      .approve(swapContract.address, 10);

    await expect(
      swapContract.connect(acc1).sellTokens(1000)
    ).to.be.revertedWith("Vendor allowance of change token is not enough");

    await expect(swapContract.connect(acc2).buyTokens(1000)).to.be.revertedWith(
      "Vendor allowance of token is not enough"
    );

    await token.connect(tokenPoolAcc).approve(swapContract.address, 10000);
    await changeToken
      .connect(changeTokenPoolAcc)
      .approve(swapContract.address, 10000);

    await expect(swapContract.connect(acc1).sellTokens(1000)).not.to.be
      .reverted;

    await expect(swapContract.connect(acc2).buyTokens(1000)).not.to.be.reverted;
  });

  it("Should revert if pool balance not enough", async function () {
    const {
      swapContract,
      adminAccount,
      tokenPoolAcc,
      changeTokenPoolAcc,
      token,
      changeToken,
      restSigners,
      initialSupply,
    } = await loadFixture(deployContractFixture);

    await swapContract.connect(adminAccount).enableSell();

    const [acc1, acc2] = restSigners;

    await token.connect(tokenPoolAcc).burn(initialSupply - 1100);
    await changeToken.connect(changeTokenPoolAcc).burn(initialSupply - 1100);

    await token.connect(tokenPoolAcc).transfer(acc1.address, 1000);
    await changeToken.connect(changeTokenPoolAcc).transfer(acc2.address, 1000);
    await token.connect(acc1).approve(swapContract.address, 1000);
    await changeToken.connect(acc2).approve(swapContract.address, 1000);

    await expect(swapContract.connect(acc1).sellTokens(300)).to.be.revertedWith(
      "Vendor balance of change token is not enough"
    );

    await expect(swapContract.connect(acc2).buyTokens(300)).to.be.revertedWith(
      "Vendor balance of token is not enough"
    );

    await expect(swapContract.connect(acc1).sellTokens(50)).not.to.be.reverted;

    await expect(swapContract.connect(acc2).buyTokens(300)).not.to.be.reverted;
  });

  it("Should sell token", async function () {
    const {
      swapContract,
      adminAccount,
      tokenPoolAcc,
      changeTokenPoolAcc,
      token,
      changeToken,
      restSigners,
    } = await loadFixture(deployContractFixture);

    await swapContract.connect(adminAccount).enableSell();

    const [acc1] = restSigners;

    await token.connect(tokenPoolAcc).transfer(acc1.address, 1001);
    await token.connect(acc1).approve(swapContract.address, 1001);

    await expect(swapContract.connect(acc1).sellTokens(0)).to.be.revertedWith(
      "Insufficient amount"
    );

    await expect(swapContract.connect(acc1).sellTokens(1))
      .to.changeTokenBalances(
        token,
        [acc1.address, tokenPoolAcc.address],
        [-1, 1]
      )
      .to.changeTokenBalances(
        changeToken,
        [changeTokenPoolAcc.address, acc1.address],
        [-2, 2]
      );

    await expect(swapContract.connect(acc1).sellTokens(1000))
      .to.changeTokenBalances(
        token,
        [acc1.address, tokenPoolAcc.address],
        [-1000, 1000]
      )
      .to.changeTokenBalances(
        changeToken,
        [changeTokenPoolAcc.address, acc1.address],
        [-2000, 2000]
      );
  });

  it("Should buy token", async function () {
    const {
      swapContract,
      tokenPoolAcc,
      changeTokenPoolAcc,
      token,
      changeToken,
      restSigners,
    } = await loadFixture(deployContractFixture);

    const [acc2] = restSigners;

    await changeToken.connect(changeTokenPoolAcc).transfer(acc2.address, 1002);
    await changeToken.connect(acc2).approve(swapContract.address, 1002);

    await expect(swapContract.connect(acc2).buyTokens(0)).to.be.revertedWith(
      "Insufficient amount"
    );
    await expect(swapContract.connect(acc2).buyTokens(1)).to.be.revertedWith(
      "Insufficient amount"
    );

    await expect(swapContract.connect(acc2).buyTokens(2))
      .to.changeTokenBalances(
        changeToken,
        [acc2.address, changeTokenPoolAcc.address],
        [-2, 2]
      )
      .to.changeTokenBalances(
        token,
        [tokenPoolAcc.address, acc2.address],
        [-1, 1]
      );

    await expect(swapContract.connect(acc2).buyTokens(1000))
      .to.changeTokenBalances(
        changeToken,
        [acc2.address, changeTokenPoolAcc.address],
        [-1000, 1000]
      )
      .to.changeTokenBalances(
        token,
        [tokenPoolAcc.address, acc2.address],
        [-500, 500]
      );
  });

  it("Should disable sell on deploy", async function () {
    const { swapContract } = await loadFixture(deployContractFixture);
    expect(await swapContract.isSellAvailable()).to.be.eq(false);
  });

  it("Should not swap tokens if paused", async function () {
    const {
      swapContract,
      adminAccount,
      tokenPoolAcc,
      changeTokenPoolAcc,
      token,
      changeToken,
      restSigners,
    } = await loadFixture(deployContractFixture);

    await swapContract.connect(adminAccount).pause();
    await swapContract.connect(adminAccount).enableSell();

    const [acc1, acc2] = restSigners;

    await token.connect(tokenPoolAcc).transfer(acc1.address, 1000);
    await changeToken.connect(changeTokenPoolAcc).transfer(acc2.address, 1000);
    await token.connect(acc1).approve(swapContract.address, 1000);
    await changeToken.connect(acc2).approve(swapContract.address, 1000);

    await expect(swapContract.connect(acc1).sellTokens(100)).to.be.revertedWith(
      "Pausable: paused"
    );
    await expect(swapContract.connect(acc2).buyTokens(100)).to.be.revertedWith(
      "Pausable: paused"
    );

    await swapContract.connect(adminAccount).unpause();

    await expect(swapContract.connect(acc1).sellTokens(100)).not.to.be.reverted;
    await expect(swapContract.connect(acc2).buyTokens(100)).not.to.be.reverted;
  });

  it("Should not sell tokens if selling is disabled", async function () {
    const {
      swapContract,
      adminAccount,
      tokenPoolAcc,
      changeTokenPoolAcc,
      token,
      changeToken,
      restSigners,
    } = await loadFixture(deployContractFixture);

    await swapContract.connect(adminAccount).disableSell();

    const [acc1, acc2] = restSigners;

    await token.connect(tokenPoolAcc).transfer(acc1.address, 1000);
    await changeToken.connect(changeTokenPoolAcc).transfer(acc2.address, 1000);
    await token.connect(acc1).approve(swapContract.address, 1000);
    await changeToken.connect(acc2).approve(swapContract.address, 1000);

    await expect(swapContract.connect(acc2).buyTokens(100)).not.to.be.reverted;
    await expect(swapContract.connect(acc1).sellTokens(100)).to.be.revertedWith(
      "Selling is not available"
    );

    await swapContract.connect(adminAccount).enableSell();

    await expect(swapContract.connect(acc2).buyTokens(100)).not.to.be.reverted;
    await expect(swapContract.connect(acc1).sellTokens(100)).not.to.be.reverted;
  });

  it("Should change sell availability only by Admin", async function () {
    const { swapContract, adminAccount, restSigners } = await loadFixture(
      deployContractFixture
    );

    const [acc1, acc2] = restSigners;

    expect(await swapContract.isSellAvailable()).to.be.eq(false);

    await expect(swapContract.connect(acc1).enableSell()).to.be.reverted;
    await expect(swapContract.connect(adminAccount).enableSell()).not.to.be
      .reverted;

    expect(await swapContract.isSellAvailable()).to.be.eq(true);

    await expect(swapContract.connect(acc1).disableSell()).to.be.reverted;
    await expect(swapContract.connect(adminAccount).disableSell()).not.to.be
      .reverted;

    expect(await swapContract.isSellAvailable()).to.be.eq(false);

    const AdminRole = await swapContract.DEFAULT_ADMIN_ROLE();
    await swapContract.connect(adminAccount).grantRole(AdminRole, acc2.address);

    await expect(swapContract.connect(acc2).enableSell()).not.to.be.reverted;
    expect(await swapContract.isSellAvailable()).to.be.eq(true);
    await expect(swapContract.connect(acc2).disableSell()).not.to.be.reverted;
    expect(await swapContract.isSellAvailable()).to.be.eq(false);

    await swapContract
      .connect(adminAccount)
      .revokeRole(AdminRole, acc2.address);
    await expect(swapContract.connect(acc2).enableSell()).to.be.reverted;
    await expect(swapContract.connect(acc2).disableSell()).to.be.reverted;
  });

  it("Should pause / unpause only by Admin", async function () {
    const { swapContract, adminAccount, restSigners } = await loadFixture(
      deployContractFixture
    );

    const [acc1, acc2] = restSigners;

    await expect(swapContract.connect(acc1).pause()).to.be.reverted;
    await expect(swapContract.connect(acc1).unpause()).to.be.reverted;

    const AdminRole = await swapContract.DEFAULT_ADMIN_ROLE();
    await swapContract.connect(adminAccount).grantRole(AdminRole, acc2.address);

    await expect(swapContract.connect(acc2).pause()).not.to.be.reverted;
    await expect(swapContract.connect(acc2).unpause()).not.to.be.reverted;

    await swapContract
      .connect(adminAccount)
      .revokeRole(AdminRole, acc2.address);

    await expect(swapContract.connect(acc2).pause()).to.be.reverted;
    await expect(swapContract.connect(acc2).unpause()).to.be.reverted;
  });

  it("Should return reserves", async function () {
    const {
      swapContract,
      adminAccount,
      initialSupply,
      token,
      tokenPoolAcc,
      restSigners,
      swapRate,
    } = await loadFixture(deployContractFixture);

    expect(await swapContract.getTokenReserve()).to.be.eq(initialSupply);
    expect(await swapContract.getChangeTokenReserve()).to.be.eq(initialSupply);

    const [acc1] = restSigners;

    await token.connect(tokenPoolAcc).transfer(acc1.address, 100);
    await token.connect(acc1).approve(swapContract.address, 100);

    await swapContract.connect(adminAccount).enableSell();
    await expect(swapContract.connect(acc1).sellTokens(50)).not.to.be.reverted;

    expect(await swapContract.getTokenReserve()).to.be.eq(initialSupply - 50);
    expect(await swapContract.getChangeTokenReserve()).to.be.eq(
      initialSupply - (50 * 100) / swapRate
    );
  });

  it("Should change token 1 pool addresses only by admin", async function () {
    const {
      swapContract,
      adminAccount,
      initialSupply,
      token,
      changeToken,
      tokenPoolAcc,
      changeTokenPoolAcc,
      restSigners,
    } = await loadFixture(deployContractFixture);

    const [acc1, acc2, newPool] = restSigners;

    await expect(swapContract.connect(acc1).setTokenPool(newPool.address)).to.be
      .reverted;
    await expect(swapContract.connect(acc1).setChangeTokenPool(newPool.address))
      .to.be.reverted;

    expect(await swapContract.getTokenReserve()).to.be.eq(initialSupply);
    expect(await swapContract.getChangeTokenReserve()).to.be.eq(initialSupply);
    token.connect(tokenPoolAcc).transfer(newPool.address, 1000);
    changeToken.connect(changeTokenPoolAcc).transfer(newPool.address, 2000);

    const AdminRole = await swapContract.DEFAULT_ADMIN_ROLE();
    await swapContract.connect(adminAccount).grantRole(AdminRole, acc2.address);

    await expect(swapContract.connect(acc2).setTokenPool(newPool.address)).not
      .to.be.reverted;
    await expect(swapContract.connect(acc2).setChangeTokenPool(newPool.address))
      .not.to.be.reverted;

    expect(await swapContract.getTokenReserve()).to.be.eq(1000);
    expect(await swapContract.getChangeTokenReserve()).to.be.eq(2000);
  });

  it("Should emit event on buy token", async function () {
    const {
      swapContract,
      changeTokenPoolAcc,
      changeToken,
      restSigners,
      swapRate,
    } = await loadFixture(deployContractFixture);

    const [acc2] = restSigners;

    await changeToken.connect(changeTokenPoolAcc).transfer(acc2.address, 1000);
    await changeToken.connect(acc2).approve(swapContract.address, 1000);

    await expect(swapContract.connect(acc2).buyTokens(1000))
      .to.emit(swapContract, "BuyTokens")
      .withArgs(acc2.address, (1000 * swapRate) / 100, 1000);
  });

  it("Should emit event on sell token", async function () {
    const {
      swapContract,
      adminAccount,
      tokenPoolAcc,
      token,
      restSigners,
      swapRate,
    } = await loadFixture(deployContractFixture);

    await swapContract.connect(adminAccount).enableSell();

    const [acc1] = restSigners;

    await token.connect(tokenPoolAcc).transfer(acc1.address, 1000);
    await token.connect(acc1).approve(swapContract.address, 1000);

    await expect(swapContract.connect(acc1).sellTokens(1000))
      .to.emit(swapContract, "SellTokens")
      .withArgs(acc1.address, 1000, (1000 * 100) / swapRate);
  });
});
