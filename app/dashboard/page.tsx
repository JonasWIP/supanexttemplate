'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, getUserProfile, signOut } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { Database } from '../../lib/database.types';
import { fetchSupabaseREST } from '../../lib/utils';
import Image from 'next/image';

// Define Auth User type separately from the database UserProfile type
type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
};

// Use generated type from database.types.ts for user profile
type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export default function DashboardPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUserData() {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser as AuthUser);
          
          // Get user profile via Supabase client
          const userProfile = await getUserProfile();
          setProfile(userProfile);
        } else {
          // Redirect to login if no user is found
          router.push('/login');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [router]);

  // Function to fetch user profile using direct REST API
  const fetchUserProfileViaREST = async () => {
    if (!user) return;
    
    setApiLoading(true);
    setError(null);
    
    try {
      const userProfile = await fetchSupabaseREST<UserProfile[]>(
        `user_profiles?select=*&id=eq.${user.id}`
      );
      
      // REST API returns an array
      if (Array.isArray(userProfile) && userProfile.length > 0) {
        setProfile(userProfile[0]);
      } else {
        setProfile(null);
        setError('No profile found');
      }
    } catch (err) {
      console.error('Error fetching via REST API:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch user profile');
    } finally {
      setApiLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">User Information</h2>
            
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <Image 
                        src={profile.avatar_url}
                        alt="User avatar"
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-2xl">👤</span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">
                      {profile?.full_name || user.email || 'User'}
                    </h3>
                    <p className="text-gray-600">
                      {profile?.username ? `@${profile.username}` : 'No username set'}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3 mt-4">
                  <div className="border-b pb-2">
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{user.email || 'No email'}</p>
                  </div>
                  
                  <div className="border-b pb-2">
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-mono text-sm break-all">{user.id}</p>
                  </div>
                  
                  {profile && (
                    <>
                      <div className="border-b pb-2">
                        <p className="text-sm text-gray-500">Created At</p>
                        <p>{profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}</p>
                      </div>
                      
                      <div className="border-b pb-2">
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p>{profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <p>No user information available</p>
            )}
          </div>
          
          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              <button
                onClick={handleSignOut}
                className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
        
        {/* REST API Demo */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">REST API Test</h2>
          <p className="text-sm text-gray-600 mb-4">
            Test fetching your profile using the Supabase REST API directly with proper headers.
          </p>
          
          <button
            onClick={fetchUserProfileViaREST}
            disabled={apiLoading || !user}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {apiLoading ? 'Loading...' : 'Fetch Profile via REST API'}
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded text-sm">
              Error: {error}
            </div>
          )}
          
          {profile && (
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">Profile Data:</h3>
              <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-48">
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}