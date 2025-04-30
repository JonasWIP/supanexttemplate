import { createBrowserClient } from '@supabase/ssr';
import { type SupabaseClient } from '@supabase/supabase-js';

/**
 * Helper class to create Supabase client for browser environments
 * Safe to use in both client and server components
 */
export class SupabaseClientHelper {
  /**
   * Creates a Supabase client for client components
   */
  static createBrowserClient(): SupabaseClient {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Creates a Supabase client for the middleware
   * @param request NextRequest object
   * @param response NextResponse object
   */
  static createMiddlewareClient(request: any, response: any): SupabaseClient {
    // Import here to avoid issues with client components
    const { createServerClient } = require('@supabase/ssr');
    
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll().map((cookie: any) => ({
              name: cookie.name,
              value: cookie.value,
            }));
          },
          setAll(cookies) {
            cookies.forEach(({ name, value, ...options }: any) => {
              response.cookies.set({ name, value, ...options });
            });
          },
        },
      }
    );
  }
}