import { task } from "hardhat/config";

import fs from "fs";

task("export-accounts", "Export accounts addresses to front config").setAction(
  async (taskArgs, { ethers, getNamedAccounts, network }) => {
    const accounts = await getNamedAccounts();

    const accountsData = JSON.stringify(accounts);

    fs.writeFileSync(
      `./frontend/src/config/accounts_${network.name}.json`,
      accountsData,
      "utf8"
    );
  }
);
