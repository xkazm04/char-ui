import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "cdn.leonardo.ai",
      "images.unsplash.com",
      "utfs.io",
      "localhost"
    ],
  },
};

export default nextConfig;
