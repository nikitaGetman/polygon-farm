import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SwapTokens__factory, Token1__factory } from "typechain-types";

describe("Swap Tokens Contract", function () {
  async function deployContractFixture() {
    const [adminAccount, token1PoolAcc, token2PoolAcc, ...restSigners] =
      await ethers.getSigners();

    const swapRate = 50; // 0.5
    const initialSupply = 1_000_000_000_000;

    const token1 = await new Token1__factory(adminAccount).deploy(
      initialSupply,
      token1PoolAcc.address
    );
    const token2 = await new Token1__factory(adminAccount).deploy(
      initialSupply,
      token2PoolAcc.address
    );

    await token1.deployed();
    await token2.deployed();

    const swapContract = await new SwapTokens__factory(adminAccount).deploy(
      token1.address,
      token1PoolAcc.address,
      token2.address,
      token2PoolAcc.address,
      swapRate
    );

    await token1
      .connect(token1PoolAcc)
      .approve(swapContract.address, ethers.constants.MaxUint256);

    await token2
      .connect(token2PoolAcc)
      .approve(swapContract.address, ethers.constants.MaxUint256);

    await swapContract.deployed();

    return {
      swapContract,
      adminAccount,
      initialSupply,
      token1,
      token2,
      token1PoolAcc,
      token2PoolAcc,
      swapRate,
      restSigners,
    };
  }

  it("Should calculate correct swap rate for token1", async function () {
    const { swapContract, swapRate } = await loadFixture(deployContractFixture);

    expect(await swapContract.getEquivalentToken1Estimate(100)).to.be.eq(
      ethers.BigNumber.from(100).mul(swapRate).div(100)
    );
    expect(await swapContract.getEquivalentToken1Estimate(0)).to.be.eq(
      ethers.BigNumber.from(0).mul(swapRate).div(100)
    );
    const largeUint = ethers.constants.MaxUint256.div(1000);
    expect(await swapContract.getEquivalentToken1Estimate(largeUint)).to.be.eq(
      largeUint.mul(swapRate).div(100)
    );
  });
  it("Should calculate correct swap rate for token2", async function () {
    const { swapContract, swapRate } = await loadFixture(deployContractFixture);

    expect(await swapContract.getEquivalentToken2Estimate(100)).to.be.eq(
      (100 * 100) / swapRate
    );
    expect(await swapContract.getEquivalentToken2Estimate(0)).to.be.eq(
      (0 * 100) / swapRate
    );
    const largeUint = ethers.constants.MaxUint256.div(1000);
    expect(await swapContract.getEquivalentToken2Estimate(largeUint)).to.be.eq(
      largeUint.mul(100).div(swapRate)
    );
  });

  it("Should revert if token allowance not enough", async function () {
    const {
      swapContract,
      adminAccount,
      token1PoolAcc,
      token2PoolAcc,
      token1,
      token2,
      restSigners,
    } = await loadFixture(deployContractFixture);

    await swapContract.connect(adminAccount).enableSell();

    const [acc1, acc2] = restSigners;

    await token1.connect(token1PoolAcc).transfer(acc1.address, 1000);
    await token2.connect(token2PoolAcc).transfer(acc2.address, 1000);

    // No allowance
    await expect(
      swapContract.connect(acc1).buyToken2ForToken1(1000)
    ).to.be.revertedWith("Not enough allowance token1");
    await expect(
      swapContract.connect(acc2).buyToken1ForToken2(1000)
    ).to.be.revertedWith("Not enough allowance token2");

    // Low allowance
    await token1.connect(acc1).approve(swapContract.address, 10);
    await token2.connect(acc2).approve(swapContract.address, 10);

    await expect(
      swapContract.connect(acc1).buyToken2ForToken1(1000)
    ).to.be.revertedWith("Not enough allowance token1");
    await expect(
      swapContract.connect(acc2).buyToken1ForToken2(1000)
    ).to.be.revertedWith("Not enough allowance token2");

    // Sufficient allowance
    await token1.connect(acc1).approve(swapContract.address, 1000);
    await token2.connect(acc2).approve(swapContract.address, 1000);

    await expect(swapContract.connect(acc1).buyToken2ForToken1(1000)).not.to.be
      .reverted;

    await expect(swapContract.connect(acc2).buyToken1ForToken2(1000)).not.to.be
      .reverted;
  });

  it("Should revert if pool allowance not enough", async function () {
    const {
      swapContract,
      adminAccount,
      token1PoolAcc,
      token2PoolAcc,
      token1,
      token2,
      restSigners,
    } = await loadFixture(deployContractFixture);

    await swapContract.connect(adminAccount).enableSell();

    const [acc1, acc2] = restSigners;

    await token1.connect(token1PoolAcc).transfer(acc1.address, 1000);
    await token2.connect(token2PoolAcc).transfer(acc2.address, 1000);

    await token1.connect(acc1).approve(swapContract.address, 1000);
    await token2.connect(acc2).approve(swapContract.address, 1000);

    await token1.connect(token1PoolAcc).approve(swapContract.address, 10);
    await token2.connect(token2PoolAcc).approve(swapContract.address, 10);

    await expect(
      swapContract.connect(acc1).buyToken2ForToken1(1000)
    ).to.be.revertedWith("Not enough pool allowance - token2");

    await expect(
      swapContract.connect(acc2).buyToken1ForToken2(1000)
    ).to.be.revertedWith("Not enough pool allowance - token1");

    await token1.connect(token1PoolAcc).approve(swapContract.address, 10000);
    await token2.connect(token2PoolAcc).approve(swapContract.address, 10000);

    await expect(swapContract.connect(acc1).buyToken2ForToken1(1000)).not.to.be
      .reverted;

    await expect(swapContract.connect(acc2).buyToken1ForToken2(1000)).not.to.be
      .reverted;
  });

  it("Should revert if pool balance not enough", async function () {
    const {
      swapContract,
      adminAccount,
      token1PoolAcc,
      token2PoolAcc,
      token1,
      token2,
      restSigners,
      initialSupply,
    } = await loadFixture(deployContractFixture);

    await swapContract.connect(adminAccount).enableSell();

    const [acc1, acc2] = restSigners;

    await token1.connect(token1PoolAcc).burn(initialSupply - 1100);
    await token2.connect(token2PoolAcc).burn(initialSupply - 1100);

    await token1.connect(token1PoolAcc).transfer(acc1.address, 1000);
    await token2.connect(token2PoolAcc).transfer(acc2.address, 1000);
    await token1.connect(acc1).approve(swapContract.address, 1000);
    await token2.connect(acc2).approve(swapContract.address, 1000);

    await expect(
      swapContract.connect(acc1).buyToken2ForToken1(300)
    ).to.be.revertedWith("Not enough pool balance - token2");

    await expect(
      swapContract.connect(acc2).buyToken1ForToken2(300)
    ).to.be.revertedWith("Not enough pool balance - token1");

    await expect(swapContract.connect(acc1).buyToken2ForToken1(50)).not.to.be
      .reverted;

    await expect(swapContract.connect(acc2).buyToken1ForToken2(300)).not.to.be
      .reverted;
  });

  it("Should swap token 1 for token 2", async function () {
    const {
      swapContract,
      token1PoolAcc,
      token2PoolAcc,
      token1,
      token2,
      restSigners,
    } = await loadFixture(deployContractFixture);

    const [acc1] = restSigners;

    await token1.connect(token1PoolAcc).transfer(acc1.address, 1001);
    await token1.connect(acc1).approve(swapContract.address, 1001);

    await expect(
      swapContract.connect(acc1).buyToken2ForToken1(0)
    ).to.be.revertedWith("Insufficient amount");

    await expect(swapContract.connect(acc1).buyToken2ForToken1(1))
      .to.changeTokenBalances(
        token1,
        [acc1.address, token1PoolAcc.address],
        [-1, 1]
      )
      .to.changeTokenBalances(
        token2,
        [token2PoolAcc.address, acc1.address],
        [-2, 2]
      );

    await expect(swapContract.connect(acc1).buyToken2ForToken1(1000))
      .to.changeTokenBalances(
        token1,
        [acc1.address, token1PoolAcc.address],
        [-1000, 1000]
      )
      .to.changeTokenBalances(
        token2,
        [token2PoolAcc.address, acc1.address],
        [-2000, 2000]
      );
  });

  it("Should swap token 2 for token 1", async function () {
    const {
      swapContract,
      adminAccount,
      token1PoolAcc,
      token2PoolAcc,
      token1,
      token2,
      restSigners,
    } = await loadFixture(deployContractFixture);

    const [acc2] = restSigners;

    await swapContract.connect(adminAccount).enableSell();

    await token2.connect(token2PoolAcc).transfer(acc2.address, 1002);
    await token2.connect(acc2).approve(swapContract.address, 1002);

    await expect(
      swapContract.connect(acc2).buyToken1ForToken2(0)
    ).to.be.revertedWith("Insufficient amount");
    await expect(
      swapContract.connect(acc2).buyToken1ForToken2(1)
    ).to.be.revertedWith("Insufficient amount");

    await expect(swapContract.connect(acc2).buyToken1ForToken2(2))
      .to.changeTokenBalances(
        token2,
        [acc2.address, token2PoolAcc.address],
        [-2, 2]
      )
      .to.changeTokenBalances(
        token1,
        [token1PoolAcc.address, acc2.address],
        [-1, 1]
      );

    await expect(swapContract.connect(acc2).buyToken1ForToken2(1000))
      .to.changeTokenBalances(
        token2,
        [acc2.address, token2PoolAcc.address],
        [-1000, 1000]
      )
      .to.changeTokenBalances(
        token1,
        [token1PoolAcc.address, acc2.address],
        [-500, 500]
      );
  });

  it("Should disable sell on deploy", async function () {
    const { swapContract } = await loadFixture(deployContractFixture);
    expect(await swapContract.isSellAvailable()).to.be.eq(false);
  });

  it("Should not swap tokens is paused", async function () {
    const {
      swapContract,
      adminAccount,
      token1PoolAcc,
      token2PoolAcc,
      token1,
      token2,
      restSigners,
    } = await loadFixture(deployContractFixture);

    await swapContract.connect(adminAccount).pause();
    await swapContract.connect(adminAccount).enableSell();

    const [acc1, acc2] = restSigners;

    await token1.connect(token1PoolAcc).transfer(acc1.address, 1000);
    await token2.connect(token2PoolAcc).transfer(acc2.address, 1000);
    await token1.connect(acc1).approve(swapContract.address, 1000);
    await token2.connect(acc2).approve(swapContract.address, 1000);

    await expect(
      swapContract.connect(acc1).buyToken2ForToken1(100)
    ).to.be.revertedWith("Pausable: paused");
    await expect(
      swapContract.connect(acc2).buyToken1ForToken2(100)
    ).to.be.revertedWith("Pausable: paused");

    await swapContract.connect(adminAccount).unpause();

    await expect(swapContract.connect(acc1).buyToken2ForToken1(100)).not.to.be
      .reverted;
    await expect(swapContract.connect(acc2).buyToken1ForToken2(100)).not.to.be
      .reverted;
  });

  it("Should not change token1 for token2 if selling is disabled", async function () {
    const {
      swapContract,
      adminAccount,
      token1PoolAcc,
      token2PoolAcc,
      token1,
      token2,
      restSigners,
    } = await loadFixture(deployContractFixture);

    await swapContract.connect(adminAccount).disableSell();

    const [acc1, acc2] = restSigners;

    await token1.connect(token1PoolAcc).transfer(acc1.address, 1000);
    await token2.connect(token2PoolAcc).transfer(acc2.address, 1000);
    await token1.connect(acc1).approve(swapContract.address, 1000);
    await token2.connect(acc2).approve(swapContract.address, 1000);

    await expect(
      swapContract.connect(acc2).buyToken1ForToken2(100)
    ).to.be.revertedWith("Selling is not available");
    await expect(swapContract.connect(acc1).buyToken2ForToken1(100)).not.to.be
      .reverted;

    await swapContract.connect(adminAccount).enableSell();

    await expect(swapContract.connect(acc2).buyToken1ForToken2(100)).not.to.be
      .reverted;
    await expect(swapContract.connect(acc1).buyToken2ForToken1(100)).not.to.be
      .reverted;
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
      initialSupply,
      token1,
      token1PoolAcc,
      restSigners,
      swapRate,
    } = await loadFixture(deployContractFixture);

    expect(await swapContract.getReserveToken1()).to.be.eq(initialSupply);
    expect(await swapContract.getReserveToken2()).to.be.eq(initialSupply);

    const [acc1] = restSigners;

    await token1.connect(token1PoolAcc).transfer(acc1.address, 100);
    await token1.connect(acc1).approve(swapContract.address, 100);

    await expect(swapContract.connect(acc1).buyToken2ForToken1(50)).not.to.be
      .reverted;

    expect(await swapContract.getReserveToken1()).to.be.eq(initialSupply - 50);
    expect(await swapContract.getReserveToken2()).to.be.eq(
      initialSupply - (50 * 100) / swapRate
    );
  });

  it("Should change token 1 pool addresses only by admin", async function () {
    const {
      swapContract,
      adminAccount,
      initialSupply,
      token1,
      token2,
      token1PoolAcc,
      token2PoolAcc,
      restSigners,
    } = await loadFixture(deployContractFixture);

    const [acc1, acc2, newPool] = restSigners;

    await expect(swapContract.connect(acc1).setToken1Pool(newPool.address)).to
      .be.reverted;
    await expect(swapContract.connect(acc1).setToken2Pool(newPool.address)).to
      .be.reverted;

    expect(await swapContract.getReserveToken1()).to.be.eq(initialSupply);
    expect(await swapContract.getReserveToken2()).to.be.eq(initialSupply);
    token1.connect(token1PoolAcc).transfer(newPool.address, 1000);
    token2.connect(token2PoolAcc).transfer(newPool.address, 2000);

    const AdminRole = await swapContract.DEFAULT_ADMIN_ROLE();
    await swapContract.connect(adminAccount).grantRole(AdminRole, acc2.address);

    await expect(swapContract.connect(acc2).setToken1Pool(newPool.address)).not
      .to.be.reverted;
    await expect(swapContract.connect(acc2).setToken2Pool(newPool.address)).not
      .to.be.reverted;

    expect(await swapContract.getReserveToken1()).to.be.eq(1000);
    expect(await swapContract.getReserveToken2()).to.be.eq(2000);
  });
});
