import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Car, Hotel, Check, ArrowRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { packages } from '../data/mockData';
import { getPackages, TravelPackage } from '../lib/api';

const Packages = () => {
  const navigate = useNavigate();
  const [livePackages, setLivePackages] = useState<TravelPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadPackages = async () => {
      try {
        setIsLoading(true);
        const data = await getPackages();
        setLivePackages(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load packages.';
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };
    loadPackages();
  }, []);

  const packagesToShow = livePackages.length > 0
    ? livePackages.map((pkg) => ({
        id: pkg.id,
        name: pkg.name,
        image: pkg.imageUrl,
        price: Number(pkg.price),
        duration: pkg.duration,
        includes: pkg.includes || [],
        highlights: pkg.highlights || [],
      }))
    : packages;

  return (
    <div className="min-h-screen bg-dark-bg pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold font-syne text-white mb-4">
            <span className="bg-gradient-to-r from-brand-indigo to-brand-cyan bg-clip-text text-transparent">
              Curated Packages
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Handpicked destinations with everything included. Just pack your bags and go!
          </p>
        </motion.div>

        {isLoading && <p className="text-center text-gray-400 mb-8">Loading packages...</p>}
        {errorMessage && (
          <p className="text-center text-sm text-red-400 mb-8">
            {errorMessage} Showing fallback packages.
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packagesToShow.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="overflow-hidden group h-full flex flex-col" hover={true}>
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent" />
                  <div className="absolute top-4 right-4 bg-brand-cyan text-dark-bg px-4 py-2 rounded-full font-bold">
                    ₹{pkg.price.toLocaleString()}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1 font-syne">{pkg.name}</h3>
                    <div className="flex items-center space-x-4 text-gray-300 text-sm">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {pkg.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3 flex items-center">
                      <Check className="w-5 h-5 mr-2 text-brand-cyan" />
                      Package Includes
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {pkg.includes.map((item, i) => (
                        <div key={i} className="flex items-center text-sm text-gray-400">
                          <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full mr-2" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {pkg.highlights.map((highlight, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-dark-lighter/50 border border-white/10 rounded-full text-xs text-gray-400"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-dark-lighter/30 rounded-lg p-2 border border-white/10">
                        <Car className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
                        <div className="text-xs text-gray-400">Transport</div>
                      </div>
                      <div className="bg-dark-lighter/30 rounded-lg p-2 border border-white/10">
                        <Hotel className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
                        <div className="text-xs text-gray-400">Hotels</div>
                      </div>
                      <div className="bg-dark-lighter/30 rounded-lg p-2 border border-white/10">
                        <Users className="w-5 h-5 text-brand-cyan mx-auto mb-1" />
                        <div className="text-xs text-gray-400">Activities</div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/plan')}
                      className="w-full py-3 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-semibold hover:shadow-xl hover:shadow-brand-indigo/50 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <GlassCard className="p-8 text-center" gradient>
            <h2 className="text-2xl sm:text-3xl font-bold font-syne text-white mb-3">
              Want a Custom Package?
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Can't find the perfect package? Create your own custom trip with our trip wizard and get exactly what you want.
            </p>
            <button
              onClick={() => navigate('/plan')}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-semibold hover:shadow-xl hover:shadow-brand-indigo/50 transition-all inline-flex items-center space-x-2"
            >
              <span>Create Custom Trip</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </GlassCard>
        </motion.div>

        <div className="mt-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold font-syne text-white mb-4">Why Choose Our Packages?</h2>
            <p className="text-gray-400">Everything you need for a perfect vacation</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🚗',
                title: 'Door to Door',
                description: 'Pickup and drop from your doorstep',
              },
              {
                icon: '🏨',
                title: 'Premium Hotels',
                description: 'Verified 3-5 star accommodations',
              },
              {
                icon: '🍽️',
                title: 'Meals Included',
                description: 'Breakfast & select meals covered',
              },
              {
                icon: '🎯',
                title: 'Guided Tours',
                description: 'Expert local guides included',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <GlassCard className="p-6 text-center">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Packages;
