import { Link } from 'react-router-dom';
import { Plane, Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-card/50 border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
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
            <p className="text-gray-400 text-sm">
              Your journey, simplified. Experience door-to-door travel with zero stress.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-brand-cyan transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-cyan transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-cyan transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/plan" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">
                  Plan Trip
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">
                  Packages
                </Link>
              </li>
              <li>
                <Link to="/my-trips" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">
                  My Trips
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-brand-cyan transition-colors text-sm">
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4" />
                <span>support@voyex.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 VOYEX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
