/**
 * Combined utility functions for the application
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Class name utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API Error handling
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Simplified fetch API function
export async function fetchApi<T = Record<string, unknown>>(url: string, options: RequestInit = {}): Promise<T> {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || response.statusText,
        data
      );
    }

    return data as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'An unexpected error occurred', { error });
  }
}

// Local storage helper functions
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
}

// Format date helper
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Function for making direct Supabase REST API calls
 * This addresses 406 Not Acceptable errors by including necessary headers
 */
export async function fetchSupabaseREST<T = Record<string, unknown>>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // Get Supabase URL and anon key from env variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseAnonKey) {
    throw new Error('Supabase anon key is not defined');
  }

  // Define the required headers for Supabase REST API
  const defaultHeaders = {
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Prefer': 'return=representation'
  };

  // Ensure URL has the correct format
  const url = path.startsWith('http') 
    ? path 
    : `${supabaseUrl}/rest/v1/${path.startsWith('/') ? path.substring(1) : path}`;

  try {
    console.log(`Fetching from Supabase REST API: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Supabase REST API error: ${response.status} ${response.statusText}`, errorText);
      throw new ApiError(
        response.status,
        `Supabase API Error: ${response.statusText}`,
        { responseText: errorText }
      );
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'An unexpected error occurred with Supabase REST API', { error });
  }
}