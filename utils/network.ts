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
    return [
      "38c588fb0dae63e84445fe37e9d8572bb09fa1f87b95f9d2dd02661c9a1240f5",
      "1e557d91bcdb11b09f77aa1665117e45f9d301938f7e3913c093e64785018af7",
      "9a09aeab407914f2ba57b22ff1e3c7d9ea2dc717d4f7cd6dab46cacd77cef5cf",
    ];
  }
  return { mnemonic: getMnemonic(networkName) };
}
