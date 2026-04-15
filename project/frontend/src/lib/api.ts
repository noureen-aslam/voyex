export interface TravelPackage {
  id: number;
  name: string;
  destination: string;
  price: number;
  duration: string;
  imageUrl: string;
  includes: string[];
  highlights: string[];
}

export interface Trip {
  id: number;
  userId: number;
  packageId: number | null;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  totalPrice: number;
  status: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
  };
}

interface ApiErrorPayload {
  message?: string;
}

// Ensure no trailing slash in the URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_BASE_URL = BASE_URL.replace(/\/$/, '');

/**
 * Core fetch wrapper with improved error handling and CORS support
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const urlPath = path.startsWith('/') ? path : `/${path}`;
  
  const response = await fetch(`${API_BASE_URL}${urlPath}`, {
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = (await response.json()) as ApiErrorPayload;
      if (errorBody?.message) message = errorBody.message;
    } catch (e) { /* ignore */ }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const login = (email: string, password: string) => 
  apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (email: string, password: string, fullName: string) => 
  apiFetch<LoginResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName }),
  });

export const getPackages = async () => {
  const response = await apiFetch<{ packages: TravelPackage[] }>('/api/packages');
  return response.packages || [];
};

export const createTripBooking = (payload: any) => 
  apiFetch<{ bookingId: number; message: string }>('/api/trips', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getMyTrips = async () => {
  const response = await apiFetch<{ trips: Trip[] }>('/api/trips');
  return response.trips || [];
};