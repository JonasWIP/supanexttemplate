'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, getUserProfile, signOut } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

// Define proper types
type User = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

type UserProfile = {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUserData() {
      try {
        const currentUser = await getCurrentUser();
        // Fix the TypeScript error by ensuring currentUser is not undefined
        if (currentUser) {
          setUser(currentUser as User);
          
          const userProfile = await getUserProfile();
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, []);

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
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Dashboard</h1>
    </div>
  );
}