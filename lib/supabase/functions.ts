/**
 * Utility functions for calling Supabase Edge Functions
 */

import { SupabaseClientHelper } from './client';

/**
 * Call a Supabase Edge Function
 * @param functionName The name of the function to call
 * @param options Optional request options and body
 * @returns Response from the Edge Function
 */
export async function callSupabaseFunction<T = any>(
  functionName: string,
  options?: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: any,
    headers?: Record<string, string>,
    token?: string,
    useAuth?: boolean, // Whether to automatically get auth token
  }
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    token: customToken,
    useAuth = false,
  } = options || {};

  // Use the environment variable for the Supabase URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
  }

  // Build the function URL, handling both localhost and production URLs
  const functionsUrl = supabaseUrl.includes('localhost') || supabaseUrl.includes('127.0.0.1')
    ? `${supabaseUrl}/functions/v1/${functionName}`
    : `${supabaseUrl.replace('.supabase.co', '')}/functions/v1/${functionName}`;

  // Prepare headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Get auth token if needed
  let authToken = customToken;
  
  if (useAuth && !authToken && typeof window !== 'undefined') {
    try {
      // Get client-side auth token from Supabase
      const supabase = SupabaseClientHelper.createBrowserClient();
      const { data } = await supabase.auth.getSession();
      
      if (data?.session?.access_token) {
        authToken = data.session.access_token;
      }
    } catch (error) {
      console.warn('Could not get authentication token:', error);
    }
  }

  // Add authorization header if token is available
  if (authToken) {
    requestHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  // Prepare request options
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Add body for non-GET requests
  if (method !== 'GET' && body !== undefined) {
    requestOptions.body = JSON.stringify(body);
  }

  // Call the function
  try {
    const response = await fetch(functionsUrl, requestOptions);
    
    // Check if the response is OK
    if (!response.ok) {
      const errorData = await response.text();
      try {
        const parsedError = JSON.parse(errorData);
        throw new Error(parsedError.message || parsedError.error || `HTTP error ${response.status}`);
      } catch (e) {
        throw new Error(`HTTP error ${response.status}: ${errorData || response.statusText}`);
      }
    }
    
    // Parse the response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json() as T;
    }
    
    // Return text for non-JSON responses
    return await response.text() as unknown as T;
  } catch (error) {
    console.error('Error calling Edge Function:', error);
    throw error;
  }
}