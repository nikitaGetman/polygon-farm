import React, { createRef, useCallback, useEffect } from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation,
  useOutlet,
  useSearchParams,
} from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { WagmiConfig } from 'wagmi';

import { Dashboard } from '@/components/Dashboard/Dashboard';
import { ExchangePage } from '@/components/Exchange/ExchangePage';
import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import { Modals } from '@/components/Modals';
import { StakingPage } from '@/components/Staking/StakingPage';
import { AppStateProvider } from '@/contexts/AppContext';
import { theme } from '@/modules/chakra';
import { queryClient } from '@/modules/query';
import { client } from '@/modules/wagmi';

import { LotteryPage } from './components/Lottery/LotteryPage';
import { SquadsPage } from './components/Squads/SquadsPage';
import { REFERRER_SEARCH_PARAMS_KEY, useLocalReferrer } from './hooks/useLocalReferrer';

import '@/assets/styles/index.scss';

const isLanding = process.env.REACT_APP_IS_LANDING;
const Landing = React.lazy(() => import('@/components/Landing/Landing'));

const LANDING_PATH = '/';
const landingRoute = {
  path: LANDING_PATH,
  name: 'Landing',
  element: <Landing />,
  nodeRef: createRef(),
};
const appRoutes = [
  { path: '/', name: 'Dashboard', element: <Dashboard />, nodeRef: createRef() },
  { path: '/staking', name: 'Staking', element: <StakingPage />, nodeRef: createRef() },
  { path: '/team', name: 'Squads', element: <SquadsPage />, nodeRef: createRef() },
  { path: '/exchange', name: 'Exchange', element: <ExchangePage />, nodeRef: createRef() },
  { path: '/raffle/:id', name: 'Raffle', element: <LotteryPage />, nodeRef: createRef() },
];

const routes = isLanding ? [landingRoute] : appRoutes;

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
  const { nodeRef } =
    routes.find((route) =>
      // TODO: Hack for '/raffle/:id' route
      route.path.includes(location.pathname.split('/')[1])
    ) ?? {};

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

  const isLandingPath = Boolean(isLanding && location.pathname === LANDING_PATH);

  return (
    <>
      <Header isLandingView={isLandingPath} />
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
          {(state) => (
            <Box ref={nodeRef as any}>
              {currentOutlet}
              <Footer />
            </Box>
          )}
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

          <ReactQueryDevtools />
        </QueryClientProvider>
      </ChakraProvider>
    </WagmiConfig>
  );
}

export default App;
