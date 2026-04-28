import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Plane } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { login } from '../lib/api';
import { useTripContext } from '../context/TripContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useTripContext();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | JSX.Element>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await login(email, password);
      
      // Verification: Ensure the backend actually sent a success flag and a token
      if (response.success && response.token) {
        
        // 1. CRITICAL: Save the token immediately. 
        // This stops the "Session Expired" redirect on the next page.
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        
        // 2. Save user data to your Global Context (Context + LocalStorage)
        loginUser(response.user); 
        
        // 3. Small delay to ensure storage is written before jumping pages
        setTimeout(() => {
          navigate('/my-trips');
        }, 100);

      } else {
        setErrorMessage('Login successful, but session could not be established.');
      }
    } catch (error: any) {
      // Handle "Account not found" specifically
      if (error.message?.includes('404')) {
        setErrorMessage(
          <div className="text-center">
            <p className="mb-1">Account not found.</p>
            <Link to="/register" className="text-brand-cyan font-bold hover:underline">
              Create a VOYEX account?
            </Link>
          </div>
        );
      } else if (error.message?.includes('401')) {
        setErrorMessage('Invalid email or password.');
      } else {
        setErrorMessage(error.message || 'Unable to connect to the server.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Plane className="w-12 h-12 text-brand-cyan mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white font-syne">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to access your dashboard</p>
        </div>
        
        <GlassCard className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <div className="flex items-center space-x-2 bg-dark-lighter/50 rounded-lg px-4 py-3 border border-white/10 focus-within:border-brand-cyan transition-colors">
                <Mail className="w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-600" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <div className="flex items-center space-x-2 bg-dark-lighter/50 rounded-lg px-4 py-3 border border-white/10 focus-within:border-brand-cyan transition-colors">
                <Lock className="w-5 h-5 text-gray-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-600" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none">
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400 hover:text-white" /> : <Eye className="w-5 h-5 text-gray-400 hover:text-white" />}
                </button>
              </div>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
              >
                {errorMessage}
              </motion.div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting} 
              className="w-full py-3 bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-bold rounded-lg transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-brand-indigo/30 active:scale-95"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : 'Login'}
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-400">
            New to VOYEX? <Link to="/register" className="text-brand-cyan font-semibold hover:underline">Sign Up</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;