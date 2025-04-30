import Link from 'next/link';
import PageContainer from '@/components/layout/PageContainer';
import PageHeader from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';

export const metadata = {
  title: 'Examples Overview | SupaNext Template',
  description: 'Explore example implementations of different rendering strategies and Supabase features',
};

interface ExampleLink {
  title: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
}

export default function ExamplesOverviewPage() {
  const examples: ExampleLink[] = [
    {
      title: 'Server-Side Rendering (SSR)',
      description: 'Example of a page using SSR to fetch data from Supabase on the server.',
      href: '/examples/ssr-page',
      icon: '🖥️',
    },
    {
      title: 'Client-Side Rendering',
      description: 'Example of a page fetching data from Supabase in the browser.',
      href: '/examples/client-page',
      icon: '🌐',
    },
    {
      title: 'Hybrid Rendering',
      description: 'Combines server and client rendering for optimal user experience.',
      href: '/examples/hybrid-page',
      icon: '⚡',
      badge: 'Recommended',
    },
    {
      title: 'Edge Functions',
      description: 'Examples of calling Supabase Edge Functions from both server and client components.',
      href: '/examples/function-call',
      icon: '☁️',
    },
  ];

  return (
    <PageContainer>
      <PageHeader title="Examples & Demos" />
      
      <div className="mb-6">
        <p className="text-gray-700 dark:text-gray-300">
          Explore these examples to learn how to use different features of the SupaNext template.
          Each example demonstrates a different rendering strategy or Supabase integration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examples.map((example) => (
          <Link 
            href={example.href} 
            key={example.href}
            className="group no-underline"
          >
            <Card className="p-6 h-full transition-all duration-200 hover:shadow-md hover:border-blue-400 group-focus:ring-2 group-focus:ring-blue-400">
              <div className="flex items-start">
                <div className="text-3xl mr-4">{example.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{example.title}</h2>
                    {example.badge && (
                      <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
                        {example.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">{example.description}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">
                  View Example →
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Looking for Documentation?</h2>
        <p className="mb-4">
          Check out our comprehensive guides to understand how these examples work and best practices
          for your Next.js + Supabase application:
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/docs/ssr-guide" 
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="mr-2">📚</span>
            SSR Guide
          </Link>
          <a 
            href="https://supabase.com/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="mr-2">🔗</span>
            Supabase Docs
          </a>
          <a 
            href="https://nextjs.org/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <span className="mr-2">🔗</span>
            Next.js Docs
          </a>
        </div>
      </div>
    </PageContainer>
  );
}