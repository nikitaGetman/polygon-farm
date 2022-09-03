import * as dotenv from "dotenv";
import { task, types } from "hardhat/config";

dotenv.config();

task("create-vesting", "Create vesting schedule for account")
  .addParam("beneficiary", "Beneficiary address")
  .addParam("start", "Start time (seconds)")
  .addParam("duration", "Duration period (seconds)")
  .addParam("amount", "Vesting amount")
  .addOptionalParam("cliff", "Cliff period (seconds)", 0, types.int)
  .addOptionalParam("slicePeriod", "Slice period (seconds)", 1, types.int)
  .addOptionalParam(
    "revocable",
    "Is vesting schedule revokable by admin",
    false,
    types.boolean
  )
  .setAction(async (args) => {
    console.log(args);
  });
