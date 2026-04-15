import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Plane, AlertCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { register } from '../lib/api';

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await register(email, password, fullName);
      setStatus({ type: 'success', message: 'Account created! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      setStatus({ 
        type: 'error', 
        message: error.message.includes('405') 
          ? 'Server connection error (405). Please try again in a moment.' 
          : error.message 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-brand-cyan/10 mb-4">
            <Plane className="w-10 h-10 text-brand-cyan" />
          </div>
          <h1 className="text-3xl font-bold text-white font-syne">Join VOYEX</h1>
          <p className="text-gray-400 mt-2">Create your account to start planning.</p>
        </div>

        <GlassCard className="p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-brand-cyan transition-all">
                <User className="w-5 h-5 text-gray-500" />
                <input type="text" placeholder="John Doe" className="bg-transparent outline-none text-white w-full" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email Address</label>
              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-brand-cyan transition-all">
                <Mail className="w-5 h-5 text-gray-500" />
                <input type="email" placeholder="john@example.com" className="bg-transparent outline-none text-white w-full" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus-within:border-brand-cyan transition-all">
                <Lock className="w-5 h-5 text-gray-500" />
                <input type="password" placeholder="••••••••" className="bg-transparent outline-none text-white w-full" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>

            <button disabled={isSubmitting} className="w-full py-4 bg-brand-cyan text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all disabled:opacity-50">
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            {status.message && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex items-center gap-2 p-3 rounded-lg text-sm border ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                <AlertCircle className="w-4 h-4" />
                {status.message}
              </motion.div>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account? <Link to="/login" className="text-brand-cyan hover:underline font-semibold">Login</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Register;