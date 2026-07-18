import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // TODO: Add remotePatterns here when using real external images
    // remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ['@prisma/client', 'pg'],
};

let config = withNextIntl(nextConfig);

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = (await import('@next/bundle-analyzer')).default({
    enabled: true,
  });
  config = withBundleAnalyzer(config);
}

export default config;