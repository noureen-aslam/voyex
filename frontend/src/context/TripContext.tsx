import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// 1. Interfaces
interface User {
  id: number;
  fullName: string;
  email: string;
}

interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: string;
  vibes: string[];
  vehicle: {
    type: string;
    pricePerKm: number;
    distance: number;
  } | null;
  hotels: any[];
  meals: {
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
  };
  restaurants: any[];
  sightseeing: any[];
  aiItinerary: any[];
}

interface TripContextType {
  // Trip State
  tripData: TripData;
  updateTripData: (data: Partial<TripData>) => void;
  resetTripData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  calculateTotalCost: () => number;
  
  // Auth State
  user: User | null;
  loginUser: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;

  // Payment/Booking Sync
  activeBookingId: string | null;
  setActiveBookingId: (id: string | null) => void;
}

// 2. Initial States
const initialTripData: TripData = {
  destination: '',
  startDate: '',
  endDate: '',
  travelers: 2,
  budget: '',
  vibes: [],
  vehicle: null,
  hotels: [],
  meals: { breakfast: false, lunch: false, dinner: false },
  restaurants: [],
  sightseeing: [],
  aiItinerary: [],
};

const TripContext = createContext<TripContextType | undefined>(undefined);

// 3. Provider Component
export const TripProvider = ({ children }: { children: ReactNode }) => {
  // --- States ---
  const [tripData, setTripData] = useState<TripData>(initialTripData);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('voyexUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // --- Effects ---
  useEffect(() => {
    if (user) {
      localStorage.setItem('voyexUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('voyexUser');
    }
  }, [user]);

  // --- Auth Actions ---
  const loginUser = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  // --- Trip Actions ---
  const updateTripData = (data: Partial<TripData>) => {
    setTripData((prev) => ({ ...prev, ...data }));
  };

  const resetTripData = () => {
    setTripData(initialTripData);
    setCurrentStep(1);
    setActiveBookingId(null);
  };

  const calculateTotalCost = () => {
    let total = 0;
    
    // 1. Vehicle Cost
    if (tripData.vehicle) {
      total += tripData.vehicle.pricePerKm * tripData.vehicle.distance;
    }

    // 2. Hotels Cost
    tripData.hotels.forEach((hotel) => {
      total += (hotel.pricePerNight || 0) * (hotel.nights || 1);
    });

    // 3. Meals Cost
    const mealCount = Object.values(tripData.meals).filter(Boolean).length;
    const days = tripData.startDate && tripData.endDate ?
      Math.ceil((new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    total += mealCount * (days || 1) * tripData.travelers * 300;

    // 4. Sightseeing Cost
    tripData.sightseeing.forEach((place) => {
      total += (place.price || 0) * tripData.travelers;
    });

    // 5. Default base if nothing selected yet
    return total > 0 ? total : 5000 + (tripData.travelers * 1200);
  };

  return (
    <TripContext.Provider
      value={{
        tripData,
        updateTripData,
        resetTripData,
        currentStep,
        setCurrentStep,
        calculateTotalCost,
        user,
        loginUser,
        logout,
        isAuthenticated: !!user,
        activeBookingId,
        setActiveBookingId,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

// 4. Hook
export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within TripProvider');
  }
  return context;
};