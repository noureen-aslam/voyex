import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// 1. Define the User interface based on your API response
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
  
  // Auth State (Added this!)
  user: User | null;
  loginUser: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

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

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [tripData, setTripData] = useState<TripData>(initialTripData);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Initialize user from localStorage if it exists
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('voyexUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // --- Auth Actions ---
  const loginUser = (userData: User) => {
    localStorage.setItem('voyexUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('voyexUser');
    setUser(null);
  };

  // --- Trip Actions ---
  const updateTripData = (data: Partial<TripData>) => {
    setTripData((prev) => ({ ...prev, ...data }));
  };

  const resetTripData = () => {
    setTripData(initialTripData);
    setCurrentStep(1);
  };

  const calculateTotalCost = () => {
    let total = 0;
    if (tripData.vehicle) {
      total += tripData.vehicle.pricePerKm * tripData.vehicle.distance;
    }
    tripData.hotels.forEach((hotel) => {
      total += (hotel.pricePerNight || 0) * (hotel.nights || 1);
    });

    const mealCount = Object.values(tripData.meals).filter(Boolean).length;
    const days = tripData.startDate && tripData.endDate ?
      Math.ceil((new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    
    // Logic: meals * days * travelers * average price (300)
    total += mealCount * (days || 1) * tripData.travelers * 300;

    tripData.sightseeing.forEach((place) => {
      total += (place.price || 0) * tripData.travelers;
    });

    return total;
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
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTripContext must be used within TripProvider');
  }
  return context;
};