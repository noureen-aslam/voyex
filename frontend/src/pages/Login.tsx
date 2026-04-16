import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Plane } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { login } from '../lib/api';

const Login = () => {
  const navigate = useNavigate();
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
      localStorage.setItem('voyexUser', JSON.stringify(response.user));
      navigate('/my-trips');
    } catch (error: any) {
      // If backend returns 404, the user doesn't exist
      if (error.message?.includes('404')) {
        setErrorMessage(
          <div className="text-center">
            <p>Account not found.</p>
            <Link to="/register" className="text-brand-cyan font-bold underline">
              Create a VOYEX account?
            </Link>
          </div>
        );
      } else {
        setErrorMessage(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Plane className="w-12 h-12 text-brand-cyan mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white font-syne">Welcome Back</h1>
        </div>
        
        <GlassCard className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <div className="flex items-center space-x-2 bg-dark-lighter/50 rounded-lg px-4 py-3 border border-white/10 focus-within:border-brand-cyan transition-colors">
                <Mail className="w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  className="bg-transparent border-none outline-none text-white w-full" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <div className="flex items-center space-x-2 bg-dark-lighter/50 rounded-lg px-4 py-3 border border-white/10 focus-within:border-brand-cyan transition-colors">
                <Lock className="w-5 h-5 text-gray-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="bg-transparent border-none outline-none text-white w-full" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <button disabled={isSubmitting} className="w-full py-3 bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-bold rounded-lg transition-all disabled:opacity-50">
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>

            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {errorMessage}
              </div>
            )}
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-400">
            New to VOYEX? <Link to="/register" className="text-brand-cyan font-semibold">Sign Up</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;