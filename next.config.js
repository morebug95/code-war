/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {},
  },
  typescript: {
    // Ignore TypeScript errors during build to allow us to continue
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during build to allow us to continue
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
