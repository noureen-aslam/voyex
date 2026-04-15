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
  user: {
    id: number;
    fullName: string;
    email: string;
  };
}

interface ApiErrorPayload {
  message?: string;
}

/**
 * Clean the Base URL: Removes trailing slashes to prevent "//api/..." double-slash errors
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const API_BASE_URL = BASE_URL.replace(/\/$/, '');

/**
 * Core fetch wrapper with improved error handling and CORS support
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // Ensure path starts with a slash
  const urlPath = path.startsWith('/') ? path : `/${path}`;
  
  const response = await fetch(`${API_BASE_URL}${urlPath}`, {
    // If you use HttpSessions in Java, 'include' is required for cookies
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  // Handle Non-200 Responses
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    
    try {
      const errorBody = (await response.json()) as ApiErrorPayload;
      if (errorBody && errorBody.message) {
        message = errorBody.message;
      }
    } catch (e) {
      // If response isn't JSON, fallback to generic status message
    }
    
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/**
 * AUTHENTICATION API
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, password: string, fullName: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName }),
  });
}

/**
 * PACKAGES API
 */
export async function getPackages(): Promise<TravelPackage[]> {
  const response = await apiFetch<{ packages: TravelPackage[] }>('/api/packages');
  return response.packages || [];
}

/**
 * TRIPS & BOOKINGS API
 */
export async function createTripBooking(payload: {
  packageId?: number;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  totalPrice: number;
}): Promise<{ bookingId: number; message: string }> {
  return apiFetch<{ bookingId: number; message: string }>('/api/trips', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMyTrips(): Promise<Trip[]> {
  const response = await apiFetch<{ trips: Trip[] }>('/api/trips');
  return response.trips || [];
}