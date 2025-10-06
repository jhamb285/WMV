import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true
  },
  output: 'standalone',
  serverExternalPackages: ['@react-google-maps/api']
};

export default nextConfig;
