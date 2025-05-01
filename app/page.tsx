export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12 max-w-5xl">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold mb-6 dark:text-white">Welcome to SupaNext Template</h1>
        <p className="text-lg mb-4 dark:text-gray-300">
          A modern, production-ready template using Next.js and Supabase with TypeScript and Tailwind CSS.
        </p>
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium">Next.js 15</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">Supabase</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full text-sm font-medium">TypeScript</span>
          <span className="px-3 py-1 bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 rounded-full text-sm font-medium">Tailwind CSS</span>
          <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full text-sm font-medium">shadcn/ui</span>
          <span className="px-3 py-1 bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200 rounded-full text-sm font-medium">Jest</span>
        </div>
      </section>

      <section className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Local Development Setup</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2 dark:text-gray-200">1. Environment Configuration</h3>
            <p className="dark:text-gray-300 mb-3">Create a <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">.env.local</code> file in the project root with:</p>
            <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-x-auto text-sm">
              <code>{`NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2 dark:text-gray-200">2. Start Supabase Locally</h3>
            <p className="dark:text-gray-300 mb-3">Ensure Docker is running, then start Supabase:</p>
            <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-x-auto text-sm">
              <code>npm run supabase:start</code>
            </pre>
            <p className="dark:text-gray-300 mt-2">You can access the Supabase Studio at <a href="http://127.0.0.1:54323" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">http://127.0.0.1:54323</a></p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2 dark:text-gray-200">3. Database Migrations</h3>
            <p className="dark:text-gray-300">Apply database migrations and seed data:</p>
            <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-x-auto text-sm">
              <code>npm run supabase:dbpush
npm run supabase:dbseed</code>
            </pre>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2 dark:text-gray-200">4. Start the Development Server</h3>
            <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-x-auto text-sm">
              <code>npm run dev</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Production Deployment Guide</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-2 dark:text-gray-200">1. Set Up GitHub Repository</h3>
            <p className="dark:text-gray-300">Push your project to GitHub to enable CI/CD workflows.</p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2 dark:text-gray-200">2. Configure GitHub Secrets</h3>
            <p className="dark:text-gray-300 mb-3">Navigate to your repository's Settings → Secrets and Variables → Actions, then add:</p>
            <ul className="list-disc pl-5 space-y-2 dark:text-gray-300">
              <li><code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">VERCEL_TOKEN</code> - Access token from your Vercel account with organization access</li>
              <li><code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">NEXT_PUBLIC_SUPABASE_URL</code> - Your Supabase project URL</li>
              <li><code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> - Your Supabase anon key</li>
              <li><code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">SUPABASE_ACCESS_TOKEN</code> - From Supabase Account Settings → Personal Access Tokens</li>
              <li><code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">SUPABASE_DB_PASSWORD</code> - Your Supabase database password</li>
              <li><code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">YOUR_PROJECT_REF</code> - Your Supabase project ID</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2 dark:text-gray-200">3. Configure Supabase Auth URL</h3>
            <p className="dark:text-gray-300">In your Supabase Dashboard → Settings → Auth → URL Configuration, set the Site URL to your production domain.</p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2 dark:text-gray-200">4. Deploy Your Project</h3>
            <p className="dark:text-gray-300">Push changes to the main branch to trigger automatic deployment via GitHub Actions and Vercel.</p>
          </div>
        </div>
      </section>

      <section className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Authentication with Supabase</h2>
        
        <div className="space-y-4">
          <p className="dark:text-gray-300">This template includes built-in authentication using Supabase Auth. Here's how to use it:</p>
          
          <div>
            <h3 className="text-xl font-medium mb-2 dark:text-gray-200">Authentication Context</h3>
            <p className="dark:text-gray-300">The project uses an AuthContext (<code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">contexts/AuthContext.tsx</code>) to manage authentication state throughout the application.</p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2 dark:text-gray-200">Authentication Forms</h3>
            <p className="dark:text-gray-300">Ready-to-use login and registration forms can be found at:</p>
            <ul className="list-disc pl-5 space-y-1 dark:text-gray-300">
              <li><a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">/login</a> - Login page (<code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">app/login/page.tsx</code>)</li>
              <li><a href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">/register</a> - Registration page (<code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">app/register/page.tsx</code>)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2 dark:text-gray-200">Protected Routes</h3>
            <p className="dark:text-gray-300">The dashboard route (<a href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline">/dashboard</a>) demonstrates a protected route that requires authentication.</p>
          </div>
        </div>
      </section>

      <section className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Project Explorer</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-medium mb-3 dark:text-gray-200">Examples</h3>
            <p className="dark:text-gray-300 mb-3">Explore example implementations:</p>
            <ul className="space-y-2">
              <li>
                <a href="/examples" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Examples Directory</span>
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="/examples/animations" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Animations</span>
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="/examples/api-calls" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">API Calls</span>
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="/examples/function-call" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Edge Functions</span>
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
              <li>
                <a href="/examples/ui-components" className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">UI Components</span>
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3 dark:text-gray-200">Documentation</h3>
            <p className="dark:text-gray-300 mb-3">Review detailed documentation:</p>
            <ul className="space-y-2">
              <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-medium dark:text-gray-200">UI Components</span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Check <code className="bg-gray-100 dark:bg-gray-600 px-1 py-0.5 rounded text-xs">/docs/shadcn-ui-guide.md</code> for UI component usage</p>
              </li>
              <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-medium dark:text-gray-200">Server-Side Rendering</span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Check <code className="bg-gray-100 dark:bg-gray-600 px-1 py-0.5 rounded text-xs">/docs/ssr-guide.md</code> for SSR implementation</p>
              </li>
              <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-medium dark:text-gray-200">Styling Guide</span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Check <code className="bg-gray-100 dark:bg-gray-600 px-1 py-0.5 rounded text-xs">/docs/styling-guide.md</code> for Tailwind usage</p>
              </li>
              <li className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="font-medium dark:text-gray-200">Theming System</span>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Check <code className="bg-gray-100 dark:bg-gray-600 px-1 py-0.5 rounded text-xs">/docs/theme-system-guide.md</code> for theme customization</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Tech Stack Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
          <div>
            <h3 className="text-xl font-medium mb-3 dark:text-gray-200">Frontend</h3>
            <ul className="space-y-2 dark:text-gray-300">
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
            <h3 className="text-xl font-medium mb-3 dark:text-gray-200">Backend &amp; Infrastructure</h3>
            <ul className="space-y-2 dark:text-gray-300">
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
      </section>

      <section className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 dark:text-white">Developing New Features</h2>
        
        <div className="space-y-4 dark:text-gray-300">
          <p>Follow these best practices when adding new features to your project:</p>
          
          <div className="space-y-2">
            <h3 className="text-xl font-medium dark:text-gray-200">1. Create Components</h3>
            <p>Add new components in the <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">components/</code> directory, organized by feature or type.</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-medium dark:text-gray-200">2. Add Routes</h3>
            <p>Create new routes in the <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">app/</code> directory following Next.js App Router conventions.</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-medium dark:text-gray-200">3. Database Changes</h3>
            <p>For database schema changes:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Create a migration: <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">npm run supabase:migration new my_migration</code></li>
              <li>Edit the SQL file in <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">supabase/migrations/</code></li>
              <li>Apply changes: <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">npm run supabase:dbpush</code></li>
            </ol>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-medium dark:text-gray-200">4. Edge Functions</h3>
            <p>Create new Supabase Edge Functions:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Create a new function: <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">npm run supabase:functions:new my-function</code></li>
              <li>Implement your function in <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">supabase/functions/my-function/index.ts</code></li>
              <li>Serve locally: <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">npm run supabase:functions:serve</code></li>
              <li>Deploy: <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">npm run supabase:functions:deploy my-function</code></li>
            </ol>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-medium dark:text-gray-200">5. Testing</h3>
            <p>Add tests in the appropriate <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">__tests__</code> directory and run with <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">npm test</code>.</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-medium dark:text-gray-200">6. Documentation</h3>
            <p>Document new features or changes in the <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm">docs/</code> directory.</p>
          </div>
        </div>
      </section>

      <footer className="text-center text-gray-500 dark:text-gray-400 pt-6">
        <p>SupaNext Template © {new Date().getFullYear()} | MIT License</p>
        <p className="text-sm mt-1">Last updated: May 1, 2025</p>
      </footer>
    </div>
  );
}
