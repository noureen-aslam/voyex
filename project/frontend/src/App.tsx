import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TripProvider } from './context/TripContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TripWizard from './pages/TripWizard';
import Confirmation from './pages/Confirmation';
import Dashboard from './pages/Dashboard';
import Packages from './pages/Packages';
import Login from './pages/Login';
import Register from './pages/Register'; // Added Register import
import MyTrips from './pages/MyTrips';

function App() {
  return (
    <Router>
      <TripProvider>
        <div className="min-h-screen bg-dark-bg flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/plan" element={<TripWizard />} />
              <Route path="/confirmation" element={<Confirmation />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} /> {/* Added Register Route */}
              <Route path="/my-trips" element={<MyTrips />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </TripProvider>
    </Router>
  );
}

export default App;