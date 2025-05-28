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
};

export default nextConfig;
