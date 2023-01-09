import { configureChains, createClient } from 'wagmi';
import { hardhat, polygon, polygonMumbai } from 'wagmi/chains';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

window.Buffer = require('buffer/').Buffer;

const { chains, provider, webSocketProvider } = configureChains(
  process.env.NODE_ENV === 'production' ? [polygon] : [hardhat, polygonMumbai, polygon],
  [
    alchemyProvider({
      apiKey: process.env.REACT_APP_ALCHEMY_KEY || '',
    }),
    publicProvider(),
    // jsonRpcProvider({
    //   rpc: () => ({
    //     http: process.env.REACT_APP_PUBLIC_RPC_URL || 'http://localhost:8545',
    //   }),
    // }),
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
  autoConnect: true,
  // autoConnect: process.env.NODE_ENV !== 'production',
  connectors: [metamaskConnector, walletConnector],
  provider,
  webSocketProvider,
});

export { chains, client };
