import "dotenv/config";

export function node_url(networkName: string): string {
  if (networkName) {
    const uri = process.env["ETH_NODE_URI_" + networkName.toUpperCase()];
    if (uri && uri !== "") {
      return uri;
    }
  }

  let uri = process.env.ETH_NODE_URI;
  if (uri) {
    uri = uri.replace("{{networkName}}", networkName);
  }
  if (!uri || uri === "") {
    if (networkName === "localhost") {
      return "http://localhost:8545";
    }
    return "";
  }
  if (uri.indexOf("{{") >= 0) {
    throw new Error(
      `invalid uri or network not supported by node provider : ${uri}`
    );
  }
  return uri;
}

export function getMnemonic(networkName?: string): string {
  if (networkName) {
    const mnemonic = process.env["MNEMONIC_" + networkName.toUpperCase()];
    if (mnemonic && mnemonic !== "") {
      return mnemonic;
    }
  }

  const mnemonic = process.env.MNEMONIC;
  if (!mnemonic || mnemonic === "") {
    return "test test test test test test test test test test test junk";
  }
  return mnemonic;
}

export function accounts(networkName?: string) {
  if (networkName === "mumbai") {
    const {
      MUMBAI_PK_1,
      MUMBAI_PK_2,
      MUMBAI_PK_3,
      MUMBAI_PK_4,
      MUMBAI_PK_5,
      MUMBAI_PK_6,
    } = process.env;
    if (
      MUMBAI_PK_1 &&
      MUMBAI_PK_2 &&
      MUMBAI_PK_3 &&
      MUMBAI_PK_4 &&
      MUMBAI_PK_5 &&
      MUMBAI_PK_6
    ) {
      return [
        MUMBAI_PK_1,
        MUMBAI_PK_2,
        MUMBAI_PK_3,
        MUMBAI_PK_4,
        MUMBAI_PK_5,
        MUMBAI_PK_6,
      ];
    }
  }
  if (networkName === "mainnet") {
    const {
      POLYGON_PK_1,
      POLYGON_PK_2,
      POLYGON_PK_3,
      POLYGON_PK_4,
      POLYGON_PK_5,
      POLYGON_PK_6,
    } = process.env;
    if (
      POLYGON_PK_1 &&
      POLYGON_PK_2 &&
      POLYGON_PK_3 &&
      POLYGON_PK_4 &&
      POLYGON_PK_5 &&
      POLYGON_PK_6
    ) {
      return [
        POLYGON_PK_1,
        POLYGON_PK_2,
        POLYGON_PK_3,
        POLYGON_PK_4,
        POLYGON_PK_5,
        POLYGON_PK_6,
      ];
    }
  }
  return { mnemonic: getMnemonic(networkName) };
}
