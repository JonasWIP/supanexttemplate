import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
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
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}${next}`);
}