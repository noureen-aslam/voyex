import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';
import { MapPin, Calendar, Users, DollarSign, Heart, Car, Hotel, UtensilsCrossed, Map as MapIcon, Check, Loader, ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { destinations, vehicles, hotels, restaurants, sightseeing, travelVibes } from '../data/mockData';

const TripWizard = () => {
  const { tripData, updateTripData, currentStep, setCurrentStep, calculateTotalCost } = useTripContext();
  const navigate = useNavigate();
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);

  const budgetOptions = ['Budget', 'Standard', 'Luxury', 'Ultra Premium'];

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/confirmation');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateAI = () => {
    setIsGeneratingItinerary(true);
    setTimeout(() => {
      const mockItinerary = [
        {
          day: 1,
          title: 'Arrival & Beach Exploration',
          activities: [
            { time: '10:00 AM', activity: 'Hotel Check-in', location: tripData.hotels[0]?.name || 'Your Hotel' },
            { time: '12:00 PM', activity: 'Lunch at Local Restaurant', location: 'Coastal Kitchen' },
            { time: '3:00 PM', activity: 'Beach Visit', location: 'Baga Beach' },
            { time: '7:00 PM', activity: 'Sunset View & Dinner', location: 'Beach Shack' },
          ],
        },
        {
          day: 2,
          title: 'Adventure & Sightseeing',
          activities: [
            { time: '8:00 AM', activity: 'Breakfast', location: 'Hotel' },
            { time: '10:00 AM', activity: 'Fort Visit', location: 'Fort Aguada' },
            { time: '1:00 PM', activity: 'Lunch', location: 'Spice Garden' },
            { time: '3:00 PM', activity: 'Water Sports', location: 'Baga Beach' },
            { time: '8:00 PM', activity: 'Dinner', location: 'Seafood Restaurant' },
          ],
        },
        {
          day: 3,
          title: 'Nature & Departure',
          activities: [
            { time: '7:00 AM', activity: 'Breakfast', location: 'Hotel' },
            { time: '9:00 AM', activity: 'Waterfall Trek', location: 'Dudhsagar Falls' },
            { time: '3:00 PM', activity: 'Return Journey', location: 'Departure' },
          ],
        },
      ];
      updateTripData({ aiItinerary: mockItinerary });
      setIsGeneratingItinerary(false);
    }, 1500);
  };

  const recommendVehicle = () => {
    if (tripData.travelers <= 5) return vehicles[0];
    if (tripData.travelers <= 7) return vehicles[1];
    if (tripData.travelers <= 12) return vehicles[2];
    return vehicles[3];
  };

  return (
    <div className="min-h-screen bg-dark-bg pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sticky top-20 z-40 bg-dark-bg/80 backdrop-blur-xl rounded-2xl p-4 mb-8 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white font-syne">Plan Your Trip</h2>
            <span className="text-gray-400">Step {currentStep} of 6</span>
          </div>
          <div className="relative h-2 bg-dark-lighter rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-brand-indigo to-brand-cyan"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 6) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {['Destination', 'Travelers', 'Vehicle', 'Hotels', 'Activities', 'Summary'].map((label, i) => (
              <span
                key={i}
                className={`text-xs ${currentStep > i ? 'text-brand-cyan' : 'text-gray-500'} hidden sm:block`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <MapPin className="w-6 h-6 mr-2 text-brand-cyan" />
                    Where do you want to go?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {destinations.map((dest) => (
                      <div
                        key={dest.id}
                        onClick={() => updateTripData({ destination: dest.name, vehicle: { ...tripData.vehicle!, distance: dest.distance } })}
                        className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                          tripData.destination === dest.name
                            ? 'border-brand-cyan shadow-lg shadow-brand-cyan/30'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img src={dest.image} alt={dest.name} className="w-full h-32 object-cover" />
                        <div className="p-3 bg-dark-card">
                          <h4 className="text-white font-semibold">{dest.name}</h4>
                          <p className="text-brand-cyan text-sm">{dest.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Check In Date</label>
                      <div className="flex items-center space-x-2 bg-dark-lighter/50 rounded-lg px-4 py-3 border border-white/10">
                        <Calendar className="w-5 h-5 text-brand-cyan" />
                        <input
                          type="date"
                          value={tripData.startDate}
                          onChange={(e) => updateTripData({ startDate: e.target.value })}
                          className="bg-transparent border-none outline-none text-white w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Check Out Date</label>
                      <div className="flex items-center space-x-2 bg-dark-lighter/50 rounded-lg px-4 py-3 border border-white/10">
                        <Calendar className="w-5 h-5 text-brand-cyan" />
                        <input
                          type="date"
                          value={tripData.endDate}
                          onChange={(e) => updateTripData({ endDate: e.target.value })}
                          className="bg-transparent border-none outline-none text-white w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 h-64 bg-dark-lighter/30 rounded-xl border border-white/10 flex items-center justify-center">
                    <div className="text-center">
                      <MapIcon className="w-12 h-12 text-brand-cyan mx-auto mb-2" />
                      <p className="text-gray-400">Map Preview</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Users className="w-6 h-6 mr-2 text-brand-cyan" />
                    Tell us about your group
                  </h3>

                  <div className="mb-6">
                    <label className="text-gray-400 text-sm mb-2 block">Number of Travelers</label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => updateTripData({ travelers: Math.max(1, tripData.travelers - 1) })}
                        className="w-12 h-12 rounded-lg bg-dark-lighter border border-white/10 flex items-center justify-center text-white hover:border-brand-cyan transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <div className="flex-1 text-center">
                        <div className="text-4xl font-bold text-white">{tripData.travelers}</div>
                        <div className="text-gray-400 text-sm">Travelers</div>
                      </div>
                      <button
                        onClick={() => updateTripData({ travelers: tripData.travelers + 1 })}
                        className="w-12 h-12 rounded-lg bg-dark-lighter border border-white/10 flex items-center justify-center text-white hover:border-brand-cyan transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="text-gray-400 text-sm mb-3 block">Budget Range</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {budgetOptions.map((budget) => (
                        <button
                          key={budget}
                          onClick={() => updateTripData({ budget })}
                          className={`py-3 px-4 rounded-lg border-2 transition-all ${
                            tripData.budget === budget
                              ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan'
                              : 'border-white/10 text-gray-400 hover:border-white/30'
                          }`}
                        >
                          <DollarSign className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-sm font-semibold">{budget}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm mb-3 block">Travel Vibes (Select Multiple)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {travelVibes.map((vibe) => {
                        const isSelected = tripData.vibes.includes(vibe.name);
                        return (
                          <button
                            key={vibe.id}
                            onClick={() => {
                              const newVibes = isSelected
                                ? tripData.vibes.filter((v) => v !== vibe.name)
                                : [...tripData.vibes, vibe.name];
                              updateTripData({ vibes: newVibes });
                            }}
                            className={`py-3 px-4 rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan'
                                : 'border-white/10 text-gray-400 hover:border-white/30'
                            }`}
                          >
                            <span className="text-2xl mb-1 block">{vibe.icon}</span>
                            <span className="text-sm font-semibold">{vibe.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                    <Car className="w-6 h-6 mr-2 text-brand-cyan" />
                    Choose Your Vehicle
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Recommended: {recommendVehicle().name} (for {tripData.travelers} travelers)
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {vehicles.map((vehicle) => {
                      const isRecommended = vehicle.id === recommendVehicle().id;
                      const isSelected = tripData.vehicle?.type === vehicle.type;
                      const estimatedCost = vehicle.pricePerKm * (tripData.vehicle?.distance || 0);

                      return (
                        <div
                          key={vehicle.id}
                          onClick={() =>
                            updateTripData({
                              vehicle: {
                                type: vehicle.type,
                                pricePerKm: vehicle.pricePerKm,
                                distance: tripData.vehicle?.distance || 0,
                              },
                            })
                          }
                          className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                            isSelected
                              ? 'border-brand-cyan shadow-lg shadow-brand-cyan/30'
                              : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className="relative">
                            <img src={vehicle.image} alt={vehicle.name} className="w-full h-40 object-cover" />
                            {isRecommended && (
                              <div className="absolute top-2 right-2 bg-brand-cyan text-dark-bg px-3 py-1 rounded-full text-xs font-semibold">
                                Recommended
                              </div>
                            )}
                          </div>
                          <div className="p-4 bg-dark-card">
                            <h4 className="text-white font-bold text-lg mb-1">{vehicle.name}</h4>
                            <p className="text-gray-400 text-sm mb-2">Capacity: {vehicle.capacity} people</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-brand-cyan font-semibold">₹{vehicle.pricePerKm}/km</span>
                              <span className="text-gray-400 text-sm">Est: ₹{estimatedCost.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {vehicle.features.map((feature, i) => (
                                <span key={i} className="text-xs bg-dark-lighter px-2 py-1 rounded text-gray-400">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <GlassCard className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                        <Hotel className="w-6 h-6 mr-2 text-brand-cyan" />
                        Select Hotels
                      </h3>
                      <p className="text-gray-400 mb-6">Choose accommodations for your stay</p>

                      <div className="flex gap-2 mb-6 overflow-x-auto">
                        {['All', 'Budget', 'Standard', 'Luxury', 'Ultra Premium'].map((filter) => (
                          <button
                            key={filter}
                            className="px-4 py-2 rounded-lg bg-dark-lighter border border-white/10 text-gray-400 hover:border-brand-cyan hover:text-brand-cyan transition-colors whitespace-nowrap"
                          >
                            {filter}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-4">
                        {hotels
                          .filter((h) => h.location === tripData.destination)
                          .map((hotel) => {
                            const isSelected = tripData.hotels.some((h) => h.id === hotel.id);
                            return (
                              <div
                                key={hotel.id}
                                onClick={() => {
                                  const newHotels = isSelected
                                    ? tripData.hotels.filter((h) => h.id !== hotel.id)
                                    : [...tripData.hotels, { ...hotel, nights: 3 }];
                                  updateTripData({ hotels: newHotels });
                                }}
                                className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                  isSelected
                                    ? 'border-brand-cyan bg-brand-cyan/5'
                                    : 'border-white/10 hover:border-white/30'
                                }`}
                              >
                                <img src={hotel.image} alt={hotel.name} className="w-32 h-24 rounded-lg object-cover" />
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="text-white font-bold">{hotel.name}</h4>
                                      <p className="text-gray-400 text-sm">{hotel.location}</p>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-brand-cyan font-semibold">₹{hotel.pricePerNight.toLocaleString()}</div>
                                      <div className="text-gray-400 text-xs">per night</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-400">
                                    <span className="flex items-center">
                                      ⭐ {hotel.rating}
                                    </span>
                                    <span className="px-2 py-1 bg-dark-lighter rounded text-xs">{hotel.type}</span>
                                  </div>
                                  <div className="flex gap-2 mt-2">
                                    {hotel.amenities.slice(0, 3).map((amenity, i) => (
                                      <span key={i} className="text-xs text-gray-500">
                                        • {amenity}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </GlassCard>
                  </div>

                  <div>
                    <GlassCard className="p-6 sticky top-32">
                      <h4 className="text-white font-bold mb-4">Cost Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Vehicle</span>
                          <span className="text-white">
                            ₹{tripData.vehicle ? (tripData.vehicle.pricePerKm * tripData.vehicle.distance).toLocaleString() : 0}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Hotels</span>
                          <span className="text-white">
                            ₹
                            {tripData.hotels
                              .reduce((sum, h) => sum + h.pricePerNight * h.nights, 0)
                              .toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t border-white/10 pt-3">
                          <div className="flex justify-between font-bold">
                            <span className="text-white">Total</span>
                            <span className="text-brand-cyan">₹{calculateTotalCost().toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <GlassCard className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <UtensilsCrossed className="w-6 h-6 mr-2 text-brand-cyan" />
                    Meals & Activities
                  </h3>

                  <div className="mb-8">
                    <h4 className="text-white font-semibold mb-4">Meal Plan</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {['breakfast', 'lunch', 'dinner'].map((meal) => (
                        <button
                          key={meal}
                          onClick={() =>
                            updateTripData({
                              meals: {
                                ...tripData.meals,
                                [meal]: !tripData.meals[meal as keyof typeof tripData.meals],
                              },
                            })
                          }
                          className={`py-3 px-4 rounded-lg border-2 transition-all capitalize ${
                            tripData.meals[meal as keyof typeof tripData.meals]
                              ? 'border-brand-cyan bg-brand-cyan/10 text-brand-cyan'
                              : 'border-white/10 text-gray-400 hover:border-white/30'
                          }`}
                        >
                          {meal}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-white font-semibold mb-4">Sightseeing Places</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {sightseeing
                        .filter((s) => s.location === tripData.destination)
                        .map((place) => {
                          const isSelected = tripData.sightseeing.some((p) => p.id === place.id);
                          return (
                            <div
                              key={place.id}
                              onClick={() => {
                                const newPlaces = isSelected
                                  ? tripData.sightseeing.filter((p) => p.id !== place.id)
                                  : [...tripData.sightseeing, place];
                                updateTripData({ sightseeing: newPlaces });
                              }}
                              className={`flex gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-brand-cyan bg-brand-cyan/5'
                                  : 'border-white/10 hover:border-white/30'
                              }`}
                            >
                              <img src={place.image} alt={place.name} className="w-20 h-20 rounded-lg object-cover" />
                              <div className="flex-1">
                                <h5 className="text-white font-semibold text-sm">{place.name}</h5>
                                <p className="text-gray-400 text-xs mb-1">{place.description}</p>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-500">{place.duration}</span>
                                  <span className="text-brand-cyan">₹{place.price}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold">AI Itinerary Generator</h4>
                      <button
                        onClick={handleGenerateAI}
                        disabled={isGeneratingItinerary}
                        className="px-6 py-2 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-semibold hover:shadow-lg hover:shadow-brand-indigo/50 transition-all disabled:opacity-50 flex items-center space-x-2"
                      >
                        {isGeneratingItinerary ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <MapIcon className="w-4 h-4" />
                            <span>Auto Plan</span>
                          </>
                        )}
                      </button>
                    </div>

                    {tripData.aiItinerary.length > 0 && (
                      <div className="space-y-4">
                        {tripData.aiItinerary.map((day) => (
                          <div key={day.day} className="bg-dark-lighter/30 rounded-xl p-4 border border-white/10">
                            <h5 className="text-white font-bold mb-3">
                              Day {day.day}: {day.title}
                            </h5>
                            <div className="space-y-2">
                              {day.activities.map((activity, i) => (
                                <div key={i} className="flex gap-3 text-sm">
                                  <span className="text-brand-cyan font-semibold w-20">{activity.time}</span>
                                  <div className="flex-1">
                                    <div className="text-white">{activity.activity}</div>
                                    <div className="text-gray-400 text-xs">{activity.location}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <GlassCard className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Check className="w-6 h-6 mr-2 text-brand-cyan" />
                        Trip Summary
                      </h3>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-white font-semibold mb-3">Destination & Dates</h4>
                          <div className="bg-dark-lighter/30 rounded-xl p-4 border border-white/10">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-gray-400 text-sm">Destination</span>
                                <div className="text-white font-semibold">{tripData.destination}</div>
                              </div>
                              <div>
                                <span className="text-gray-400 text-sm">Travelers</span>
                                <div className="text-white font-semibold">{tripData.travelers} people</div>
                              </div>
                              <div>
                                <span className="text-gray-400 text-sm">Check In</span>
                                <div className="text-white font-semibold">{tripData.startDate}</div>
                              </div>
                              <div>
                                <span className="text-gray-400 text-sm">Check Out</span>
                                <div className="text-white font-semibold">{tripData.endDate}</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-3">Vehicle</h4>
                          <div className="bg-dark-lighter/30 rounded-xl p-4 border border-white/10">
                            <div className="text-white font-semibold">{tripData.vehicle?.type}</div>
                            <div className="text-gray-400 text-sm">
                              ₹{tripData.vehicle?.pricePerKm}/km × {tripData.vehicle?.distance}km
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-3">Hotels</h4>
                          <div className="space-y-2">
                            {tripData.hotels.map((hotel) => (
                              <div key={hotel.id} className="bg-dark-lighter/30 rounded-xl p-4 border border-white/10">
                                <div className="flex justify-between">
                                  <div className="text-white font-semibold">{hotel.name}</div>
                                  <div className="text-brand-cyan">₹{(hotel.pricePerNight * hotel.nights).toLocaleString()}</div>
                                </div>
                                <div className="text-gray-400 text-sm">{hotel.nights} nights</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-3">Activities</h4>
                          <div className="bg-dark-lighter/30 rounded-xl p-4 border border-white/10">
                            <div className="text-gray-400 text-sm mb-2">Meals: {Object.values(tripData.meals).filter(Boolean).length} per day</div>
                            <div className="text-gray-400 text-sm">Sightseeing: {tripData.sightseeing.length} places</div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>

                  <div>
                    <GlassCard className="p-6 sticky top-32" gradient>
                      <h4 className="text-white font-bold text-xl mb-6">Final Cost</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Vehicle</span>
                          <span className="text-white">
                            ₹{tripData.vehicle ? (tripData.vehicle.pricePerKm * tripData.vehicle.distance).toLocaleString() : 0}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Hotels</span>
                          <span className="text-white">
                            ₹{tripData.hotels.reduce((sum, h) => sum + h.pricePerNight * h.nights, 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Activities</span>
                          <span className="text-white">
                            ₹{tripData.sightseeing.reduce((sum, p) => sum + p.price * tripData.travelers, 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t border-white/20 pt-4">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-white font-bold text-lg">Grand Total</span>
                            <span className="text-brand-cyan font-bold text-2xl">
                              ₹{calculateTotalCost().toLocaleString()}
                            </span>
                          </div>
                          <button
                            onClick={handleNext}
                            className="w-full py-4 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-semibold hover:shadow-xl hover:shadow-brand-indigo/50 transition-all"
                          >
                            Confirm Booking
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-6 py-3 rounded-lg bg-dark-card border border-white/10 text-white font-semibold hover:border-brand-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>
          {currentStep < 6 && (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-brand-indigo to-brand-cyan text-white font-semibold hover:shadow-lg hover:shadow-brand-indigo/50 transition-all flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripWizard;
