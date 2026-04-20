import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Landmark, Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { useTripContext } from '../context/TripContext';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { calculateTotalCost } = useTripContext();
  
  // Get the booking ID passed from the Confirmation page
  const bookingId = location.state?.bookingId; 
  
  const [method, setMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Effect to redirect if no bookingId is present (e.g., direct URL access)
  useEffect(() => {
    if (!bookingId) {
      setError("No active booking found. Redirecting...");
      const timer = setTimeout(() => navigate('/plan'), 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingId, navigate]);

  const handlePayment = async () => {
    if (!bookingId || bookingId === 'Pending...') {
      setError("No active booking found. Please go back and try again.");
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Extract numeric ID (removes 'VOYEX' prefix if present)
      const numericId = String(bookingId).replace('VOYEX', '');
      const token = localStorage.getItem("token");

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payments/confirm`, {
        method: 'POST',
        // IMPORTANT: 'include' allows JSESSIONID to be sent
        credentials: 'include', 
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ bookingId: numericId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Payment verification failed on server.");
      }

      // Success! Move to My Trips
      navigate('/my-trips', { state: { paymentSuccess: true } });
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalCost = calculateTotalCost();
  const baseFare = totalCost / 1.18; // Reverse GST calculation
  const gstAmount = totalCost - baseFare;

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Payment Methods */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6 font-syne">Secure Checkout</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="space-y-4">
            {[
              { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5" /> },
              { id: 'upi', name: 'UPI / NetBanking', icon: <Landmark className="w-5 h-5" /> },
              { id: 'wallet', name: 'Digital Wallets', icon: <Wallet className="w-5 h-5" /> },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setMethod(item.id)}
                disabled={isProcessing}
                className={`w-full p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                  method === item.id 
                    ? 'border-brand-cyan bg-brand-cyan/10 text-white' 
                    : 'border-white/10 text-gray-400 hover:border-white/20'
                }`}
              >
                {item.icon}
                <span className="font-semibold">{item.name}</span>
                {method === item.id && <CheckCircle className="ml-auto w-5 h-5 text-brand-cyan" />}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Right: Summary Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }}
        >
          <GlassCard className="p-8 h-full flex flex-col justify-between border border-white/10" gradient>
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Summary</h3>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-brand-cyan font-mono uppercase tracking-tighter border border-brand-cyan/20">
                  REF: {bookingId || 'N/A'}
                </span>
              </div>
              
              <div className="space-y-4 border-b border-white/10 pb-6 mb-6">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Base Booking Fare</span>
                  <span>₹{baseFare.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Taxes (GST 18%)</span>
                  <span>₹{gstAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex justify-between text-3xl font-bold text-brand-cyan">
                <span>Total</span>
                <span>₹{totalCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-12">
              <button 
                onClick={handlePayment}
                disabled={isProcessing || !bookingId}
                className="w-full py-4 bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-bold rounded-xl shadow-lg hover:shadow-brand-cyan/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authorizing...
                  </span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" /> 
                    Pay Securely
                  </>
                )}
              </button>
              
              <div className="flex flex-col items-center gap-2 mt-6">
                <p className="text-[10px] text-gray-500 flex items-center gap-1 uppercase tracking-widest">
                  <CheckCircle className="w-3 h-3 text-green-500" /> 256-bit SSL Encrypted
                </p>
                <div className="flex gap-4 opacity-30 grayscale">
                  {/* Mock Payment Provider Logos */}
                  <div className="w-8 h-5 bg-white rounded-sm" />
                  <div className="w-8 h-5 bg-white rounded-sm" />
                  <div className="w-8 h-5 bg-white rounded-sm" />
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;