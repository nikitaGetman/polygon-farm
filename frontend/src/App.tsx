import React, { createRef, useCallback, useEffect } from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import {
  useLocation,
  createBrowserRouter,
  useOutlet,
  RouterProvider,
  Navigate,
  useSearchParams,
} from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { Header } from '@/components/Header/Header';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { theme } from '@/modules/chakra';
import { client } from '@/modules/wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/modules/query';
import { StakingPage } from '@/components/Staking/StakingPage';
import { AppStateProvider } from '@/contexts/AppContext';
import { Modals } from '@/components/Modals';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { SquadsPage } from './components/Squads/SquadsPage';
import { REFERRER_SEARCH_PARAMS_KEY, useLocalReferrer } from './hooks/useLocalReferrer';

import '@/assets/styles/index.scss';

const routes = [
  { path: '/', name: 'Dashboard', element: <Dashboard />, nodeRef: createRef() },
  { path: '/staking', name: 'Staking', element: <StakingPage />, nodeRef: createRef() },
  { path: '/team', name: 'Squads', element: <SquadsPage />, nodeRef: createRef() },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: routes.map((route) => ({
      index: route.path === '/',
      path: route.path === '/' ? undefined : route.path,
      element: route.element,
    })),
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);

function Layout() {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const { nodeRef } = routes.find((route) => route.path === location.pathname) ?? {};

  const scrollToTop = useCallback(() => {
    window?.scroll(0, 0);
  }, []);

  const { localReferrer, setLocalReferrer } = useLocalReferrer();
  const [searchParams] = useSearchParams();
  const queryRef = searchParams.get(REFERRER_SEARCH_PARAMS_KEY);
  useEffect(() => {
    if (queryRef && localReferrer !== queryRef) {
      setLocalReferrer(queryRef);
    }
  }, [queryRef, localReferrer, setLocalReferrer]);

  return (
    <>
      <Header />
      <SwitchTransition>
        <CSSTransition
          key={location.pathname}
          nodeRef={nodeRef as any}
          timeout={250}
          classNames="route-transition"
          onEntering={scrollToTop}
          unmountOnExit
          in
          appear
        >
          {(state) => <Box ref={nodeRef as any}>{currentOutlet}</Box>}
        </CSSTransition>
      </SwitchTransition>
    </>
  );
}

function App() {
  return (
    <WagmiConfig client={client}>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AppStateProvider>
            <div className="background" />

            <Box position="relative">
              <RouterProvider router={router} />
            </Box>

            <Modals />
          </AppStateProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </WagmiConfig>
  );
}

export default App;
