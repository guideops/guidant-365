import type { NextConfig } from 'next'

const withPWA = require('@ducanh2912/next-pwa').default

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  webpack: (config: { resolve: { alias: Record<string, boolean> } }) => {
    config.resolve.alias.canvas = false
    return config
  },
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\//,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'supabase-cache',
          networkTimeoutSeconds: 10,
        },
      },
      {
        urlPattern: /\/_next\/static\//,
        handler: 'CacheFirst',
        options: { cacheName: 'next-static' },
      },
    ],
  },
})(nextConfig)
