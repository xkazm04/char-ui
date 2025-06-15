import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "cdn.leonardo.ai",
      "images.unsplash.com",
      "utfs.io",
      "localhost",
      "https://pikselplay.netlify.app",
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  },
  outputFileTracingIncludes: {
      '/': ['./public/**/*'],
    },

};

export default nextConfig;
