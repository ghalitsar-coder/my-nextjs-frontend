import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hono will handle API routes directly, no need for proxy rewrites
  images: {
    domains: ['images.unsplash.com', 'localhost'], // Allow external images
  },
  // Enable experimental features for better Hono support
  experimental: {
    serverComponentsExternalPackages: ['hono'],
  },
};

export default nextConfig;
