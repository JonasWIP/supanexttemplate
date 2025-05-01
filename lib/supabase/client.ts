import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';
// Import the middleware client creation function properly
import { createServerClient } from '@supabase/ssr';

// Define types for request, response and cookie objects
interface Cookie {
  name: string;
  value: string;
  [key: string]: unknown;
}

interface RequestWithCookies {
  cookies: {
    getAll: () => Array<Cookie>;
  };
}

interface ResponseWithCookies {
  cookies: {
    set: (options: Cookie & { [key: string]: unknown }) => void;
  };
}

/**
 * Helper class to create Supabase client for browser environments
 * Safe to use in both client and server components
 */
export class SupabaseClientHelper {
  /**
   * Check if the required Supabase environment variables are available
   */
  static hasRequiredEnvVars(): boolean {
    return !!(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }

  /**
   * Creates a Supabase client for client components
   * @throws Error if environment variables are missing
   */
  static createBrowserClient(): SupabaseClient {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Your project\'s URL and Key are required to create a Supabase client!\n\nCheck your Supabase project\'s API settings to find these values\n\nhttps://supabase.com/dashboard/project/_/settings/api');
    }
    
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  /**
   * Creates a Supabase client for the middleware
   * @param request NextRequest object
   * @param response NextResponse object
   * @throws Error if environment variables are missing
   */
  static createMiddlewareClient(
    request: RequestWithCookies, 
    response: ResponseWithCookies
  ): SupabaseClient {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Your project\'s URL and Key are required to create a Supabase client!\n\nCheck your Supabase project\'s API settings to find these values\n\nhttps://supabase.com/dashboard/project/_/settings/api');
    }
    
    return createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll().map((cookie: Cookie) => ({
              name: cookie.name,
              value: cookie.value,
            }));
          },
          setAll(cookies) {
            cookies.forEach(({ name, value, ...options }) => {
              response.cookies.set({ name, value, ...options });
            });
          },
        },
      }
    );
  }
}