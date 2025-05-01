'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { uiStyles } from '@/lib/ui-styles';

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
          <div className={`w-16 h-16 rounded-full ${uiStyles.bg.secondary} overflow-hidden flex items-center justify-center`}>
            {profile?.avatar_url ? (
              <Image 
                src={profile.avatar_url}
                alt="User avatar"
                width={64}
                height={64}
                className="object-cover"
              />
            ) : (
              <span className={uiStyles.text.secondary}>👤</span>
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-lg text-foreground">
              {profile?.full_name || user.email || 'User'}
            </h3>
            <p className={uiStyles.text.secondary}>
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
    <div className={`border-b ${uiStyles.border.default.split(' ')[1]} pb-2`}>
      <p className={uiStyles.text.secondary}>{label}</p>
      <p className={`${isMonospaced ? 'font-mono text-sm break-all' : ''} ${uiStyles.text.primary}`}>
        {value}
      </p>
    </div>
  );
}