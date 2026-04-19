import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check, Phone, Mail, Car, MapPin, 
  Calendar, Download, Share2, AlertCircle, ShieldCheck 
} from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useTripContext } from '../context/TripContext';
import { drivers } from '../data/mockData';
import { createTripBooking } from '../lib/api';
import confetti from 'canvas-confetti';

const Confirmation = () => {
  const navigate = useNavigate();
  // Added setActiveBookingId from context
  const { tripData, calculateTotalCost, user, setActiveBookingId } = useTripContext();
  
  const [bookingId, setBookingId] = useState('Pending...');
  const [bookingError, setBookingError] = useState('');
  const [isSyncing, setIsSyncing] = useState(true);
  
  const hasBookedRef = useRef(false);
  const driver = drivers[0]; 
  const totalPrice = calculateTotalCost();

  // 1. Confetti Effect on mount
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00F5FF', '#7000FF', '#ffffff']
    });
  }, []);

  // 2. Database Sync Logic
  useEffect(() => {
    const createBooking = async () => {
      if (!user) {
        setBookingError("Please login to save your booking to your account.");
        setBookingId("Unauthorized");
        setIsSyncing(false);
        return;
      }

      try {
        const response = await createTripBooking({
          userId: user.id,
          destination: tripData.destination,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          travelers: tripData.travelers,
          totalPrice,
          status: 'PENDING'
        });
        
        const finalId = `VOYEX${response.bookingId}`;
        setBookingId(finalId);
        // CRITICAL: Save to context so Payment page has it!
        setActiveBookingId(finalId);
        
      } catch (error: any) {
        setBookingError(error.message || 'Connection to server failed.');
        setBookingId('Not Created');
      } finally {
        setIsSyncing(false);
      }
    };

    if (hasBookedRef.current) return;

    if (tripData.destination && tripData.startDate) {
      hasBookedRef.current = true;
      createBooking();
    }
  }, [totalPrice, tripData, user, setActiveBookingId]);

  return (
    <div className="min-h-screen bg-dark-bg pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Success Header */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50"
          >
            <Check className="w-10 h-10 text-green-500" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2 font-syne">Trip Reserved!</h1>
          <p className="text-gray-400">Your journey to {tripData.destination} is being prepared.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Trip Details */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Booking ID</p>
                  <h2 className="text-2xl font-bold text-brand-cyan font-syne">
                    {isSyncing ? "Generating..." : bookingId}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Total Amount</p>
                  <h2 className="text-2xl font-bold text-white">₹{totalPrice.toLocaleString()}</h2>
                </div>
              </div>

              {bookingError && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5" />
                  <span>{bookingError}</span>
                  {!user && (
                    <button onClick={() => navigate('/login')} className="ml-auto underline font-bold">
                      Login Now
                    </button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-lg"><Calendar className="w-5 h-5 text-brand-cyan" /></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Dates</p>
                    <p className="text-white">{tripData.startDate} — {tripData.endDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-lg"><MapPin className="w-5 h-5 text-brand-cyan" /></div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold">Destination</p>
                    <p className="text-white">{tripData.destination}</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Driver Assignment Section */}
            <GlassCard className="p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-brand-cyan" /> Assigned Voyager (Driver)
              </h3>
              <div className="flex items-center gap-4">
                <img src={driver.image} alt={driver.name} className="w-16 h-16 rounded-full object-cover border-2 border-brand-indigo" />
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-lg">{driver.name}</h4>
                  <p className="text-gray-400 text-sm">Expert Voyager • 4.98 ★</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-white/5 rounded-full hover:bg-brand-cyan/20 transition-all text-gray-300 hover:text-brand-cyan">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-white/5 rounded-full hover:bg-brand-cyan/20 transition-all text-gray-300 hover:text-brand-cyan">
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/payment', { state: { bookingId } })}
              className="w-full py-4 bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" />
              Proceed to Payment
            </button>
            
            <button className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              <Download className="w-4 h-4" /> Download Ticket
            </button>
            
            <button className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
              <Share2 className="w-4 h-4" /> Share Itinerary
            </button>

            <p className="text-xs text-gray-500 text-center px-4">
              A copy of your trip details has been sent to your registered email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;