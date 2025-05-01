'use client';

import { useEffect } from 'react';

// Safe environment variables to expose to the client
// Only includes variables that are already meant to be public
interface ClientEnvVars {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
}

// Add environment variables to the window object for client-side access
declare global {
  interface Window {
    ENV_VARS?: ClientEnvVars;
  }
}

export function ClientEnvInitializer({ 
  envVars 
}: { 
  envVars: ClientEnvVars 
}) {
  useEffect(() => {
    // Only expose NEXT_PUBLIC_ environment variables to the client
    window.ENV_VARS = {
      NEXT_PUBLIC_SUPABASE_URL: envVars.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    };
  }, [envVars]);

  return null;
}