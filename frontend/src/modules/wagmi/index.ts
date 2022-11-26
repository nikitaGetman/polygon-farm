import { createClient, configureChains, chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

window.Buffer = require('buffer/').Buffer;

const { chains, provider, webSocketProvider } = configureChains(
  process.env.NODE_ENV === 'production'
    ? [chain.polygonMumbai, chain.polygon]
    : [chain.hardhat, chain.polygonMumbai, chain.polygon],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }),
    publicProvider(),
    jsonRpcProvider({
      rpc: () => ({
        http: process.env.REACT_APP_PUBLIC_RPC_URL || 'http://localhost:8545',
      }),
    }),
  ],
  {
    pollingInterval: 4_000, // default
  }
);

export const metamaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: true,
    UNSTABLE_shimOnConnectSelectAccount: true,
  },
});

export const walletConnector = new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
  },
});

const client = createClient({
  // autoConnect: false,
  autoConnect: process.env.NODE_ENV !== 'production',
  connectors: [metamaskConnector, walletConnector],
  provider,
  webSocketProvider,
});

export { client, chains };
