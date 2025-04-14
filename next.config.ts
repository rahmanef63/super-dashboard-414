import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    DATABASE_URL:
      'postgresql://postgres:Bismillah63@194.238.22.2:5432/sadashboard?schema=public', // This is a placeholder and needs to be replaced with the actual PostgreSQL connection string.
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    allowedDevOrigins: ['9003-idx-super-dashboard-414-master-1744642330465.cluster-w5vd22whf5gmav2vgkomwtc4go.cloudworkstations.dev'],
  },
};

export default nextConfig;
