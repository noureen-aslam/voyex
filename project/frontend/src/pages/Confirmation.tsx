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
  const { tripData, calculateTotalCost } = useTripContext();
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
      try {
        const response = await createTripBooking({
          destination: tripData.destination,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          travelers: tripData.travelers,
          totalPrice,
        });
        setBookingId(`VOYEX${response.bookingId}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Trip booking failed.';
        setBookingError(message);
        setBookingId('Not Created');
      }
    };

    if (hasBookedRef.current) {
      return;
    }

    if (tripData.destination && tripData.startDate && tripData.endDate) {
      hasBookedRef.current = true;
      createBooking();
    }
  }, [totalPrice, tripData.destination, tripData.endDate, tripData.startDate, tripData.travelers]);

  return (
    <div className="min-h-screen bg-dark-bg pt-16">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-brand-cyan rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
              }}
              animate={{
                y: window.innerHeight + 50,
                x: Math.random() * 200 - 100,
                rotate: Math.random() * 360,
                opacity: [1, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-brand-indigo to-brand-cyan flex items-center justify-center">
            <Check className="w-12 h-12 text-white" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold font-syne text-white mb-2"
          >
            Booking Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400"
          >
            Your journey is all set. Get ready for an amazing experience!
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="p-8 mb-6" gradient>
            <div className="text-center mb-8">
              <div className="text-gray-400 text-sm mb-2">Booking ID</div>
              <div className="text-2xl font-bold text-brand-cyan font-syne">{bookingId}</div>
              {bookingError && <div className="text-sm text-red-400 mt-2">{bookingError}</div>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  Destination
                </div>
                <div className="text-white font-semibold text-lg">{tripData.destination}</div>
              </div>
              <div>
                <div className="flex items-center text-gray-400 text-sm mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Travel Dates
                </div>
                <div className="text-white font-semibold text-lg">
                  {tripData.startDate} - {tripData.endDate}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 rounded-lg bg-dark-lighter border border-white/10 text-white hover:border-brand-cyan transition-all flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              <button className="px-6 py-3 rounded-lg bg-dark-lighter border border-white/10 text-white hover:border-brand-cyan transition-all flex items-center space-x-2">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <GlassCard className="p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
              <Car className="w-6 h-6 mr-2 text-brand-cyan" />
              Your Driver
            </h3>
            <div className="flex items-center gap-4">
              <img
                src={driver.image}
                alt={driver.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-brand-cyan"
              />
              <div className="flex-1">
                <h4 className="text-white font-bold text-lg">{driver.name}</h4>
                <div className="text-gray-400 text-sm mb-2">⭐ {driver.rating} • {driver.trips} trips</div>
                <div className="text-gray-400 text-sm">{driver.vehicle}</div>
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${driver.phone}`}
                  className="px-4 py-2 rounded-lg bg-brand-indigo text-white hover:bg-brand-indigo/80 transition-all flex items-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Call</span>
                </a>
                <a
                  href={`sms:${driver.phone}`}
                  className="px-4 py-2 rounded-lg bg-dark-lighter border border-white/10 text-white hover:border-brand-cyan transition-all flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">Message</span>
                </a>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <GlassCard className="p-6 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">Pickup Details</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-brand-cyan" />
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Pickup Location</div>
                  <div className="text-white font-semibold">Your Home Address</div>
                  <div className="text-gray-400 text-sm">Driver will confirm via call</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-brand-cyan" />
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Pickup Time</div>
                  <div className="text-white font-semibold">{tripData.startDate} at 8:00 AM</div>
                  <div className="text-gray-400 text-sm">Please be ready 15 minutes early</div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Hotel Details</h3>
            <div className="space-y-3">
              {tripData.hotels.map((hotel, index) => (
                <div key={hotel.id} className="flex items-center gap-4 p-3 bg-dark-lighter/30 rounded-lg">
                  <img src={hotel.image} alt={hotel.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{hotel.name}</h4>
                    <div className="text-gray-400 text-sm">{hotel.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-brand-cyan font-semibold">{hotel.nights}N</div>
                    <div className="text-gray-400 text-xs">nights</div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-4 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-semibold hover:shadow-xl hover:shadow-brand-indigo/50 transition-all"
          >
            Track Your Trip
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-4 rounded-lg bg-dark-card border border-white/10 text-white font-semibold hover:border-brand-cyan transition-all"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Confirmation;
