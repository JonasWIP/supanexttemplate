// middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  console.log(`🔍 Middleware checking route: ${request.nextUrl.pathname}`);
  
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create a Supabase client using the recommended pattern
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string) {
          request.cookies.delete(name);
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.delete(name);
        },
      },
    }
  );

  try {
    // Get the current path from the URL
    const path = request.nextUrl.pathname;
    
    // Check if we're already on the login page or other public routes to prevent redirect loops
    const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
    const apiRoutes = ['/api/auth'];
    
    // Check for exact match on root path or startsWith for other paths
    const isPublicRoute = 
      path === '/' || 
      publicRoutes.some(route => path === route || path.startsWith(`${route}/`)) ||
      apiRoutes.some(route => path.startsWith(route));
      
    if (isPublicRoute) {
      console.log(`📢 Path "${path}" is a public route, skipping auth check`);
      return response;
    }

    console.log(`🔒 Path "${path}" is protected, checking authentication...`);
    
    // Check if user is authenticated
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error(`❌ Authentication error: ${error.message}`);
    }

    if (!user) {
      console.log(`🚫 No authenticated user found, redirecting to login`);
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    
    console.log(`✅ User authenticated: ${user.id} (${user.email || 'no email'}), continuing to ${path}`);
  } catch (error) {
    console.error(`💥 Middleware error: ${error instanceof Error ? error.message : String(error)}`);
    // On error, just continue without redirecting
  }

  console.log(`➡️ Middleware completed for ${request.nextUrl.pathname}`);
  return response;
}

// Add a matcher that defines which routes the middleware should run on
export const config = {
  matcher: [
    // Explicitly protect the dashboard route
    '/dashboard/:path*',
    
    // Match other routes except for:
    // - _next (Next.js internals)
    // - Public files (_static, robots.txt, favicon.ico, etc.)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$).*)',
  ],
}
