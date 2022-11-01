import { createClient, configureChains, chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
// import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const { chains, provider, webSocketProvider } = configureChains(
  [chain.polygon, chain.polygonMumbai, chain.localhost],
  [alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }), publicProvider()],
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

export { client };
