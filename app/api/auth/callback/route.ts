import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Helper function to create a user profile manually
async function createUserProfileIfNeeded(supabase: any, userId: string, userData: any) {
  try {
    // Check if profile exists first
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    // Only create if no profile exists
    if (!existingProfile) {
      console.log(`Creating profile for user ${userId}`);
      
      // Extract username or name from user metadata
      const username = userData.user_metadata?.username || 
                       userData.user_metadata?.name ||
                       userData.user_metadata?.full_name;
                       
      // Extract avatar from user metadata
      const avatarUrl = userData.user_metadata?.avatar_url;
      
      // Prepare profile data
      const profileData = {
        id: userId,
        username: username || null,
        avatar_url: avatarUrl || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Insert the profile
      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData);
        
      if (error) {
        console.error('Error creating user profile in callback:', error);
      }
    }
  } catch (err) {
    console.error('Error in profile creation:', err);
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
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
    const { data } = await supabase.auth.exchangeCodeForSession(code);
    
    // If we have a user, ensure they have a profile
    if (data?.user) {
      await createUserProfileIfNeeded(supabase, data.user.id, data.user);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/dashboard', request.url));
}