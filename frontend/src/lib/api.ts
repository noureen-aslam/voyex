// --- Interfaces ---

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
  // Added fields to match updated backend
  guestName?: string;
  phoneNumber?: string;
  address?: string;
  transactionId?: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T; // For generic wrapping
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

// --- Configuration ---

// Ensure we don't have trailing slashes
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://voyex.onrender.com';
const API_BASE_URL = BASE_URL.replace(/\/$/, '');

/**
 * Helper to get user data safely from LocalStorage
 */
const getStoredUser = (): User | null => {
  const data = localStorage.getItem("user");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

/**
 * Core fetch wrapper
 * Handles Auth headers, Credentials for JSESSIONID, and Error parsing.
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const urlPath = path.startsWith('/') ? path : `/${path}`;
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${urlPath}`, {
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });

  // Handle non-200 responses
  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch (e) { /* ignore parse error */ }
    
    if (response.status === 401) {
      console.warn("Session expired. Clearing storage...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

// --- API Actions ---

/**
 * Authenticates user and saves credentials
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await apiFetch<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (response.success && response.token) {
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
  }

  return response;
};

/**
 * Registers a new user
 */
export const register = (email: string, password: string, fullName: string) => 
  apiFetch<LoginResponse>('/api/auth/register', { 
    method: 'POST', 
    body: JSON.stringify({ email, password, fullName }) 
  });

/**
 * Fetches trips for the logged-in user
 */
export const getMyTrips = async (): Promise<Trip[]> => {
  const user = getStoredUser();
  if (!user) return [];

  try {
    const response = await apiFetch<any>(`/api/trips?userId=${user.id}`);
    
    // Handle the { trips: [...] } wrapper used in the Java Servlet
    if (response.trips && Array.isArray(response.trips)) {
      return response.trips;
    }
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Fetch trips failed:", error);
    return [];
  }
};

/**
 * Creates a new trip booking (Passenger Details included in payload)
 */
export const createTripBooking = (payload: any) => {
  const user = getStoredUser();
  return apiFetch<any>('/api/trips', { 
    method: 'POST', 
    body: JSON.stringify({ 
      ...payload, 
      userId: user?.id 
    }) 
  });
};

/**
 * Confirms payment with the PaymentServlet
 */
export const confirmTripPayment = (bookingId: string | number) => {
  // Removes 'VOYEX' prefix if present before sending to Java
  const numericId = String(bookingId).replace('VOYEX', '');
  
  return apiFetch<any>('/api/payments/confirm', {
    method: 'POST',
    body: JSON.stringify({ bookingId: numericId })
  });
};

/**
 * Fetches available travel packages
 */
export const getPackages = () => 
  apiFetch<{ packages: TravelPackage[] }>('/api/packages')
    .then(res => res.packages || []);

/**
 * Logout helper
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = '/login';
};