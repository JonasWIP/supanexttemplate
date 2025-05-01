'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, getUserProfile, signOut, getUserProfileById } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { Database } from '../../lib/database.types';
import UserProfile from '@/components/dashboard/UserProfile';
import DashboardActions from '@/components/dashboard/DashboardActions';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';

// Define Auth User type separately from the database UserProfile type
type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, null>;
  app_metadata?: Record<string, null>;
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

  // Function to fetch user profile using Supabase client method instead of direct REST API
  const fetchUserProfileViaREST = async () => {
    if (!user) return;
    
    setApiLoading(true);
    setError(null);
    
    try {
      // Using the Supabase client method instead of direct REST API
      const userProfile = await getUserProfileById(user.id);
      
      if (userProfile) {
        setProfile(userProfile);
      } else {
        setProfile(null);
        setError('No profile found. Your user account might not have an associated profile record.');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
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
      <PageContainer>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg dark:text-white">Loading...</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="lg">
      <PageHeader 
        title="User Dashboard"
        description="Manage your account and access your profile information"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Information */}
        <div className="md:col-span-2 space-y-6">
          <UserProfile user={user} profile={profile} />
          <DashboardActions onSignOut={handleSignOut} />
        </div>
        
        
      </div>
    </PageContainer>
  );
}