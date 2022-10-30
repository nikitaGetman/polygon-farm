import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header/Header';
import { Dashboard } from '@/components/Dashboard/Dashboard';
import { theme } from '@/modules/chakra';

import '@/assets/styles/index.scss';

function App() {
  return (
    <div className="App">
      <ChakraProvider theme={theme}>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Router>
      </ChakraProvider>
    </div>
  );
}

export default App;
