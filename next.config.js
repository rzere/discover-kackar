const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/lib/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react']
  }
};

module.exports = withNextIntl(nextConfig);