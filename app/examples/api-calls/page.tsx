import { SupabaseServerHelper } from '@/lib/supabase/server-client';
import { Card } from '@/components/ui/Card';
import PageHeader from '@/components/layout/PageHeader';
import PageContainer from '@/components/layout/PageContainer';
import ClientApiExample from './ClientApiExample';
import { createServerApiClient } from '@/lib/api';

// Type definition for our API response
interface ExternalApiResponse {
  id: string;
  name: string;
  description: string | null;
  [key: string]: unknown;
}

// Force dynamic to ensure the page is always server-rendered
export const dynamic = 'force-dynamic';

// Server-side API call function
async function fetchExternalApi(): Promise<ExternalApiResponse[]> {
  try {
    // Create a server API client that can use server-only environment variables
    const apiClient = createServerApiClient();
    
    // Make the API call
    const data = await apiClient.fetch<ExternalApiResponse[]>(
      'https://jsonplaceholder.typicode.com/users', {
        // Optional: set cache settings
        cache: process.env.NODE_ENV === 'production' ? 'force-cache' : 'no-store',
        // Optional: set timeout for slow APIs
        timeout: 5000,
        // Optional: retry logic
        retry: { attempts: 2, delayMs: 1000 },
      }
    );
    
    // Only return the first 3 items for simplicity
    return data.slice(0, 3);
  } catch (error) {
    console.error('Error fetching from external API:', error);
    return []; // Return empty array on error
  }
}

// Server Component
export default async function ApiCallsExample() {
  // Call external API on the server
  const apiData = await fetchExternalApi();
  const serverTimestamp = new Date().toISOString();

  // Get user info if authenticated (optional)
  const supabase = await SupabaseServerHelper.createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <PageContainer>
      <PageHeader title="External API Calls Example" />
      
      <div className="space-y-6">
        <Card className="p-6 border-l-4 border-green-500">
          <h2 className="text-xl font-bold mb-4">Server-Side API Call</h2>
          <p className="mb-4">
            This section shows data fetched from an external API on the server before the page is sent to the browser.
            The API request is not visible in the browser's network tab because it happens on the server.
          </p>
          
          <div className="mb-2">
            <div className="text-sm text-gray-500">Generated at: {serverTimestamp}</div>
            <div className="text-sm text-gray-500">User: {user ? user.email : 'Not logged in'}</div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">API Response:</h3>
            {apiData.length > 0 ? (
              <div className="bg-gray-100 dark:bg-gray-800 rounded p-4">
                <ul className="space-y-2">
                  {apiData.map((item) => (
                    <li key={item.id} className="border-b pb-2 border-gray-200 dark:border-gray-700">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">ID: {item.id}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-amber-600">No data received from API</div>
            )}
          </div>

          <div className="mt-6 bg-green-50 dark:bg-green-900/20 p-4 rounded text-sm">
            <h4 className="font-medium mb-1">Benefits of server-side API calls:</h4>
            <ul className="list-disc ml-5 space-y-1">
              <li>API keys and secrets can remain secure (not exposed to client)</li>
              <li>Reduces client-side JavaScript bundle size</li>
              <li>Content is ready on initial page load (better SEO)</li>
              <li>Can aggregate multiple API calls before rendering</li>
              <li>Works without JavaScript enabled in the browser</li>
            </ul>
          </div>
        </Card>

        {/* Client-side API example will be inserted here */}
        <ClientApiExample serverDataCount={apiData.length} />
      </div>
    </PageContainer>
  );
}