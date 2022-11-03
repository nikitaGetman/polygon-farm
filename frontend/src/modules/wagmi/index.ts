import { createClient, configureChains, chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
// import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const { chains, provider, webSocketProvider } = configureChains(
  [chain.hardhat, chain.polygonMumbai, chain.polygon],
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

const metamaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: true,
    UNSTABLE_shimOnConnectSelectAccount: true,
  },
});

const walletConnector = new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
  },
});

const client = createClient({
  autoConnect: true,
  connectors: [metamaskConnector, walletConnector],
  provider,
  webSocketProvider,
});

export { client, chains };
