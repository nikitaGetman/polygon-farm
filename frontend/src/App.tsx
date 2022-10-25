import React from 'react';
import { Header } from './components/Header/Header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/styles/index.scss';
import { Dashboard } from './components/Dashboard/Dashboard';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
