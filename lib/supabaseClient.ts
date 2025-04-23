import { createClient } from '@supabase/supabase-js'
import type { Database } from './types.generated'

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to get the current user
export async function getCurrentUser() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user
}

// Helper function to get the current user's profile
export async function getCurrentUserProfile() {
  const user = await getCurrentUser()
  
  if (!user) {
    return null
  }
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single()
    
  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
  
  return data
}

// Helper function to check if a feature flag is enabled
export async function isFeatureEnabled(featureName: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('feature_flags')
    .select('enabled')
    .eq('name', featureName)
    .single()
    
  if (error || !data) {
    console.error('Error fetching feature flag:', error)
    return false
  }
  
  return data.enabled
}