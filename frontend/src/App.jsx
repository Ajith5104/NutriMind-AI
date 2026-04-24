import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastProvider';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import DietDashboard from './pages/DietDashboard';
import Calculators from './pages/Calculators';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Navbar />
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<DietDashboard />} />
            <Route path="/calculators" element={<Calculators />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
