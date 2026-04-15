import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Plane } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { login, register } from '../lib/api';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState(''); // Corrected: Full name state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (isLogin) {
        // Handle Login
        const response = await login(email, password);
        // Storing user data for VOYEX session management
        localStorage.setItem('voyexUser', JSON.stringify(response.user));
        navigate('/my-trips');
      } else {
        // Handle Sign Up
        await register(email, password, fullName);
        setErrorMessage('Account created successfully! Switching to login...');
        // Small delay to let the user see the success message
        setTimeout(() => {
          setIsLogin(true);
          setErrorMessage('');
        }, 2000);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Action failed. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = (platform: string) => {
    alert(`${platform} login is coming soon to VOYEX! Please use the email form for now.`);
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
        {/* Left Side: Branding & Stats */}
        <div className="relative hidden lg:block overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/20 to-brand-cyan/20" />
          <img
            src="https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg"
            alt="Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark-bg/40 backdrop-blur-sm" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-indigo to-brand-cyan flex items-center justify-center">
                <Plane className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold font-syne text-white mb-4">
                Welcome to VOYEX
              </h1>
              <p className="text-gray-300 text-lg max-w-md">
                Your journey begins here. Door to door travel made simple and stress-free.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 grid grid-cols-3 gap-8"
            >
              {[
                { number: '50K+', label: 'Happy Travelers' },
                { number: '100+', label: 'Destinations' },
                { number: '4.9', label: 'Avg Rating' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-brand-cyan mb-1">{stat.number}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-brand-indigo to-brand-cyan flex items-center justify-center">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold font-syne text-white mb-2">VOYEX</h1>
              <p className="text-gray-400">Door to Door Travel</p>
            </div>

            <GlassCard className="p-8">
              <div className="flex mb-8">
                <button
                  onClick={() => { setIsLogin(true); setErrorMessage(''); }}
                  className={`flex-1 py-3 text-center font-semibold transition-all ${
                    isLogin
                      ? 'text-white border-b-2 border-brand-cyan'
                      : 'text-gray-400 border-b-2 border-transparent'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => { setIsLogin(false); setErrorMessage(''); }}
                  className={`flex-1 py-3 text-center font-semibold transition-all ${
                    !isLogin
                      ? 'text-white border-b-2 border-brand-cyan'
                      : 'text-gray-400 border-b-2 border-transparent'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
                    <div className="flex items-center space-x-2 bg-dark-lighter/50 rounded-lg px-4 py-3 border border-white/10 focus-within:border-brand-cyan transition-colors">
                      <User className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="bg-transparent border-none outline-none text-white w-full"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Email</label>
                  <div className="flex items-center space-x-2 bg-dark-lighter/50 rounded-lg px-4 py-3 border border-white/10 focus-within:border-brand-cyan transition-colors">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
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
                      placeholder="••••••••"
                      className="bg-transparent border-none outline-none text-white w-full"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-gray-400 cursor-pointer">
                      <input type="checkbox" className="mr-2" />
                      Remember me
                    </label>
                    <a href="#" className="text-brand-cyan hover:text-brand-cyan/80 transition-colors">
                      Forgot password?
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-semibold hover:shadow-xl hover:shadow-brand-indigo/50 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
                </button>

                {errorMessage && (
                  <p className={`text-sm text-center ${errorMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                    {errorMessage}
                  </p>
                )}

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-dark-card text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="py-3 rounded-lg bg-dark-lighter/50 border border-white/10 text-white hover:border-brand-cyan transition-all flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('Facebook')}
                    className="py-3 rounded-lg bg-dark-lighter/50 border border-white/10 text-white hover:border-brand-cyan transition-all flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>Facebook</span>
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-gray-400">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-brand-cyan hover:text-brand-cyan/80 transition-colors font-semibold"
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;