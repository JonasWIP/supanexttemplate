'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

type UserProfileProps = {
  user: {
    id: string;
    email?: string;
  } | null;
  profile: {
    id: string; 
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    created_at: string | null;
    updated_at: string | null;
  } | null;
};

export default function UserProfile({ user, profile }: UserProfileProps) {
  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          <ProfileField label="Email" value={user.email || 'No email'} />
          <ProfileField label="User ID" value={user.id} isMonospaced />
          
          {profile && (
            <>
              <ProfileField 
                label="Created At"
                value={profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
              />
              <ProfileField 
                label="Last Updated"
                value={profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Never'}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type ProfileFieldProps = {
  label: string;
  value: string;
  isMonospaced?: boolean;
};

function ProfileField({ label, value, isMonospaced = false }: ProfileFieldProps) {
  return (
    <div className="border-b pb-2">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={isMonospaced ? 'font-mono text-sm break-all' : ''}>
        {value}
      </p>
    </div>
  );
}