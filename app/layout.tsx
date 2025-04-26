import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { CONFIG } from '@/lib/constants';
import NavbarWithAuth from '@/components/NavbarWithAuth';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: CONFIG.APP_NAME,
    template: `%s | ${CONFIG.APP_NAME}`,
  },
  description: 'A modern template using Next.js and Supabase',
};

export const viewport: Viewport = {
  themeColor: CONFIG.THEME_COLOR,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans antialiased">
        <AuthProvider>
          <NavbarWithAuth 
            logo="SupaNext"
            links={[
              { label: 'Home', href: '/' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ]}
          />
          <main className="flex-grow">
            {children}
          </main>
          <Footer
            companyName="SupaNext"
            links={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Terms', href: '/terms' },
              { label: 'Privacy', href: '/privacy' },
            ]}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
