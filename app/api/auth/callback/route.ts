import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    // Create a response that we can modify
    const response = NextResponse.redirect(`${origin}${next}`);
    
    // Create a supabase client with the recommended cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async getAll() {
            const cookieStore = await cookies();
            return cookieStore.getAll().map((cookie) => ({
              name: cookie.name,
              value: cookie.value,
            }));
          },
          async setAll(cookiesToSet) {
            await cookies(); // We need to await cookies() even if we don't use the result
            cookiesToSet.forEach(({ name, value, ...options }) => {
              response.cookies.set({ name, value, ...options });
            });
          },
        },
      }
    );

    // Exchange the code for a session
    const { error, data: { session } } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session?.user) {
      // Extract username and full name from user metadata or email
      const username = 
        session.user.user_metadata?.username || 
        session.user.user_metadata?.name ||
        session.user.email?.split('@')[0];
        
      const fullName = 
        session.user.user_metadata?.full_name ||
        session.user.user_metadata?.name ||
        username;
        
      const avatarUrl = session.user.user_metadata?.avatar_url;

      // Use RPC to ensure profile exists with full name and avatar
      try {
        await supabase.rpc('ensure_user_profile', { 
          user_id: session.user.id,
          user_username: username || null,
          user_full_name: fullName || null,
          user_avatar_url: avatarUrl || null
        });
      } catch (error: unknown) {
        console.error('Error creating profile via RPC:', error);
      }
    }

    if (error) {
      console.error('Error exchanging code for session:', error);
    }
    
    // Return the response with cookies set
    return response;
  }

  // Redirect if no code is present
  return NextResponse.redirect(`${origin}${next}`);
}