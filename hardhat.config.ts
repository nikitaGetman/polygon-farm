import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-deploy";
import "tsconfig-paths/register";
import "./tasks";
import { node_url, accounts } from "utils/network";

dotenv.config();

const config: HardhatUserConfig = {
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
      tags: ["local"],
      mining: {
        auto: true,
        interval: [3000, 6000],
      },
    },
    hardhat: {
      tags: ["test", "local"],
      mining: {
        auto: true,
        interval: [3000, 6000],
      },
    },
    mumbai: {
      url: node_url("mumbai"),
      accounts: accounts("mumbai"),
      tags: ["staging"],
      verify: {
        etherscan: {
          apiUrl: "https://api-testnet.polygonscan.com",
          apiKey: process.env.ETHERSCAN_KEY_MUMBAI || "",
        },
      },
    },
    mainnet: {
      url: node_url("mainnet"),
      accounts: accounts("mainnet"),
      tags: ["production"],
      verify: {
        etherscan: {
          apiUrl: "https://api.polygonscan.com",
          apiKey: process.env.ETHERSCAN_KEY_MAINNET || "",
        },
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      mumbai: 0,
      mainnet: 0,
    },
    admin: 0,
    token1Holder: 1,
    token2Holder: 1,
    // TODO: the same on development
    stakingPool: 2,
    vestingPool: 2,
    vendorPool: 2,
    vendorChangePool: 2,
    referralRewardPool: 2,
  },
  etherscan: {
    apiKey: {
      mumbai: process.env.ETHERSCAN_KEY_MUMBAI || "",
      mainnet: process.env.ETHERSCAN_KEY_MAINNET || "",
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
  mocha: {
    timeout: 100000000,
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    coinmarketcap: process.env.COIN_MARKET_CAP_KEY,
    currency: "USD",
  },
};

export default config;
