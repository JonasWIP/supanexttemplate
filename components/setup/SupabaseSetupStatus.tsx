'use client';

import { useEffect, useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SupabaseSetupStatus() {
  const [isSetup, setIsSetup] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if Supabase is configured by checking if environment variables are available
    const hasEnvVars = typeof window !== 'undefined' && 
      !!window.ENV_VARS?.NEXT_PUBLIC_SUPABASE_URL && 
      !!window.ENV_VARS?.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
    setIsSetup(hasEnvVars);
  }, []);
  
  if (isSetup === null) {
    return null; // Loading state
  }
  
  return (
    <div className={cn(
      "flex items-center gap-2 rounded-md py-1.5 px-3",
      isSetup 
        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
        : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
    )}>
      {isSetup ? (
        <Check className="h-4 w-4 shrink-0" />
      ) : (
        <AlertTriangle className="h-4 w-4 shrink-0" />
      )}
      <span className="text-sm font-medium">
        {isSetup 
          ? "Supabase configured successfully" 
          : "Supabase not configured yet"
        }
      </span>
    </div>
  );
}