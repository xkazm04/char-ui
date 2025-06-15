// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  
  webpack: (config, { dev, isServer }) => {
    // Handle optional dependencies
    config.resolve.alias = {
      ...config.resolve.alias,
    };

    // Ignore Sharp in client-side bundles
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        sharp: false,
        fs: false,
        path: false,
        os: false,
      };
    }

    // Handle .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'raw-loader',
    });

    return config;
  },

  images: {
    domains: [
      "cdn.leonardo.ai",
      "images.unsplash.com",
      "utfs.io",
      "localhost",
      "pikselplay.netlify.app",
    ],
    formats: ['image/webp', 'image/avif'],
  },

    outputFileTracingRoot: process.cwd(),
    outputFileTracingIncludes: {
      '/': ['./public/**/*'],
    },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  },
};

export default nextConfig;