import {
  loadFixture,
  time,
  mine,
} from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { TokenVesting__factory } from "typechain-types";
import { grantAdminRole } from "./helpers";
import { deployToken1 } from "./helpers/deployments";

describe("TokenVesting", function () {
  async function deployFixture() {
    const [adminAccount, vestingPool, ...restSigners] =
      await ethers.getSigners();

    const initialSupply = 1_000_000_000_000;

    const token = await deployToken1({
      admin: adminAccount,
      initialSupply,
      initialHolder: vestingPool.address,
    });

    const vesting = await new TokenVesting__factory(adminAccount).deploy(
      token.address,
      vestingPool.address
    );
    await vesting.deployed();

    await token
      .connect(vestingPool)
      .approve(vesting.address, ethers.constants.MaxUint256);

    return {
      adminAccount,
      vestingPool,
      token,
      vesting,
      initialSupply,
      restSigners,
    };
  }

  // Roles / Administration
  // Helpers
  // Events

  describe("Deploy", () => {
    it("Should assign the total supply of tokens to the vesting pool", async function () {
      const { vestingPool, token, vesting, adminAccount } = await loadFixture(
        deployFixture
      );
      const vestingPoolBalance = await token.balanceOf(vestingPool.address);
      expect(await token.totalSupply()).to.equal(vestingPoolBalance);
      expect(await vesting.getToken()).to.equal(token.address);

      const AdminRole = await vesting.DEFAULT_ADMIN_ROLE();
      expect(await vesting.hasRole(AdminRole, adminAccount.address)).to.equal(
        true
      );
    });

    it("Should not deploy with incorrect params", async function () {
      const { restSigners } = await loadFixture(deployFixture);

      const [acc1, acc2] = restSigners;

      await expect(
        new TokenVesting__factory(acc1).deploy(
          ethers.constants.AddressZero,
          acc2.address
        )
      ).to.be.reverted;

      await expect(
        new TokenVesting__factory(acc1).deploy(
          acc2.address,
          ethers.constants.AddressZero
        )
      ).to.be.reverted;
    });
  });

  describe("Vesting", () => {
    it("Should vest tokens gradually", async function () {
      const {
        vestingPool,
        adminAccount,
        token,
        vesting,
        restSigners,
        initialSupply,
      } = await loadFixture(deployFixture);

      const [acc1, acc2, acc3] = restSigners;
      const baseTime = await time.latest();
      const beneficiary = acc1;
      const startTime = baseTime;
      const cliff = 0;
      const duration = 1000;
      const slicePeriodSeconds = 1;
      const revokable = true;
      const amount = 100;

      // create new vesting schedule
      await vesting
        .connect(adminAccount)
        .createVestingSchedule(
          beneficiary.address,
          startTime,
          cliff,
          duration,
          slicePeriodSeconds,
          revokable,
          amount
        );

      expect(await vesting.getVestingSchedulesCount()).to.equal(1);
      expect(
        await vesting.getVestingSchedulesCountByBeneficiary(beneficiary.address)
      ).to.equal(1);
      expect(await token.balanceOf(vestingPool.address)).to.equal(
        initialSupply - amount
      );
      expect(await token.balanceOf(vesting.address)).to.equal(amount);

      // compute vesting schedule id
      const vestingScheduleId =
        await vesting.computeVestingScheduleIdForAddressAndIndex(
          beneficiary.address,
          0
        );

      // check that vested amount is 0
      expect(
        await vesting
          .connect(beneficiary)
          .computeReleasableAmount(vestingScheduleId)
      ).to.equal(0);

      // set time to half the vesting period
      const halfTime = baseTime + duration / 2;
      await time.setNextBlockTimestamp(halfTime);
      await mine();

      // check that vested amount is half the total amount to vest
      expect(
        await vesting
          .connect(beneficiary)
          .computeReleasableAmount(vestingScheduleId)
      ).to.equal(amount / 2);

      // check that only beneficiary can try to release vested tokens
      await expect(
        vesting.connect(acc2).release(vestingScheduleId, amount)
      ).to.be.revertedWith(
        "TokenVesting: only beneficiary and admin can release vested tokens"
      );

      // check that beneficiary cannot release more than the vested amount
      await expect(
        vesting.connect(beneficiary).release(vestingScheduleId, amount)
      ).to.be.revertedWith(
        "TokenVesting: cannot release tokens, not enough vested tokens"
      );

      // release 10 tokens and check that a Transfer event is emitted with a value of 10
      await expect(vesting.connect(beneficiary).release(vestingScheduleId, 10))
        .to.emit(token, "Transfer")
        .withArgs(vesting.address, beneficiary.address, 10);

      // check that the vested amount is now 40
      expect(
        await vesting
          .connect(beneficiary)
          .computeReleasableAmount(vestingScheduleId)
      ).to.equal(40);
      let vestingSchedule = await vesting.getVestingSchedule(vestingScheduleId);

      // check that the released amount is 10
      expect(vestingSchedule.released).to.equal(10);

      // set current time after the end of the vesting period
      await time.setNextBlockTimestamp(baseTime + duration + 1);
      await mine();

      // check that the vested amount is 90
      expect(
        await vesting
          .connect(beneficiary)
          .computeReleasableAmount(vestingScheduleId)
      ).to.equal(90);

      // beneficiary release vested tokens (45)
      await expect(vesting.connect(beneficiary).release(vestingScheduleId, 45))
        .to.emit(token, "Transfer")
        .withArgs(vesting.address, beneficiary.address, 45);

      // not admin release vested tokens (45)
      await expect(
        vesting.connect(acc2).release(vestingScheduleId, 45)
      ).to.be.revertedWith(
        "TokenVesting: only beneficiary and admin can release vested tokens"
      );

      // grant admin role
      await grantAdminRole(vesting, adminAccount, acc3);

      // admin release vested tokens (45)
      await expect(vesting.connect(acc3).release(vestingScheduleId, 45))
        .to.emit(vesting, "Released")
        .withArgs(beneficiary.address, 45);

      // check that the number of released tokens is 100
      vestingSchedule = await vesting.getVestingSchedule(vestingScheduleId);
      expect(vestingSchedule.released).to.equal(100);

      // check that the vested amount is 0
      expect(
        await vesting
          .connect(beneficiary)
          .computeReleasableAmount(vestingScheduleId)
      ).to.equal(0);

      // check that anyone cannot revoke a vesting
      await expect(vesting.connect(acc2).revoke(vestingScheduleId)).to.be
        .reverted;
      await expect(vesting.connect(adminAccount).revoke(vestingScheduleId))
        .to.emit(vesting, "Revoked")
        .withArgs(vestingScheduleId);

      /*
       * TEST SUMMARY
       * deploy vesting contract
       * send tokens to vesting contract
       * create new vesting schedule (100 tokens)
       * check that vested amount is 0
       * set time to half the vesting period
       * check that vested amount is half the total amount to vest (50 tokens)
       * check that only beneficiary can try to release vested tokens
       * check that beneficiary cannot release more than the vested amount
       * release 10 tokens and check that a Transfer event is emitted with a value of 10
       * check that the released amount is 10
       * check that the vested amount is now 40
       * set current time after the end of the vesting period
       * check that the vested amount is 90 (100 - 10 released tokens)
       * release all vested tokens (90)
       * check that the number of released tokens is 100
       * check that the vested amount is 0
       * check that anyone cannot revoke a vesting
       */
    });

    it("Should release vested tokens if revoked", async function () {
      const { vestingPool, adminAccount, token, vesting, restSigners } =
        await loadFixture(deployFixture);

      const [acc1] = restSigners;
      const baseTime = await time.latest();
      const beneficiary = acc1;
      const startTime = baseTime;
      const cliff = 0;
      const duration = 1000;
      const slicePeriodSeconds = 1;
      const revokable = true;
      const amount = 100;

      // create new vesting schedule
      await vesting
        .connect(adminAccount)
        .createVestingSchedule(
          beneficiary.address,
          startTime,
          cliff,
          duration,
          slicePeriodSeconds,
          revokable,
          amount
        );

      // compute vesting schedule id
      const vestingScheduleId =
        await vesting.computeVestingScheduleIdForAddressAndIndex(
          beneficiary.address,
          0
        );

      // set time to half the vesting period
      const halfTime = baseTime + duration / 2;
      await time.setNextBlockTimestamp(halfTime);
      await mine();

      await expect(vesting.connect(adminAccount).revoke(vestingScheduleId))
        .to.emit(token, "Transfer")
        .withArgs(vesting.address, beneficiary.address, 50)
        .to.emit(token, "Transfer")
        .withArgs(vesting.address, vestingPool.address, 50);

      const vestingSchedule = await vesting.getVestingSchedule(
        vestingScheduleId
      );
      expect(vestingSchedule.revoked).to.equal(true);

      // set time to end of the vesting period
      await time.setNextBlockTimestamp(baseTime + duration + 1);
      await mine();

      // try to release rest tokens
      await expect(vesting.connect(beneficiary).release(vestingScheduleId, 50))
        .to.be.reverted;
    });

    it("Should release vested tokens by slice periods with cliff", async function () {
      const { adminAccount, vesting, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1] = restSigners;
      const baseTime = await time.latest();
      const beneficiary = acc1;
      const startTime = baseTime;
      const cliff = 300;
      const duration = 700;
      const slicePeriodSeconds = 100;
      const revokable = true;
      const amount = 700;

      // create new vesting schedule
      await vesting
        .connect(adminAccount)
        .createVestingSchedule(
          beneficiary.address,
          startTime,
          cliff,
          duration,
          slicePeriodSeconds,
          revokable,
          amount
        );

      // compute vesting schedule id
      const vestingScheduleId =
        await vesting.computeVestingScheduleIdForAddressAndIndex(
          beneficiary.address,
          0
        );

      // set time to cliff period
      const cliffTime = startTime + cliff - 1;
      await time.setNextBlockTimestamp(cliffTime);
      await mine();

      expect(
        await vesting
          .connect(beneficiary)
          .computeReleasableAmount(vestingScheduleId)
      ).to.equal(0);

      // set time after cliff, before first slice
      const beforeFirstSliceTime = startTime + cliff + slicePeriodSeconds / 2;
      await time.setNextBlockTimestamp(beforeFirstSliceTime);
      await mine();

      expect(
        await vesting
          .connect(beneficiary)
          .computeReleasableAmount(vestingScheduleId)
      ).to.equal(0);

      // set time after first slice
      const afterFirstSliceTime = startTime + cliff + slicePeriodSeconds * 1.5;
      await time.setNextBlockTimestamp(afterFirstSliceTime);
      await mine();

      expect(
        await vesting
          .connect(beneficiary)
          .computeReleasableAmount(vestingScheduleId)
      ).to.equal(100);

      // set time before last slice
      const beforeLastSliceTime = startTime + cliff + slicePeriodSeconds * 6.5;
      await time.setNextBlockTimestamp(beforeLastSliceTime);
      await mine();

      expect(
        await vesting
          .connect(beneficiary)
          .computeReleasableAmount(vestingScheduleId)
      ).to.equal(600);

      // set time after last slice
      const afterLastSliceTime = startTime + cliff + slicePeriodSeconds * 7.5;
      await time.setNextBlockTimestamp(afterLastSliceTime);
      await mine();

      expect(
        await vesting
          .connect(beneficiary)
          .computeReleasableAmount(vestingScheduleId)
      ).to.equal(700);
    });

    it("Should compute vesting schedule index", async function () {
      const { vesting, restSigners } = await loadFixture(deployFixture);

      const [acc1] = restSigners;
      const expectedVestingScheduleId = ethers.utils.solidityKeccak256(
        ["address", "uint256"],
        [acc1.address, 0]
      );

      expect(
        (
          await vesting.computeVestingScheduleIdForAddressAndIndex(
            acc1.address,
            0
          )
        ).toString()
      ).to.equal(expectedVestingScheduleId);
      expect(
        (
          await vesting.computeNextVestingScheduleIdForHolder(acc1.address)
        ).toString()
      ).to.equal(expectedVestingScheduleId);
    });

    it("Should check input parameters for createVestingSchedule method", async function () {
      const { vesting, restSigners } = await loadFixture(deployFixture);

      const [acc1] = restSigners;
      const startTime = (await time.latest()) + 100;

      await expect(
        vesting.createVestingSchedule(
          acc1.address,
          startTime,
          0,
          0,
          1,
          false,
          1
        )
      ).to.be.revertedWith("TokenVesting: duration must be > 0");
      await expect(
        vesting.createVestingSchedule(
          acc1.address,
          startTime,
          0,
          1,
          0,
          false,
          1
        )
      ).to.be.revertedWith("TokenVesting: slicePeriodSeconds must be >= 1");
      await expect(
        vesting.createVestingSchedule(
          acc1.address,
          startTime,
          0,
          1,
          1,
          false,
          0
        )
      ).to.be.revertedWith("TokenVesting: amount must be > 0");
    });

    it("Should check reserve balance on creating schedule", async function () {
      const {
        adminAccount,
        vesting,
        token,
        vestingPool,
        initialSupply,
        restSigners,
      } = await loadFixture(deployFixture);

      const [acc1] = restSigners;
      const startTime = await time.latest();

      await token.connect(vestingPool).burn(initialSupply - 100);

      await expect(
        vesting
          .connect(adminAccount)
          .createVestingSchedule(acc1.address, startTime, 0, 100, 1, false, 101)
      ).to.be.revertedWith(
        "TokenVesting: cannot create vesting schedule because not sufficient tokens"
      );

      await expect(
        vesting
          .connect(adminAccount)
          .createVestingSchedule(acc1.address, startTime, 0, 100, 1, false, 100)
      ).not.to.be.reverted;
    });

    it("Should not revoke not revokable or non-existent schedules", async () => {
      const { adminAccount, vesting, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, acc2] = restSigners;
      const baseTime = await time.latest();
      const startTime = baseTime;
      const cliff = 0;
      const duration = 1000;
      const slicePeriodSeconds = 1;
      const revokable = false;
      const amount = 100;

      await vesting
        .connect(adminAccount)
        .createVestingSchedule(
          acc1.address,
          startTime,
          cliff,
          duration,
          slicePeriodSeconds,
          revokable,
          amount
        );

      // set time to half of vesting period
      const halfTime = startTime + duration / 2;
      await time.setNextBlockTimestamp(halfTime);
      await mine();

      await expect(vesting.getLastVestingScheduleForHolder(acc2.address)).to.be
        .reverted;

      const incorrectVestingId =
        await vesting.computeVestingScheduleIdForAddressAndIndex(
          acc2.address,
          1
        );

      await expect(vesting.connect(adminAccount).revoke(incorrectVestingId)).to
        .be.reverted;

      const correctVestingId =
        await vesting.computeVestingScheduleIdForAddressAndIndex(
          acc1.address,
          0
        );
      await expect(vesting.connect(acc2).revoke(correctVestingId)).to.be
        .reverted;

      await expect(
        vesting.connect(adminAccount).revoke(correctVestingId)
      ).to.be.revertedWith("TokenVesting: vesting is not revocable");
    });
  });

  describe("Helpers", () => {
    it("Should update total vesting schedules amount and holders vesting count on new vesting", async () => {
      const { adminAccount, vesting, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, acc2] = restSigners;
      const baseTime = await time.latest();
      const startTime = baseTime;
      const cliff = 0;
      const duration = 1000;
      const slicePeriodSeconds = 1;
      const revokable = true;

      // create new vesting schedule 1
      await vesting
        .connect(adminAccount)
        .createVestingSchedule(
          acc1.address,
          startTime,
          cliff,
          duration,
          slicePeriodSeconds,
          revokable,
          100
        );

      // create new vesting schedule 2
      await vesting
        .connect(adminAccount)
        .createVestingSchedule(
          acc1.address,
          startTime,
          cliff,
          duration,
          slicePeriodSeconds,
          revokable,
          200
        );

      // create new vesting schedule 3
      await vesting
        .connect(adminAccount)
        .createVestingSchedule(
          acc2.address,
          startTime,
          cliff,
          duration,
          slicePeriodSeconds,
          revokable,
          500
        );

      expect(await vesting.getVestingSchedulesCount()).to.equal(3);
      expect(await vesting.getVestingSchedulesTotalAmount()).to.equal(800);
      expect(
        await vesting.getVestingSchedulesCountByBeneficiary(acc1.address)
      ).to.equal(2);
      expect(
        await vesting.getVestingSchedulesCountByBeneficiary(acc2.address)
      ).to.equal(1);

      const lastSchedule = await vesting.getLastVestingScheduleForHolder(
        acc1.address
      );
      const secondSchedule = await vesting.getVestingScheduleByAddressAndIndex(
        acc1.address,
        1
      );

      expect(lastSchedule.amountTotal).to.equal(secondSchedule.amountTotal);

      await expect(vesting.getVestingIdAtIndex(3)).to.be.revertedWith(
        "TokenVesting: index out of bounds"
      );
      const vestingId = await vesting.getVestingIdAtIndex(2);
      const lastId = await vesting.computeVestingScheduleIdForAddressAndIndex(
        acc2.address,
        0
      );
      expect(vestingId).to.equal(lastId);
    });
  });

  describe("Roles / Administration", () => {
    it("Should update vesting pool only by Admin", async () => {
      const { vesting, adminAccount, restSigners } = await loadFixture(
        deployFixture
      );

      const [acc1, newPoolAcc] = restSigners;

      await expect(
        vesting
          .connect(adminAccount)
          .updateVestingPool(ethers.constants.AddressZero)
      ).to.be.revertedWith("TokenVesting: pool can not be zero address");

      await expect(vesting.connect(acc1).updateVestingPool(newPoolAcc.address))
        .to.be.reverted;

      await grantAdminRole(vesting, adminAccount, acc1);

      await expect(vesting.connect(acc1).updateVestingPool(newPoolAcc.address))
        .not.to.be.reverted;

      expect(await vesting.getReservesBalance()).to.eq(0);
    });
  });
});
