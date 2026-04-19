import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Plane, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useTripContext } from '../context/TripContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useTripContext();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Plan Trip', path: '/plan' },
    { name: 'Packages', path: '/packages' },
    { name: 'My Trips', path: '/my-trips' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-indigo to-brand-cyan flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold font-syne bg-gradient-to-r from-brand-indigo to-brand-cyan bg-clip-text text-transparent">
                VOYEX
              </div>
              <div className="text-[10px] text-gray-400 -mt-1">Door to Door</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-brand-indigo to-brand-cyan text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center ml-4 gap-4">
                <div className="flex items-center text-gray-300 text-sm bg-white/5 px-3 py-2 rounded-lg">
                  <User className="w-4 h-4 mr-2 text-brand-cyan" />
                  {user?.fullName.split(' ')[0]}
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-6 py-2 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-semibold hover:shadow-lg hover:shadow-brand-indigo/50 transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-300 hover:bg-white/5"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;