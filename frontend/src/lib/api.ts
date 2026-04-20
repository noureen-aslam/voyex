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

// --- Configuration ---

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
 * Ensures Java Sessions (JSESSIONID) and Auth tokens are handled correctly.
 */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const urlPath = path.startsWith('/') ? path : `/${path}`;
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${urlPath}`, {
    // IMPORTANT: 'include' allows Java Sessions/Cookies to work across domains
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch (e) { /* ignore parse error */ }
    
    // If 401 Unauthorized, we might want to clear local storage
    if (response.status === 401) {
      console.warn("Session expired or unauthorized.");
    }
    
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

// --- API Actions ---

/**
 * Authenticates user and saves both the Session Token and User Object
 */
export const login = async (email: string, password: string) => {
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
 * Fetches trips specifically for the logged-in user
 */
export const getMyTrips = async (): Promise<Trip[]> => {
  const user = getStoredUser();
  
  if (!user) {
    console.error("Cannot fetch trips: No user found in storage.");
    return [];
  }

  try {
    // We pass userId as a query param to match your Java Servlet doGet
    const response = await apiFetch<any>(`/api/trips?userId=${user.id}`);
    
    // Handling Java Map.of("trips", trips) format
    if (response.trips && Array.isArray(response.trips)) {
      return response.trips;
    }
    
    // Fallback if backend returns raw array
    if (Array.isArray(response)) {
      return response;
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch trips:", error);
    return [];
  }
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
 * Fetches available travel packages
 */
export const getPackages = () => 
  apiFetch<{ packages: TravelPackage[] }>('/api/packages')
    .then(res => res.packages || []);

/**
 * Creates a new trip booking, automatically attaching the userId
 */
export const createTripBooking = (payload: any) => {
  const user = getStoredUser();
  return apiFetch<any>('/api/trips', { 
    method: 'POST', 
    body: JSON.stringify({ 
      ...payload, 
      userId: user?.id // Auto-inject ID from storage
    }) 
  });
};