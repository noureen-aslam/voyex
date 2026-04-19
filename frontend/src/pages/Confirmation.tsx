import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Phone, Mail, Car, MapPin, Calendar, Download, Share2 } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useTripContext } from '../context/TripContext';
import { drivers } from '../data/mockData';
import { createTripBooking } from '../lib/api';

const Confirmation = () => {
  const navigate = useNavigate();
  const { tripData, calculateTotalCost, user } = useTripContext(); // Added 'user'
  const [showConfetti, setShowConfetti] = useState(false);
  const [bookingId, setBookingId] = useState('Pending...');
  const [bookingError, setBookingError] = useState('');
  const hasBookedRef = useRef(false);
  const driver = drivers[0];
  const totalPrice = calculateTotalCost();

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const createBooking = async () => {
      // 1. Safety Check: If no user, we can't link the trip to an account
      if (!user) {
        setBookingError("Please login to save your booking.");
        setBookingId("Unauthorized");
        return;
      }

      try {
        const response = await createTripBooking({
          userId: user.id, // PASS THE USER ID FROM CONTEXT
          destination: tripData.destination,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          travelers: tripData.travelers,
          totalPrice,
          status: 'CONFIRMED'
        });
        setBookingId(`VOYEX${response.bookingId}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Trip booking failed.';
        setBookingError(message);
        setBookingId('Not Created');
      }
    };

    if (hasBookedRef.current) return;

    if (tripData.destination && tripData.startDate && tripData.endDate) {
      hasBookedRef.current = true;
      createBooking();
    }
  }, [totalPrice, tripData, user]); // Added user to dependency array

  // ... (Keep the rest of your JSX exactly as it was)
  return (
      <div className="min-h-screen bg-dark-bg pt-16">
          {/* Confetti and UI Logic */}
          {/* ... same as your code ... */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* ... Render Trip Details ... */}
            <div className="text-2xl font-bold text-brand-cyan font-syne">{bookingId}</div>
            {bookingError && (
                <button 
                  onClick={() => navigate('/login')}
                  className="text-brand-cyan underline mt-2 block mx-auto"
                >
                  Login to fix this
                </button>
            )}
            {/* ... Rest of JSX ... */}
          </div>
      </div>
  )
};

export default Confirmation;