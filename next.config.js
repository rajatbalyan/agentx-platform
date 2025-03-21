/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable type checking and linting during build
  typescript: {
    // Enable type checking during build
    ignoreBuildErrors: false,
  },
  eslint: {
    // Enable linting during build
    ignoreDuringBuilds: false,
  },

  // Optimize bundle size
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig; 