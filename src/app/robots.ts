import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';

// Private or utility routes: never useful in search results or AI answers.
const DISALLOW = [
  '/admin',
  '/admin/*',
  '/api/*',
  '/cart',
  '/wishlist',
  '/checkout',
  '/checkout/*',
  '/dashboard',
  '/orders',
  '/orders/*',
  '/profile',
  '/addresses',
  '/returns$',
  '/returns/',
  '/notifications',
  '/login',
  '/register',
  '/forgot-password',
  '/verify-email',
  '/track-order',
];

// AI assistants that fetch pages to answer a question or cite sources. Listed
// explicitly (crawlers follow only their most specific group, so the private
// routes are repeated) to make the policy deliberate rather than implicit.
const AI_SEARCH_AGENTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Bingbot',
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.replace(/\/+$/, '');

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: AI_SEARCH_AGENTS, allow: '/', disallow: DISALLOW },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
