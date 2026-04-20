import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Car, ArrowRight, Download, Share2, Clock } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { getMyTrips, Trip } from '../lib/api';

const MyTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadTrips = async () => {
      const token = localStorage.getItem("token");
      
      // 1. Guard Clause: Check for token immediately
      if (!token) {
        setErrorMessage("Your session has expired. Please log in again.");
        setIsLoading(false);
        // Optional: Auto-redirect to login after 2 seconds
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        setIsLoading(true);
        // 2. Fetch data from our corrected API helper
        const data = await getMyTrips();
        setTrips(data);
        setErrorMessage(''); // Clear errors on success
      } catch (error: any) {
        console.error("Fetch Error:", error);
        setErrorMessage(error.message || 'Unable to connect to the server.');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrips();
  }, [navigate]);

  // Use useMemo to prevent unnecessary recalculations
  const activeTrip = useMemo(() => trips[0], [trips]);
  const pastTrips = useMemo(() => trips.slice(1), [trips]);
  
  const defaultImage = 'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg';

  return (
    <div className="min-h-screen bg-dark-bg pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-syne text-white mb-2">My Trips</h1>
            <p className="text-gray-400">Manage and track all your journeys</p>
          </div>
          <button
            onClick={() => navigate('/plan')}
            className="mt-4 sm:mt-0 px-6 py-3 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-semibold hover:shadow-xl hover:shadow-brand-indigo/50 transition-all flex items-center space-x-2"
          >
            <span>Plan New Trip</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Global Loading / Error States */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-cyan"></div>
            <span className="ml-4 text-gray-400">Fetching your adventures...</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-8 flex justify-between items-center">
            <span>{errorMessage}</span>
            {!localStorage.getItem("token") && (
              <button onClick={() => navigate('/login')} className="text-brand-cyan font-bold hover:underline">
                Login Now
              </button>
            )}
          </div>
        )}

        {/* Content Section */}
        {!isLoading && !errorMessage && (
          <>
            {trips.length === 0 ? (
              /* Empty State */
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <GlassCard className="p-12">
                  <div className="bg-dark-lighter w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MapPin className="text-gray-500 w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No trips found</h3>
                  <p className="text-gray-400 mb-6">You haven't booked any trips yet. Ready to start?</p>
                  <button onClick={() => navigate('/plan')} className="text-brand-cyan font-bold hover:underline">
                    Plan your first trip &rarr;
                  </button>
                </GlassCard>
              </motion.div>
            ) : (
              <>
                {/* Active Trip Section */}
                {activeTrip && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                      <Clock className="w-6 h-6 mr-2 text-brand-cyan" />
                      Active Trip
                    </h2>
                    <GlassCard className="overflow-hidden" gradient>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                        <div className="lg:col-span-2">
                          <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <img
                              src={defaultImage}
                              alt={activeTrip.destination}
                              className="w-full sm:w-48 h-48 rounded-xl object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="text-2xl font-bold text-white mb-1">{activeTrip.destination}</h3>
                                  <div className="text-brand-cyan text-sm font-semibold">VOYEX-TRIP-{activeTrip.id}</div>
                                </div>
                                <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm font-semibold border border-green-500/20 capitalize">
                                  {activeTrip.status || 'Confirmed'}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center text-gray-400 text-sm">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {new Date(activeTrip.startDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-gray-400 text-sm">
                                  <Users className="w-4 h-4 mr-2" />
                                  {activeTrip.travelers} Travelers
                                </div>
                                <div className="flex items-center text-gray-400 text-sm">
                                  <Car className="w-4 h-4 mr-2" />
                                  Premium Vehicle
                                </div>
                                <div className="flex items-center text-gray-400 text-sm">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  Dest. Locked
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <button onClick={() => navigate('/dashboard')} className="px-6 py-2 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-semibold hover:shadow-lg transition-all">
                              Track Live
                            </button>
                            <button className="px-6 py-2 rounded-lg bg-dark-lighter border border-white/10 text-white hover:border-brand-cyan transition-all flex items-center space-x-2">
                              <Download className="w-4 h-4" />
                              <span>Itinerary</span>
                            </button>
                          </div>
                        </div>
                        <div className="bg-dark-lighter/30 rounded-xl p-4 border border-white/10">
                          <h4 className="text-white font-semibold mb-4">Quick Actions</h4>
                          <div className="space-y-2">
                            <button className="w-full py-2 px-4 rounded-lg bg-dark-lighter border border-white/10 text-white hover:border-brand-cyan transition-all text-sm text-left">View Hotel</button>
                            <button className="w-full py-2 px-4 rounded-lg bg-dark-lighter border border-white/10 text-white hover:border-brand-cyan transition-all text-sm text-left">Support</button>
                            <button className="w-full py-2 px-4 rounded-lg bg-dark-lighter border border-white/10 text-white hover:border-brand-cyan transition-all text-sm text-left flex items-center justify-between">
                              <span>Share Trip</span>
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                {/* Past Trips Grid */}
                {pastTrips.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Past Trips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {pastTrips.map((trip, index) => (
                        <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                          <GlassCard className="overflow-hidden group">
                            <div className="relative h-48 overflow-hidden">
                              <img src={defaultImage} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent" />
                              <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="text-xl font-bold text-white mb-1">{trip.destination}</h3>
                                <div className="text-brand-cyan text-xs font-semibold">VOYEX-TRIP-{trip.id}</div>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                                <div className="flex items-center text-gray-400">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {new Date(trip.startDate).toLocaleDateString()}
                                </div>
                                <div className="flex items-center text-gray-400">
                                  <Users className="w-4 h-4 mr-2" />
                                  {trip.travelers} Pax
                                </div>
                              </div>
                              <button className="w-full py-2 rounded-lg bg-dark-lighter border border-white/10 text-white hover:border-brand-cyan transition-all text-sm">
                                View Details
                              </button>
                            </div>
                          </GlassCard>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12">
          <GlassCard className="p-8 text-center" gradient>
            <h2 className="text-2xl font-bold text-white mb-3">Ready for Your Next Adventure?</h2>
            <p className="text-gray-400 mb-6">Start planning your next unforgettable journey with VOYEX</p>
            <button onClick={() => navigate('/plan')} className="px-8 py-3 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-semibold hover:shadow-xl transition-all inline-flex items-center space-x-2">
              <span>Plan New Trip</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default MyTrips;