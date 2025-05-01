import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SupabaseSetupStatus } from '@/components/setup/SupabaseSetupStatus';
import { ClientEnvInitializer } from '@/components/setup/ClientEnvInitializer';
import { SetupStepStatus } from '@/components/setup/SetupStepStatus';

export default function HomePage() {
  // Pass environment variables to client (only NEXT_PUBLIC_ ones)
  const clientEnvVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  };

  // Check if Supabase is configured by checking if environment variables are available
  const isSupabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  return (
    <PageContainer maxWidth="xl">
      <ClientEnvInitializer envVars={clientEnvVars} />
      
      <PageHeader 
        title="Welcome to SupaNext Template"
        description="A modern, production-ready template using Next.js and Supabase with TypeScript and Tailwind CSS."
      >
        <div className="flex flex-wrap gap-3 mt-4">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-900">Next.js 15</Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900">Supabase</Badge>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900">TypeScript</Badge>
          <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-cyan-900">Tailwind CSS</Badge>
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900">shadcn/ui</Badge>
          <Badge variant="secondary" className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 hover:bg-rose-100 dark:hover:bg-rose-900">Jest</Badge>
        </div>
        
        {/* Supabase setup status indicator */}
        <div className="mt-4">
          <SupabaseSetupStatus />
        </div>
      </PageHeader>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Project Setup Guide</span>
              {/* Overall setup progress */}
              <div className="flex gap-2 items-center text-sm">
                <span className="text-muted-foreground">Setup Status:</span>
                <SetupStepStatus
                  isCompleted={isSupabaseConfigured}
                  title={isSupabaseConfigured ? "Complete" : "Pending"}
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative">
              <h3 className="text-xl font-medium mb-2">Project Creation</h3>
              <p className="mb-3">Create a new project using the template:</p>
              <pre className="bg-muted p-3 rounded overflow-x-auto text-sm">
                <code>{`npx create-supabase-next <your-project-name>
cd <your-project-name>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2 flex items-center gap-2">
                <span>Local Development Setup</span>
                <SetupStepStatus
                  isCompleted={isSupabaseConfigured}
                  title=""
                  className="ml-2"
                />
              </h3>
              
              <div className="pl-4 border-l-2 border-muted-foreground/20 space-y-4 mt-4">
                <div>
                  <h4 className="text-lg font-medium mb-2">1. Start Supabase Locally</h4>
                  <p className="mb-3">Ensure Docker is running, then start Supabase:</p>
                  <pre className="bg-muted p-3 rounded overflow-x-auto text-sm">
                    <code>npm run supabase:start</code>
                  </pre>
                  <p className="mt-2">You can access the Supabase Studio at <a href="http://127.0.0.1:54323" target="_blank" rel="noreferrer" className="text-primary hover:underline">http://127.0.0.1:54323</a></p>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">2. Configure Environment Variables</h4>
                  <p className="mb-3">Create a <code className="bg-muted px-1.5 py-0.5 rounded text-sm">.env.local</code> file in the project root with:</p>
                  <pre className="bg-muted p-3 rounded overflow-x-auto text-sm">
                    <code>{`NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key-from-supabase-start>`}</code>
                  </pre>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">3. Start the Development Server</h4>
                  <pre className="bg-muted p-3 rounded overflow-x-auto text-sm">
                    <code>npm run dev</code>
                  </pre>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Production Deployment</h3>
              
              <div className="pl-4 border-l-2 border-muted-foreground/20 space-y-4 mt-4">
                <div>
                  <h4 className="text-lg font-medium mb-2">1. Commit and Push to GitHub</h4>
                  <p>Push your project to GitHub to enable CI/CD workflows</p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-3">
                  <p className="font-medium text-amber-800 dark:text-amber-300 mb-2">All secrets below need to be added to GitHub repository secrets</p>
                  <p className="text-amber-700 dark:text-amber-400 text-sm">All of the following steps (2-5) are about obtaining different secrets that need to be added to your GitHub repository&apos;s environment secrets. You&apos;ll gather these values from different sources and add them all to GitHub.</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">2. Configure GitHub Repository Secrets</h4>
                  <p className="mb-3">Navigate to your repository&apos;s Settings → Secrets and Variables → Actions → Manage environment secrets → production → add environment secret:</p>
                  <pre className="bg-muted p-3 rounded overflow-x-auto text-sm">
                    <code>SUPABASE_DB_PASSWORD = Your Supabase database password</code>
                  </pre>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">3. Create a Supabase Project <span className="text-sm font-normal text-muted-foreground">(to get more GitHub secrets)</span></h4>
                  <p className="mb-3">Create a new project on Supabase:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Copy the database password during creation</li>
                    <li>Open the project, click on &quot;Connect&quot; in the navbar</li>
                    <li>Copy from App-Frameworks section for these GitHub secrets:</li>
                  </ul>
                  <pre className="bg-muted p-3 rounded overflow-x-auto text-sm mt-2">
                    <code>{`NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
YOUR_PROJECT_REF (project ID)`}</code>
                  </pre>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">4. Create Supabase Access Token <span className="text-sm font-normal text-muted-foreground">(for another GitHub secret)</span></h4>
                  <p className="mb-3">Go to Account → Account settings → Access tokens → create a new access token</p>
                  <pre className="bg-muted p-3 rounded overflow-x-auto text-sm">
                    <code>SUPABASE_ACCESS_TOKEN</code>
                  </pre>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">5. Setup Vercel Token <span className="text-sm font-normal text-muted-foreground">(final GitHub secret)</span></h4>
                  <p className="mb-3">Go to <a href="https://vercel.com/account/settings/tokens" target="_blank" rel="noreferrer" className="text-primary hover:underline">Vercel Account Settings</a> → Create new Token → copy for:</p>
                  <pre className="bg-muted p-3 rounded overflow-x-auto text-sm">
                    <code>VERCEL_TOKEN</code>
                  </pre>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">6. Deploy Your Project</h4>
                  <p>After adding all required GitHub secrets, commit any changes to trigger the GitHub workflow. After it completes, your site will be live at the Vercel URL.</p>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-2">7. Configure Authentication</h4>
                  <p>Set your Vercel live URL in your Supabase project dashboard as the redirect link for authentication.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connecting Local & Remote Environments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">To connect your local Supabase instance with the production one, you can use scripts defined in the package.json:</p>
            
            <pre className="bg-muted p-3 rounded overflow-x-auto text-sm">
              <code>{`# Link to your Supabase project
npx supabase link --project-ref YOUR_PROJECT_REF

# Pull remote schema to local
npx supabase db pull

# Push local changes to remote
npx supabase db push`}</code>
            </pre>
            
            <p className="mt-4">Check the package.json file for additional useful scripts and the Documentation & Examples folders for more guides.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication with Supabase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>This template includes built-in authentication using Supabase Auth. Here&apos;s how to use it:</p>
            
            <div>
              <h3 className="text-xl font-medium mb-2">Authentication Context</h3>
              <p>The project uses an AuthContext (<code className="bg-muted px-1.5 py-0.5 rounded text-sm">contexts/AuthContext.tsx</code>) to manage authentication state throughout the application.</p>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Authentication Forms</h3>
              <p>Ready-to-use login and registration forms can be found at:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><Link href="/login" className="text-primary hover:underline">/login</Link> - Login page (<code className="bg-muted px-1.5 py-0.5 rounded text-sm">app/login/page.tsx</code>)</li>
                <li><Link href="/register" className="text-primary hover:underline">/register</Link> - Registration page (<code className="bg-muted px-1.5 py-0.5 rounded text-sm">app/register/page.tsx</code>)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">Protected Routes</h3>
              <p>The dashboard route (<Link href="/dashboard" className="text-primary hover:underline">/dashboard</Link>) demonstrates a protected route that requires authentication.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Explorer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-medium mb-3">Examples</h3>
                <p className="mb-3">Explore example implementations:</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/examples" className={cn(
                      "flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    )}>
                      <span className="text-primary font-medium">Examples Directory</span>
                      <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link href="/examples/animations" className={cn(
                      "flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    )}>
                      <span className="text-primary font-medium">Animations</span>
                      <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link href="/examples/api-calls" className={cn(
                      "flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    )}>
                      <span className="text-primary font-medium">API Calls</span>
                      <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link href="/examples/function-call" className={cn(
                      "flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    )}>
                      <span className="text-primary font-medium">Edge Functions</span>
                      <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                  <li>
                    <Link href="/examples/ui-components" className={cn(
                      "flex items-center p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                    )}>
                      <span className="text-primary font-medium">UI Components</span>
                      <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-3">Documentation</h3>
                <p className="mb-3">Review detailed documentation:</p>
                <ul className="space-y-2">
                  <li className="p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">UI Components</span>
                    <p className="text-sm text-muted-foreground mt-1">Check <code className="bg-muted px-1 py-0.5 rounded text-xs">/docs/shadcn-ui-guide.md</code> for UI component usage</p>
                  </li>
                  <li className="p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Server-Side Rendering</span>
                    <p className="text-sm text-muted-foreground mt-1">Check <code className="bg-muted px-1 py-0.5 rounded text-xs">/docs/ssr-guide.md</code> for SSR implementation</p>
                  </li>
                  <li className="p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Styling Guide</span>
                    <p className="text-sm text-muted-foreground mt-1">Check <code className="bg-muted px-1 py-0.5 rounded text-xs">/docs/styling-guide.md</code> for Tailwind usage</p>
                  </li>
                  <li className="p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Theming System</span>
                    <p className="text-sm text-muted-foreground mt-1">Check <code className="bg-muted px-1 py-0.5 rounded text-xs">/docs/theme-system-guide.md</code> for theme customization</p>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rest of the cards remain the same */}
        <Card>
          <CardHeader>
            <CardTitle>Tech Stack Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {/* Tech stack content remains the same */}
              <div>
                <h3 className="text-xl font-medium mb-3">Frontend</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="font-medium min-w-28">Next.js 15:</span>
                    <span>React framework with App Router for SSR and static generation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium min-w-28">React 19:</span>
                    <span>UI library with latest features</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium min-w-28">TypeScript:</span>
                    <span>Type safety for robust code</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium min-w-28">Tailwind CSS:</span>
                    <span>Utility-first CSS framework</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium min-w-28">shadcn/ui:</span>
                    <span>Beautifully designed components built with Radix UI and Tailwind</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium min-w-28">next-themes:</span>
                    <span>Theme management (light/dark mode)</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-3">Backend &amp; Infrastructure</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="font-medium min-w-28">Supabase:</span>
                    <span>Backend-as-a-Service with auth, database, and storage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium min-w-28">PostgreSQL:</span>
                    <span>Relational database via Supabase</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium min-w-28">Edge Functions:</span>
                    <span>Serverless functions for backend logic</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium min-w-28">Authentication:</span>
                    <span>Built-in auth flow with Supabase Auth</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium min-w-28">CI/CD:</span>
                    <span>GitHub Actions and Vercel for deployment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium min-w-28">Testing:</span>
                    <span>Jest for unit and component testing</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <footer className="text-center text-muted-foreground pt-6">
          <p>SupaNext Template © {new Date().getFullYear()} | MIT License</p>
          <p className="text-sm mt-1">Last updated: May 1, 2025</p>
        </footer>
      </div>
    </PageContainer>
  );
}
