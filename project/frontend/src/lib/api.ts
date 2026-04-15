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

// Explicitly point to Tomcat if no env variable is found
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = (await response.json()) as ApiErrorPayload;
      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // Use the generic message.
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// NEW: Registration function to enable Sign Up
export async function register(email: string, password: string, fullName: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, fullName }),
  });
}

export async function getPackages(): Promise<TravelPackage[]> {
  const response = await apiFetch<{ packages: TravelPackage[] }>('/api/packages');
  return response.packages;
}

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
  return response.trips;
}