import { motion } from 'framer-motion';
import { CreditCard, ShieldCheck, Landmark, Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
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

  const handlePayment = async () => {
    if (!bookingId || bookingId === 'Pending...') {
      setError("No active booking found. Please go back and try again.");
      return;
    }

    setIsProcessing(true);
    try {
      // Extract numeric ID (removes 'VOYEX' prefix if present)
      const numericId = bookingId.replace('VOYEX', '');

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payments/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: numericId }),
      });

      if (!response.ok) throw new Error("Payment verification failed on server.");

      // Success! Move to My Trips
      navigate('/my-trips');
    } catch (err: any) {
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left: Methods */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-bold text-white mb-6 font-syne">Secure Checkout</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="space-y-4">
            {[
              { id: 'card', name: 'Credit/Debit Card', icon: <CreditCard /> },
              { id: 'upi', name: 'UPI / NetBanking', icon: <Landmark /> },
              { id: 'wallet', name: 'Digital Wallets', icon: <Wallet /> },
            ].map((item) => (
              <div 
                key={item.id}
                onClick={() => setMethod(item.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                  method === item.id ? 'border-brand-cyan bg-brand-cyan/10 text-white' : 'border-white/10 text-gray-400'
                }`}
              >
                {item.icon}
                <span className="font-semibold">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Summary */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <GlassCard className="p-8 h-full flex flex-col justify-between" gradient>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Summary</h3>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400 font-mono uppercase tracking-tighter">
                  ID: {bookingId}
                </span>
              </div>
              
              <div className="space-y-3 border-b border-white/10 pb-4 mb-4">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Booking Fare</span>
                  <span>₹{(calculateTotalCost() * 0.82).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Taxes (GST 18%)</span>
                  <span>₹{(calculateTotalCost() * 0.18).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between text-2xl font-bold text-brand-cyan">
                <span>Total</span>
                <span>₹{calculateTotalCost().toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-bold rounded-xl shadow-lg hover:shadow-brand-cyan/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? "Authorizing..." : <><ShieldCheck className="w-5 h-5" /> Pay Now</>}
              </button>
              <p className="text-center text-[10px] text-gray-500 mt-4 flex items-center justify-center gap-1 uppercase tracking-widest">
                <CheckCircle className="w-3 h-3" /> Encrypted by Voyex SecurePay
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;