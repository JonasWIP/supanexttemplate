import { callSupabaseFunction } from '@/lib/supabase/functions';
import { SupabaseServerHelper } from '@/lib/supabase/server-client';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import ClientFunctionExample from './ClientFunctionExample';

// This ensures the page is always fetched from the server
export const dynamic = 'force-dynamic';

export default async function FunctionCallExample() {
  let result = null;
  let error = null;

  try {
    // Get server-side Supabase client
    const supabase = await SupabaseServerHelper.createServerClient();
    
    // Get user session (if authenticated)
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    // Call the hello-world edge function
    // If token is available, pass it; otherwise call without authentication
    result = await callSupabaseFunction('hello-world', {
      token: token // This will be undefined if not authenticated
    });
  } catch (err) {
    console.error('Error calling Edge Function:', err);
    error = err instanceof Error ? err.message : 'Unknown error occurred';
  }

  return (
    <PageContainer>
      <PageHeader title="Supabase Edge Function Example" />
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Server-Side Edge Function Call</h2>
          <p className="text-sm text-gray-600 mb-4">
            This example demonstrates calling a Supabase Edge Function from a server component.
          </p>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
            <h3 className="font-medium mb-2">Result:</h3>
            {error ? (
              <div className="text-red-600 dark:text-red-400">
                <p>Error: {error}</p>
                <p className="mt-2 text-sm">
                  Note: You may need to deploy the function first with: 
                  <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded">
                    npx supabase functions deploy hello-world
                  </code>
                </p>
              </div>
            ) : (
              <div>
                <div className={`mb-2 text-sm ${result?.authenticated ? 'text-green-600' : 'text-amber-600'}`}>
                  Status: {result?.authenticated ? 'Authenticated ✓' : 'Public Access (Not Authenticated)'}
                </div>
                <pre className="whitespace-pre-wrap break-all bg-white dark:bg-gray-900 p-3 rounded">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </Card>

        {/* Add the client-side example */}
        <ClientFunctionExample />

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">How Edge Functions Work</h2>
          
          <div className="space-y-4">
            <section>
              <h3 className="font-semibold">Local Development</h3>
              <p>For local development, Edge Functions are available at:</p>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2">
                http://localhost:54321/functions/v1/hello-world
              </code>
            </section>

            <section>
              <h3 className="font-semibold">Production</h3>
              <p>In production, Edge Functions are available at:</p>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2">
                https://your-project-ref.supabase.co/functions/v1/hello-world
              </code>
            </section>

            <section>
              <h3 className="font-semibold">Deploying Functions</h3>
              <p>To deploy your Edge Function to production:</p>
              <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2">
                npx supabase functions deploy hello-world
              </code>
              <p className="text-sm mt-2">
                Make sure you have linked your local project to your Supabase project first with:
                <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2">
                  npx supabase link --project-ref your-project-ref
                </code>
              </p>
            </section>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}