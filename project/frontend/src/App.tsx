import React from 'react'; // Add this line to fix the UMD global error
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
import MyTrips from './pages/MyTrips';

function App() {
  return (
    <Router>
      <TripProvider>
        <div className="min-h-screen bg-dark-bg">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/plan" element={<TripWizard />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/login" element={<Login />} />
            <Route path="/my-trips" element={<MyTrips />} />
          </Routes>
          <Footer />
        </div>
      </TripProvider>
    </Router>
  );
}

export default App;