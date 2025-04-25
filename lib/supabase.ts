import { createBrowserClient } from '@supabase/ssr';

// Supabase client setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a Supabase client
export const getSupabaseClient = () => {
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
};

// Auth helpers
export async function getCurrentUser() {
  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user;
}

export async function getUserProfile() {
  const user = await getCurrentUser();
  
  if (!user) {
    return null;
  }
  
  const supabase = getSupabaseClient();
  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();
    
  return data;
}

export async function signOut() {
  const supabase = getSupabaseClient();
  return supabase.auth.signOut();
}

// Data fetching helpers
export async function fetchFromTable<T = Record<string, unknown>>(
  tableName: string,
  options?: {
    select?: string;
    eq?: [string, unknown];
    limit?: number;
    order?: [string, { ascending?: boolean }];
  }
) {
  const supabase = getSupabaseClient();
  
  let query = supabase
    .from(tableName)
    .select(options?.select || '*');
    
  if (options?.eq) {
    query = query.eq(options.eq[0], options.eq[1]);
  }
  
  if (options?.order) {
    query = query.order(options.order[0], options.order[1]);
  }
  
  if (options?.limit) {
    query = query.limit(options.limit);
  }
  
  const { data, error } = await query;
  
  if (error) {
    throw error;
  }
  
  return data as T;
}