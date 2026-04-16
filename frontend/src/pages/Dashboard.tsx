import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Phone, Navigation, Clock, MapPin, AlertCircle, Check } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { useTripContext } from '../context/TripContext';
import { drivers } from '../data/mockData';

const Dashboard = () => {
  const { tripData } = useTripContext();
  const driver = drivers[0];
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPosition((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const timeline = [
    { time: '8:00 AM', location: 'Pickup from Home', status: 'completed', eta: 'Completed' },
    { time: '9:30 AM', location: 'Highway Rest Stop', status: 'completed', eta: 'Completed' },
    { time: '11:00 AM', location: 'Lunch Break', status: 'in-progress', eta: 'Arriving in 15 min' },
    { time: '2:00 PM', location: 'Rest Stop 2', status: 'upcoming', eta: '3 hours' },
    { time: '5:00 PM', location: `${tripData.destination || 'Destination'}`, status: 'upcoming', eta: '6 hours' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold font-syne text-white mb-2">Live Trip Tracking</h1>
          <p className="text-gray-400">Track your journey in real-time</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6" gradient>
              <div className="relative h-96 bg-dark-lighter/30 rounded-xl overflow-hidden border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/5 to-brand-cyan/5" />

                <div className="absolute top-1/2 left-4 right-4 transform -translate-y-1/2">
                  <div className="relative h-2 bg-dark-lighter rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-indigo to-brand-cyan opacity-20" />
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-indigo to-brand-cyan"
                      style={{ width: '45%' }}
                    />
                  </div>

                  <motion.div
                    className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                    style={{ left: '45%' }}
                    animate={{
                      y: [-2, 2, -2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-indigo to-brand-cyan flex items-center justify-center shadow-lg shadow-brand-cyan/50">
                      <Navigation className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>

                  <div className="absolute left-0 top-8 text-center transform -translate-x-1/2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mb-2 mx-auto" />
                    <div className="text-white text-xs font-semibold whitespace-nowrap">Start</div>
                  </div>

                  <div className="absolute right-0 top-8 text-center transform translate-x-1/2">
                    <div className="w-3 h-3 bg-brand-cyan rounded-full mb-2 mx-auto" />
                    <div className="text-white text-xs font-semibold whitespace-nowrap">{tripData.destination || 'Destination'}</div>
                  </div>
                </div>

                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <div className="bg-dark-bg/80 backdrop-blur-xl rounded-lg px-4 py-2 border border-white/10">
                    <div className="text-gray-400 text-xs">Current Speed</div>
                    <div className="text-white font-bold text-xl">72 km/h</div>
                  </div>
                  <div className="bg-dark-bg/80 backdrop-blur-xl rounded-lg px-4 py-2 border border-white/10">
                    <div className="text-gray-400 text-xs">Distance Covered</div>
                    <div className="text-white font-bold text-xl">145 km</div>
                  </div>
                  <div className="bg-dark-bg/80 backdrop-blur-xl rounded-lg px-4 py-2 border border-white/10">
                    <div className="text-gray-400 text-xs">Remaining</div>
                    <div className="text-white font-bold text-xl">178 km</div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-dark-bg/80 backdrop-blur-xl rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-brand-cyan" />
                        <div>
                          <div className="text-white font-semibold">Heading to Lunch Break</div>
                          <div className="text-gray-400 text-sm">NH 48, Near Lonavala</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-brand-cyan font-bold">15 min</div>
                        <div className="text-gray-400 text-xs">ETA</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Clock className="w-6 h-6 mr-2 text-brand-cyan" />
                Trip Timeline
              </h3>
              <div className="space-y-4">
                {timeline.map((stop, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          stop.status === 'completed'
                            ? 'bg-green-500'
                            : stop.status === 'in-progress'
                            ? 'bg-gradient-to-br from-brand-indigo to-brand-cyan'
                            : 'bg-dark-lighter border border-white/10'
                        }`}
                      >
                        {stop.status === 'completed' ? (
                          <Check className="w-5 h-5 text-white" />
                        ) : stop.status === 'in-progress' ? (
                          <Navigation className="w-5 h-5 text-white" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div
                          className={`absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-12 ${
                            stop.status === 'completed' ? 'bg-green-500' : 'bg-dark-lighter'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-semibold">{stop.location}</h4>
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${
                            stop.status === 'completed'
                              ? 'bg-green-500/10 text-green-400'
                              : stop.status === 'in-progress'
                              ? 'bg-brand-cyan/10 text-brand-cyan'
                              : 'bg-dark-lighter text-gray-500'
                          }`}
                        >
                          {stop.eta}
                        </span>
                      </div>
                      <div className="text-gray-400 text-sm">{stop.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Driver Info</h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={driver.image}
                  alt={driver.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-brand-cyan"
                />
                <div>
                  <h4 className="text-white font-bold">{driver.name}</h4>
                  <div className="text-gray-400 text-sm">⭐ {driver.rating} Rating</div>
                  <div className="text-gray-400 text-xs">{driver.trips} trips</div>
                </div>
              </div>
              <div className="bg-dark-lighter/30 rounded-lg p-3 mb-4 border border-white/10">
                <div className="text-gray-400 text-xs mb-1">Vehicle</div>
                <div className="text-white font-semibold">{driver.vehicle}</div>
              </div>
              <div className="flex gap-2">
                <a
                  href={`tel:${driver.phone}`}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-semibold hover:shadow-lg hover:shadow-brand-indigo/50 transition-all flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </a>
                <button className="px-4 py-3 rounded-lg bg-dark-lighter border border-white/10 text-white hover:border-brand-cyan transition-all">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Next Stop</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-cyan mt-1" />
                  <div>
                    <div className="text-white font-semibold">Lunch Break</div>
                    <div className="text-gray-400 text-sm">NH 48, Near Lonavala</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-cyan mt-1" />
                  <div>
                    <div className="text-white font-semibold">11:00 AM</div>
                    <div className="text-gray-400 text-sm">Arriving in 15 minutes</div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all flex items-center justify-center space-x-2"
            >
              <AlertCircle className="w-5 h-5" />
              <span>Emergency Support</span>
            </motion.button>

            <GlassCard className="p-6">
              <h3 className="text-white font-semibold mb-3">Trip Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Destination</span>
                  <span className="text-white font-semibold">{tripData.destination || 'Goa'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white font-semibold">{tripData.startDate || 'Today'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Travelers</span>
                  <span className="text-white font-semibold">{tripData.travelers} people</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Vehicle</span>
                  <span className="text-white font-semibold">{tripData.vehicle?.type || 'SUV'}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
