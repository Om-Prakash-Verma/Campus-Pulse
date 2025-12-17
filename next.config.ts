/**
 * @type {import('next').NextConfig}
 */
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Prevents TypeScript errors from failing the build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Prevents ESLint errors from failing the build
    ignoreDuringBuilds: true,
  },
  images: {
    // Defines a list of allowed remote image sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https'
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
