import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.replace(/\/+$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/checkout',
          '/checkout/*',
          '/dashboard',
          '/orders',
          '/orders/*',
          '/profile',
          '/addresses',
          '/returns',
          '/notifications',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
