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

export interface User {
  id: number;
  fullName: string;
  email: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

interface ApiErrorPayload {
  message?: string;
}

// 1. Base URL Configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://voyex.onrender.com';
const API_BASE_URL = BASE_URL.replace(/\/$/, '');

/**
 * Core fetch wrapper
 * Fixed: Now retrieves the token INSIDE the function call to avoid 401 errors.
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const urlPath = path.startsWith('/') ? path : `/${path}`;
  
  // Always get the most recent token from storage
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${urlPath}`, {
    credentials: 'omit',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = (await response.json()) as ApiErrorPayload;
      if (errorBody?.message) message = errorBody.message;
    } catch (e) { /* ignore json parse error */ }
    
    // Special handling for 401s to help debugging
    if (response.status === 401) {
       console.error("Auth Error: Token is missing or invalid.");
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

// 2. Authentication Actions
export const login = async (email: string, password: string) => {
  const response = await apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (response.token) {
    localStorage.setItem("token", response.token);
  }

  return response;
};

export const register = (email: string, password: string, fullName: string) => 
  apiFetch<LoginResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName }),
  });

// 3. Data Actions
export const getPackages = async () => {
  const response = await apiFetch<{ packages: TravelPackage[] }>('/api/packages');
  return response.packages || [];
};

export const createTripBooking = (payload: any) => 
  apiFetch<{ bookingId: number; message: string }>('/api/trips', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

/**
 * Fixed: Added a fallback in case your backend returns a raw array 
 * instead of an object with a "trips" key.
 */
export const getMyTrips = async (): Promise<Trip[]> => {
  const response = await apiFetch<any>('/api/trips');
  
  // If backend returns { trips: [...] }
  if (response.trips && Array.isArray(response.trips)) {
    return response.trips;
  }
  
  // If backend returns [...] directly
  if (Array.isArray(response)) {
    return response;
  }

  return [];
};