import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ui-avatars.com'], // Add ui-avatars.com as an allowed image domain
  },
  webpack: (config) => {
    // Make webpack resolve modules in a case-insensitive way
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components/ui/card': 'components/ui/card.tsx',
      '@/components/ui/Card': 'components/ui/card.tsx',
      '@/components/ui/button': 'components/ui/button.tsx',
      '@/components/ui/Button': 'components/ui/button.tsx',
      '@/components/ui/codeblock': 'components/ui/codeblock.tsx',
      '@/components/ui/Codeblock': 'components/ui/codeblock.tsx',
    };
    return config;
  },
};

export default nextConfig;
