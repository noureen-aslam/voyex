import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TripProvider } from './context/TripContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import TripWizard from './pages/TripWizard';
import Confirmation from './pages/Confirmation';
import Dashboard from './pages/Dashboard';
import Packages from './pages/Packages';
import Login from './pages/Login';
import Register from './pages/Register';
import MyTrips from './pages/MyTrips';
import Payment from './pages/Payment';

/**
 * App Component
 * Defines the primary routing structure and global context providers.
 */
function App() {
  return (
    <Router>
      <TripProvider>
        <div className="min-h-screen bg-dark-bg flex flex-col">
          {/* Persistent Navigation */}
          <Navbar />
          
          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Booking Flow */}
              <Route path="/plan" element={<TripWizard />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/payment" element={<Payment />} />

              {/* Protected/User Specific Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-trips" element={<MyTrips />} />
            </Routes>
          </main>
          
          {/* Persistent Footer */}
          <Footer />
        </div>
      </TripProvider>
    </Router>
  );
}

export default App;