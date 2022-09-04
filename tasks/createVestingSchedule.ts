import { task, types } from "hardhat/config";
import type { TokenVesting } from "../typechain-types";

task("create-vesting", "Create vesting schedule for account")
  .addParam("beneficiary", "Beneficiary address")
  .addParam("duration", "Duration period (seconds)")
  .addParam("amount", "Vesting amount")
  .addOptionalParam("start", "Start time (seconds)", 0, types.int)
  .addOptionalParam("cliff", "Cliff period (seconds)", 0, types.int)
  .addOptionalParam("slicePeriod", "Slice period (seconds)", 1, types.int)
  .addOptionalParam(
    "revocable",
    "Is vesting revokable by admin?",
    false,
    types.boolean
  )
  .addOptionalParam("account", "Admin account name", "admin", types.string)
  .setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
    const accountAddr = (await getNamedAccounts())[taskArgs.account];
    const account = await ethers.getSigner(accountAddr);

    const vesting = await ethers.getContract<TokenVesting>(
      "TokenVesting",
      account
    );

    const vestingId = await vesting.computeNextVestingScheduleIdForHolder(
      taskArgs.beneficiary
    );
    const tx = await vesting.createVestingSchedule(
      taskArgs.beneficiary,
      taskArgs.start,
      taskArgs.cliff,
      taskArgs.duration,
      taskArgs.slicePeriod,
      taskArgs.revocable,
      taskArgs.amount
    );
    await tx.wait();

    console.log(
      `Vesting schedule created with id: "${vestingId}". Transaction: "${tx.hash}"`
    );
  });
