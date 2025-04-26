'use client';

import React from 'react';
import Button from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/Card';
import FormAlert from '../forms/FormAlert';

// Define a more specific type for the profile data based on what we know it contains
interface ProfileData {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  [key: string]: unknown; // Allow for additional properties
}

interface RestApiTesterProps {
  userId?: string;
  onFetchProfile: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  profile: ProfileData | null;
}

export default function RestApiTester({
  userId,
  onFetchProfile,
  isLoading,
  error,
  profile
}: RestApiTesterProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>REST API Test</CardTitle>
        <CardDescription>
          Test fetching your profile using the Supabase REST API directly with proper headers.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={onFetchProfile}
          isLoading={isLoading}
          disabled={isLoading || !userId}
          fullWidth
        >
          {isLoading ? 'Loading...' : 'Fetch Profile via REST API'}
        </Button>
        
        {error && <FormAlert type="error" message={error} />}
        
        {profile && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-700 mb-2">Profile Data:</h3>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-48">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}