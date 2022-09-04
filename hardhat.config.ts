import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "./tasks";

import "tsconfig-paths/register";
import "hardhat-deploy";

dotenv.config();

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  defaultNetwork: "localhost",
  solidity: {
    version: "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ["local"],
    },
    hardhat: {
      live: false,
      saveDeployments: true,
      tags: ["test", "local"],
    },
    mumbai: {
      url: process.env.MUMBAI_RPC_URL,
      accounts,
      tags: ["staging"],
    },
    // mainnet: {
    //   tags: ["production"],
    // },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      mumbai: "",
      mainnet: "",
    },
    admin: 0,
    token1Holder: 1,
    token2Holder: 1,
    // TODO: the same on development
    stakingPool: 3,
    vestingPool: 3,
    vendorPool: 3,
    vendorChangePool: 3,
    vestingBeneficiary: 5,
  },
  etherscan: {
    apiKey: {
      mumbai: process.env.MUMBAI_ETHERSCAN_KEY || "",
    },
    customChains: [
      {
        network: "mumbai",
        chainId: 80001,
        urls: {
          apiURL: "https://api-testnet.polygonscan.com/api",
          browserURL: "https://mumbai.polygonscan.com/",
        },
      },
    ],
  },
  gasReporter: {
    enabled: !!process.env.REPORT_GAS,
    coinmarketcap: process.env.COIN_MARKET_CAP_KEY,
    currency: "USD",
  },
};

export default config;
