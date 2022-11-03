import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiConfig } from 'wagmi';
import { Header } from '@/components/Header/Header';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { theme } from '@/modules/chakra';
import { client } from '@/modules/wagmi';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './modules/query';

import '@/assets/styles/index.scss';

function App() {
  return (
    <div className="App">
      <WagmiConfig client={client}>
        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <Header />
              <Routes>
                <Route path="/" element={<Dashboard />} />
              </Routes>
            </Router>
          </QueryClientProvider>
        </ChakraProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
