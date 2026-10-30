import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Lets a verification build run beside a live dev server without touching its .next folder.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  serverExternalPackages: ['mongodb', 'mongoose'],
  compress: true,
  poweredByHeader: false,
  images: {
    // Resizing/format negotiation happens on the Cloudinary CDN (see image-loader.ts),
    // so no server-side optimizer is involved and local /public images pass through as-is.
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    const securityHeaders = [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://checkout.razorpay.com https://api.razorpay.com https://connect.facebook.net",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com data:",
          "img-src 'self' blob: data: https://www.google-analytics.com https://www.googletagmanager.com https://res.cloudinary.com https://images.unsplash.com https://plus.unsplash.com https://www.facebook.com",
          "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
          "connect-src 'self' https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://api.razorpay.com https://lumberjack.razorpay.com https://res.cloudinary.com https://www.facebook.com https://connect.facebook.net",
        ].join('; '),
      },
    ];

    if (isDev) {
      // In dev mode, don't enforce strict CSP that might interfere with HMR or devtools
      return [
        {
          source: '/:path*',
          headers: securityHeaders.filter((h) => h.key !== 'Content-Security-Policy'),
        },
      ];
    }

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/terms-of-service',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/return-policy',
        destination: '/returns-policy',
        permanent: true,
      },
      {
        source: '/refund-policy',
        destination: '/returns-policy',
        permanent: true,
      },
      {
        source: '/cancellation-policy',
        destination: '/returns-policy',
        permanent: true,
      },
      {
        source: '/faqs',
        destination: '/faq',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
    ];
  },

  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@tanstack/react-query', 'clsx', 'tailwind-merge'],
  },
};

export default nextConfig;
