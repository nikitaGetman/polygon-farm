import { task } from "hardhat/config";

task("balance", "Test balance")
  .addParam("account", "Account address")
  .setAction(async (args) => {
    console.log(args);
  });
