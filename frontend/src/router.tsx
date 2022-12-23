import React, { createRef } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Dashboard } from './components/Dashboard/Dashboard';
import { ExchangePage } from './components/Exchange/ExchangePage';
import { Layout } from './components/Layout/Layout';
import { LotteryPage } from './components/Lottery/LotteryPage';
import { SquadsPage } from './components/Squads/SquadsPage';
import { StakingPage } from './components/Staking/StakingPage';

const Landing = React.lazy(() => import('@/components/Landing/Landing'));

export const LANDING_URL = 'https://isaver.io';
export const APP_URL = 'https://dashboard.isaver.io';
export const WHITEPAPER_URL = 'https://isaver.gitbook.io/isaver';
export const isLanding = process.env.REACT_APP_IS_LANDING;
export const isDevelopment = process.env.NODE_ENV === 'development';

export const LANDING_PATH = '/';
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
  { path: '/raffles/:id', name: 'Raffle', element: <LotteryPage />, nodeRef: createRef() },
];

export const routes = isLanding
  ? [landingRoute]
  : isDevelopment
  ? [...appRoutes, { ...landingRoute, path: '/landing' }]
  : appRoutes;

export const router = createBrowserRouter([
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
