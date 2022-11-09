import { useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export const useConnectWallet = () => {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  return { connect };
};
