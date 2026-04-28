import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Sparkles, Car, Hotel, UtensilsCrossed, Map, Shield, Clock, ArrowRight, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { destinations, testimonials } from '../data/mockData';

const Home = () => {
  const navigate = useNavigate();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  const features = [
    {
      icon: Car,
      title: 'Door to Door Service',
      description: 'Pickup from your home, drop at destination. Complete travel solution.',
    },
    {
      icon: Hotel,
      title: 'Premium Stays',
      description: 'Handpicked hotels and resorts for your comfort and luxury.',
    },
    {
      icon: UtensilsCrossed,
      title: 'Curated Dining',
      description: 'Best local restaurants and authentic cuisine experiences.',
    },
    {
      icon: Map,
      title: 'AI Itinerary',
      description: 'Smart trip planning powered by AI for optimal experiences.',
    },
    {
      icon: Shield,
      title: '24/7 Support',
      description: 'Round the clock assistance for a worry-free journey.',
    },
    {
      icon: Clock,
      title: 'Live Tracking',
      description: 'Real-time updates and location tracking throughout your trip.',
    },
  ];

  const steps = [
    { number: 1, title: 'Choose Destination', description: 'Select from our curated destinations' },
    { number: 2, title: 'Set Preferences', description: 'Travelers, budget, and travel style' },
    { number: 3, title: 'Pick Vehicle', description: 'Choose from our premium fleet' },
    { number: 4, title: 'Select Hotels', description: 'Book the perfect stay' },
    { number: 5, title: 'Plan Activities', description: 'Dining and sightseeing' },
    { number: 6, title: 'Confirm & Go', description: 'Sit back and enjoy the journey' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-brand-cyan rounded-full"
              style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-7xl font-bold font-syne mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-brand-indigo via-brand-cyan to-brand-indigo bg-clip-text text-transparent">
                Travel Smarter.
              </span>
              <br />
              <span className="text-white">Door to Door, Zero Stress.</span>
            </motion.h1>
            <motion.p
              className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Experience seamless travel with VOYEX. From your doorstep to your destination, we handle everything.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <GlassCard className="p-6 sm:p-8 max-w-4xl mx-auto" hover={false}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Destination</label>
                  <div className="flex items-center space-x-2 bg-dark-lighter/50 rounded-lg px-4 py-3 border border-white/10">
                    <MapPin className="w-5 h-5 text-brand-cyan" />
                    <input
                      type="text"
                      placeholder="Where to?"
                      className="bg-transparent border-none outline-none text-white w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Check In</label>
                  <div className="flex items-center space-x-2 bg-dark-lighter/50 rounded-lg px-4 py-3 border border-white/10">
                    <Calendar className="w-5 h-5 text-brand-cyan" />
                    <input
                      type="date"
                      className="bg-transparent border-none outline-none text-white w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Check Out</label>
                  <div className="flex items-center space-x-2 bg-dark-lighter/50 rounded-lg px-4 py-3 border border-white/10">
                    <Calendar className="w-5 h-5 text-brand-cyan" />
                    <input
                      type="date"
                      className="bg-transparent border-none outline-none text-white w-full"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Travelers</label>
                  <div className="flex items-center space-x-2 bg-dark-lighter/50 rounded-lg px-4 py-3 border border-white/10">
                    <Users className="w-5 h-5 text-brand-cyan" />
                    <input
                      type="number"
                      placeholder="2"
                      min="1"
                      className="bg-transparent border-none outline-none text-white w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="text-gray-400 text-sm mb-2 block">Trip Style</label>
                <div className="flex flex-wrap gap-2">
                  {['Adventure', 'Relaxation', 'Culture', 'Food'].map((style) => (
                    <button
                      key={style}
                      className="px-4 py-2 rounded-lg bg-dark-lighter/50 border border-white/10 text-gray-300 hover:border-brand-cyan hover:text-brand-cyan transition-all"
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => navigate('/plan')}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-semibold text-lg hover:shadow-xl hover:shadow-brand-indigo/50 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Start Planning</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-syne text-white mb-4">
            Trending Destinations
          </h2>
          <p className="text-gray-400">Discover the most popular travel spots in India</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="overflow-hidden group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-brand-cyan font-semibold">{dest.price}</span>
                      <span className="text-gray-400 text-sm">{dest.duration}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- HOW IT WORKS SECTION --- */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    className="text-center mb-16"
  >
    <h2 className="text-3xl sm:text-4xl font-bold font-syne text-white mb-4">
      How It Works
    </h2>
    <p className="text-gray-400">Six simple steps to your perfect journey</p>
  </motion.div>

  <div className="relative">
    {/* 1. Added z-0 to keep the line at the very bottom of the stack */}
    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-brand-indigo via-brand-cyan to-brand-indigo hidden lg:block z-0" />

    {/* 2. Added relative z-10 to the steps container so cards are above the line */}
    <div className="relative z-10 space-y-8">
      {steps.map((step, index) => (
        <motion.div
          key={step.number}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-center gap-8 ${
            index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
          }`}
        >
          <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </GlassCard>
          </div>

          {/* 3. Added z-20 to ensure the circle is the topmost element in the center */}
          <div className="relative z-20 w-16 h-16 rounded-full bg-gradient-to-br from-brand-indigo to-brand-cyan flex items-center justify-center text-white font-bold text-xl font-syne shadow-lg shadow-brand-indigo/50 flex-shrink-0">
            {step.number}
          </div>

          <div className="flex-1 hidden lg:block" />
        </motion.div>
      ))}
    </div>
  </div>
</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-syne text-white mb-4">
            Why Choose VOYEX
          </h2>
          <p className="text-gray-400">Premium features for a seamless travel experience</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6 text-center group" gradient>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-indigo to-brand-cyan flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold font-syne text-white mb-4">
            What Travelers Say
          </h2>
          <p className="text-gray-400">Real experiences from real travelers</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-400 text-sm">{testimonial.text}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-12 text-center" gradient>
            <h2 className="text-3xl sm:text-4xl font-bold font-syne text-white mb-4">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Start planning your perfect trip today. Door to door service, zero hassle, maximum memories.
            </p>
            <button
              onClick={() => navigate('/plan')}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-semibold text-lg hover:shadow-xl hover:shadow-brand-indigo/50 transition-all duration-300 inline-flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Plan Your Trip Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
