import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Enable standalone output for Cloud Run
  output: 'standalone',
  
  // Configure webpack to handle path aliases properly
  webpack: (config, { dev, isServer }) => {
    // Ensure proper alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/app': path.resolve(__dirname, 'app'),
      '@/components': path.resolve(__dirname, 'app/components'),
      '@/lib': path.resolve(__dirname, 'app/lib'),
      '@/utils': path.resolve(__dirname, 'app/utils'),
      '@/store': path.resolve(__dirname, 'app/store'),
      '@/functions': path.resolve(__dirname, 'app/functions'),
      '@/hooks': path.resolve(__dirname, 'app/hooks'),
      '@/types': path.resolve(__dirname, 'app/types'),
    };

    // Handle CSS imports properly
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    return config;
  },
  
  images: {
    domains: [
      "cdn.leonardo.ai",
      "images.unsplash.com",
      "utfs.io",
      "localhost",
    ],
  },

  outputFileTracingRoot: process.cwd(),


  // Handle environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  },
};

export default nextConfig;