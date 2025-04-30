'use client';

import { useState } from 'react';
import { callSupabaseFunction } from '@/lib/supabase/functions';
import { SupabaseClientHelper } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

type FunctionResponse = {
  message: string;
  authenticated: boolean;
  timestamp: string;
  user?: { id: string; email: string };
  note?: string;
};

export default function ClientFunctionExample() {
  const [result, setResult] = useState<FunctionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useAuth, setUseAuth] = useState(true); // Default to using authentication
  
  // Check if user is signed in
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  
  // Check authentication status on component mount
  useState(() => {
    async function checkAuth() {
      try {
        const supabase = SupabaseClientHelper.createBrowserClient();
        const { data } = await supabase.auth.getSession();
        setIsSignedIn(!!data.session);
      } catch (err) {
        console.error("Error checking auth status:", err);
        setIsSignedIn(false);
      }
    }
    
    checkAuth();
  });
  
  async function handleCallFunction() {
    setLoading(true);
    setError(null);
    
    try {
      // Call the hello-world edge function with or without auth
      const response = await callSupabaseFunction<FunctionResponse>('hello-world', {
        useAuth: useAuth,
      });
      
      setResult(response);
    } catch (err) {
      console.error('Error calling Edge Function:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Card className="p-6 mt-6">
      <h2 className="text-xl font-bold mb-4">Client-Side Edge Function Call</h2>
      <p className="text-sm text-gray-600 mb-4">
        This example demonstrates calling a Supabase Edge Function from a client component.
      </p>
      
      <div className="mb-4 flex items-center space-x-2">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={useAuth}
            onChange={() => setUseAuth(!useAuth)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Include authentication token
          </span>
        </label>
        
        {isSignedIn === false && useAuth && (
          <div className="text-amber-600 text-sm ml-2">
            ⚠️ You are not signed in. Auth call will fail.
          </div>
        )}
      </div>
      
      <Button 
        onClick={handleCallFunction} 
        disabled={loading}
      >
        {loading ? 'Calling Function...' : 'Call hello-world Function'}
      </Button>
      
      {(result || error) && (
        <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-medium mb-2">Result:</h3>
          {error ? (
            <div className="text-red-600 dark:text-red-400">
              <p>Error: {error}</p>
            </div>
          ) : (
            <div>
              <div className={`mb-2 text-sm ${result?.authenticated ? 'text-green-600' : 'text-amber-600'}`}>
                Status: {result?.authenticated ? 'Authenticated ✓' : 'Public Access (Not Authenticated)'}
              </div>
              <pre className="whitespace-pre-wrap break-all bg-white dark:bg-gray-900 p-3 rounded text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
        <h3 className="font-medium mb-2">About Authentication</h3>
        <p className="text-sm mb-2">
          This example can run in two modes:
        </p>
        <ul className="list-disc pl-5 text-sm">
          <li className="mb-1">
            <strong>Authenticated:</strong> Sends your Supabase session token with the request
          </li>
          <li>
            <strong>Public:</strong> Calls the function without authentication
          </li>
        </ul>
        <p className="text-sm mt-2">
          Our Edge Function is configured to handle both authenticated and unauthenticated requests
          with different responses.
        </p>
      </div>
    </Card>
  );
}