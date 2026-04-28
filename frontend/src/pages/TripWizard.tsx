import { motion, AnimatePresence } from 'framer-motion';
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripContext } from '../context/TripContext';
import { MapPin, Calendar, Users, DollarSign, Car, Hotel, UtensilsCrossed, Map as MapIcon, Check, Loader, ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { destinations, vehicles, hotels, restaurants, sightseeing, travelVibes } from '../data/mockData';

type ItineraryActivity = {
  time: string;
  activity: string;
  location: string;
};

type ItineraryDay = {
  day: number;
  title: string;
  activities: ItineraryActivity[];
};

const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Hyderabad: { lat: 17.3850, lng: 78.4867 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Goa: { lat: 15.2993, lng: 74.1240 },
  Manali: { lat: 32.2396, lng: 77.1887 },
  Kerala: { lat: 9.4981, lng: 76.3388 },
  Udaipur: { lat: 24.5854, lng: 73.7125 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Shimla: { lat: 31.1048, lng: 77.1734 },
  Rishikesh: { lat: 30.0869, lng: 78.2676 },
  'Leh Ladakh': { lat: 34.1526, lng: 77.5770 },
};

const originCities = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad'];

const calculateDistanceKm = (originCity: string, destinationName: string, fallbackDistance = 0) => {
  const origin = cityCoordinates[originCity];
  const destination = cityCoordinates[destinationName];

  if (!origin || !destination) return fallbackDistance;

  const toRadians = (value: number) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latDiff = toRadians(destination.lat - origin.lat);
  const lngDiff = toRadians(destination.lng - origin.lng);
  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(toRadians(origin.lat)) * Math.cos(toRadians(destination.lat)) *
      Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(earthRadiusKm * c * 1.25);
};

const TripWizard = () => {
  const { tripData, updateTripData, currentStep, setCurrentStep, calculateTotalCost } = useTripContext();
  const navigate = useNavigate();
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);

  const budgetOptions = ['Budget', 'Standard', 'Luxury', 'Ultra Premium'];
  const selectedDestination = destinations.find((dest) => dest.name === tripData.destination);
  const computedDistance = selectedDestination
    ? calculateDistanceKm(tripData.originCity, selectedDestination.name, selectedDestination.distance)
    : 0;

  const getTripDays = (startDate = tripData.startDate, endDate = tripData.endDate) => {
    if (!startDate || !endDate) return 1;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    return Math.max(1, dayCount);
  };

  const getHotelNights = (startDate = tripData.startDate, endDate = tripData.endDate) =>
    Math.max(1, getTripDays(startDate, endDate));

  const buildMealStops = (destinationRestaurants: typeof restaurants, hotelName: string) => {
    const mealStops: ItineraryActivity[] = [];

    if (tripData.meals.breakfast) {
      mealStops.push({
        time: '8:00 AM',
        activity: 'Breakfast',
        location: hotelName,
      });
    }

    if (tripData.meals.lunch) {
      mealStops.push({
        time: '1:00 PM',
        activity: 'Lunch',
        location: destinationRestaurants[0]?.name || `${tripData.destination} Local Restaurant`,
      });
    }

    if (tripData.meals.dinner) {
      mealStops.push({
        time: '8:00 PM',
        activity: 'Dinner',
        location: destinationRestaurants[1]?.name || destinationRestaurants[0]?.name || `${tripData.destination} Dinner Spot`,
      });
    }

    return mealStops;
  };

  const buildDynamicItinerary = (): ItineraryDay[] => {
    const tripDays = getTripDays();
    const hotelName = tripData.hotels[0]?.name || `Your stay in ${tripData.destination}`;
    const destinationRestaurants = restaurants.filter((restaurant) => restaurant.location === tripData.destination);
    const selectedSightseeing = tripData.sightseeing.length
      ? tripData.sightseeing
      : sightseeing.filter((place) => place.location === tripData.destination).slice(0, Math.max(1, tripDays));
    const selectedVibes = tripData.vibes.length ? tripData.vibes : ['Relaxation'];
    const mealStops = buildMealStops(destinationRestaurants, hotelName);

    return Array.from({ length: tripDays }, (_, index) => {
      const day = index + 1;
      const place = selectedSightseeing[index % Math.max(selectedSightseeing.length, 1)];
      const vibe = selectedVibes[index % selectedVibes.length];
      const activities: ItineraryActivity[] = [];

      if (day === 1) {
        activities.push({
          time: '10:00 AM',
          activity: `Travel from ${tripData.originCity || 'your city'} to ${tripData.destination}`,
          location: `${tripData.originCity || 'Origin'} to ${tripData.destination} (${computedDistance} km)`,
        });
        activities.push({
          time: '11:30 AM',
          activity: 'Hotel Check-in',
          location: hotelName,
        });
      } else {
        activities.push({
          time: '9:00 AM',
          activity: `${vibe} morning`,
          location: hotelName,
        });
      }

      activities.push(...mealStops);

      if (place) {
        activities.push({
          time: day === 1 ? '3:00 PM' : '11:00 AM',
          activity: `Explore ${place.name}`,
          location: place.name,
        });
      }

      if (vibe === 'Adventure') {
        activities.push({
          time: '4:30 PM',
          activity: 'Adventure session',
          location: place?.name || tripData.destination,
        });
      } else if (vibe === 'Culture' || vibe === 'Spiritual') {
        activities.push({
          time: '4:30 PM',
          activity: `${vibe} exploration`,
          location: place?.name || tripData.destination,
        });
      } else if (vibe === 'Photography' || vibe === 'Nature') {
        activities.push({
          time: '5:30 PM',
          activity: 'Golden hour visit',
          location: place?.name || tripData.destination,
        });
      } else if (vibe === 'Nightlife') {
        activities.push({
          time: '9:30 PM',
          activity: 'Night outing',
          location: destinationRestaurants[0]?.name || `${tripData.destination} city center`,
        });
      }

      if (day === tripDays) {
        activities.push({
          time: '6:00 PM',
          activity: 'Return journey',
          location: `${tripData.destination} to ${tripData.originCity || 'your city'}`,
        });
      }

      return {
        day,
        title: `${vibe} day in ${tripData.destination}`,
        activities,
      };
    });
  };

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
      updateTripData({ aiItinerary: buildDynamicItinerary() });
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
                        onClick={() =>
                          updateTripData({
                            destination: dest.name,
                            hotels: [],
                            sightseeing: [],
                            aiItinerary: [],
                            vehicle: tripData.vehicle
                              ? {
                                  ...tripData.vehicle,
                                  distance: calculateDistanceKm(tripData.originCity, dest.name, dest.distance),
                                }
                              : null,
                          })
                        }
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
                      <label className="text-gray-400 text-sm mb-2 block">Pickup City</label>
                      <div className="flex items-center space-x-2 bg-dark-lighter/50 rounded-lg px-4 py-3 border border-white/10">
                        <MapPin className="w-5 h-5 text-brand-cyan" />
                        <select
                          value={tripData.originCity}
                          onChange={(e) => {
                            const nextOrigin = e.target.value;
                            updateTripData({
                              originCity: nextOrigin,
                              aiItinerary: [],
                              vehicle: selectedDestination && tripData.vehicle
                                ? {
                                    ...tripData.vehicle,
                                    distance: calculateDistanceKm(nextOrigin, selectedDestination.name, selectedDestination.distance),
                                  }
                                : tripData.vehicle,
                            });
                          }}
                          className="bg-transparent border-none outline-none text-white w-full"
                        >
                          <option value="" className="bg-slate-900">Select your city</option>
                          {originCities.map((city) => (
                            <option key={city} value={city} className="bg-slate-900">
                              {city}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">Check In Date</label>
                      <div className="flex items-center space-x-2 bg-dark-lighter/50 rounded-lg px-4 py-3 border border-white/10">
                        <Calendar className="w-5 h-5 text-brand-cyan" />
                        <input
                          type="date"
                          value={tripData.startDate}
                          onChange={(e) =>
                            updateTripData({
                              startDate: e.target.value,
                              aiItinerary: [],
                              hotels: tripData.hotels.map((hotel) => ({
                                ...hotel,
                                nights: getHotelNights(e.target.value, tripData.endDate),
                              })),
                            })
                          }
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
                          onChange={(e) =>
                            updateTripData({
                              endDate: e.target.value,
                              aiItinerary: [],
                              hotels: tripData.hotels.map((hotel) => ({
                                ...hotel,
                                nights: getHotelNights(tripData.startDate, e.target.value),
                              })),
                            })
                          }
                          className="bg-transparent border-none outline-none text-white w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 h-64 bg-dark-lighter/30 rounded-xl border border-white/10 flex items-center justify-center">
                    <div className="text-center">
                      <MapIcon className="w-12 h-12 text-brand-cyan mx-auto mb-2" />
                      <p className="text-gray-400">Map Preview</p>
                      {selectedDestination && (
                        <div className="text-sm mt-2 space-y-1">
                          <p className="text-brand-cyan">
                            Estimated route: {computedDistance} km
                          </p>
                          {tripData.originCity && (
                            <p className="text-gray-400">
                              Route: {tripData.originCity} to {selectedDestination.name}
                            </p>
                          )}
                        </div>
                      )}
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
                      const estimatedCost = vehicle.pricePerKm * (tripData.vehicle?.distance || computedDistance || 0);

                      return (
                        <div
                          key={vehicle.id}
                          onClick={() =>
                            updateTripData({
                              vehicle: {
                                type: vehicle.type,
                                pricePerKm: vehicle.pricePerKm,
                                distance: tripData.vehicle?.distance || computedDistance || 0,
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
                                    : [...tripData.hotels, { ...hotel, nights: getHotelNights() }];
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

                    <p className="text-sm text-gray-400 mb-4">
                      The itinerary uses your pickup city, destination, dates, vibes, meals, hotels, and sightseeing choices.
                    </p>

                    {tripData.aiItinerary.length > 0 && (
                      <div className="space-y-4">
                        {tripData.aiItinerary.map((day) => (
                          <div key={day.day} className="bg-dark-lighter/30 rounded-xl p-4 border border-white/10">
                            <h5 className="text-white font-bold mb-3">
                              Day {day.day}: {day.title}
                            </h5>
                            <div className="space-y-2">
                              {day.activities.map((activity: { time: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; activity: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; location: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }, i: Key | null | undefined) => (
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
                                <span className="text-gray-400 text-sm">Pickup City</span>
                                <div className="text-white font-semibold">{tripData.originCity || 'Not selected'}</div>
                              </div>
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
                            {tripData.originCity && tripData.destination && (
                              <div className="text-gray-500 text-sm mt-1">
                                {tripData.originCity} to {tripData.destination}
                              </div>
                            )}
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
