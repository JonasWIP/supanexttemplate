'use client';

import React from 'react';
import Button from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

interface DashboardActionsProps {
  onSignOut: () => Promise<void>;
}

export default function DashboardActions({ onSignOut }: DashboardActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="danger" 
          fullWidth 
          onClick={onSignOut}
        >
          Sign Out
        </Button>
      </CardContent>
    </Card>
  );
}