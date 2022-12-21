import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { WagmiConfig } from 'wagmi';

import { Modals } from '@/components/Modals';
import { AppStateProvider } from '@/contexts/AppContext';
import { theme } from '@/modules/chakra';
import { queryClient } from '@/modules/query';
import { client } from '@/modules/wagmi';

import { router } from './router';

import '@/assets/styles/index.scss';

function App() {
  return (
    <WagmiConfig client={client}>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AppStateProvider>
            <div className="background" />

            <Flex position="relative" minHeight="100vh" direction="column">
              <RouterProvider router={router} />
            </Flex>

            <Modals />
          </AppStateProvider>

          <ReactQueryDevtools />
        </QueryClientProvider>
      </ChakraProvider>
    </WagmiConfig>
  );
}

export default App;
