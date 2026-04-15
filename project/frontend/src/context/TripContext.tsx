import { createContext, useContext, useState, ReactNode } from 'react';

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
  tripData: TripData;
  updateTripData: (data: Partial<TripData>) => void;
  resetTripData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  calculateTotalCost: () => number;
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
  meals: {
    breakfast: false,
    lunch: false,
    dinner: false,
  },
  restaurants: [],
  sightseeing: [],
  aiItinerary: [],
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [tripData, setTripData] = useState<TripData>(initialTripData);
  const [currentStep, setCurrentStep] = useState(1);

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
      total += hotel.pricePerNight * hotel.nights;
    });

    const mealCount = Object.values(tripData.meals).filter(Boolean).length;
    const days = tripData.startDate && tripData.endDate ?
      Math.ceil((new Date(tripData.endDate).getTime() - new Date(tripData.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    total += mealCount * days * tripData.travelers * 300;

    tripData.sightseeing.forEach((place) => {
      total += place.price * tripData.travelers;
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
