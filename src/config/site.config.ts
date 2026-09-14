// Guards against a misconfigured NEXT_PUBLIC_APP_URL (e.g. accidentally set to
// http:// in production) leaking into canonical links, Open Graph tags, and
// JSON-LD, which browsers and search engines flag as mixed content on an
// HTTPS site. Only localhost is allowed to stay on http://.
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL;
  if (!raw) return 'https://aafreencouture.com';
  if (raw.startsWith('http://localhost') || raw.startsWith('http://127.0.0.1')) return raw;
  return raw.replace(/^http:\/\//, 'https://');
}

export const siteConfig = {
  name: 'Aafreen Couture',
  tagline: 'Timeless Elegance, Crafted for You',
  description:
    'Shop premium bridal lehengas, designer suits, ethnic dresses, sharara sets, and bridal accessories at Aafreen Couture — handcrafted luxury Indian wedding wear for the modern bride.',
  url: resolveSiteUrl(),
  ogImage: '/images/og-image.jpg',
  email: 'support@aafreencouture.com',
  phone: '+91 95179 01117',
  whatsapp: '919517901117',
  instagram: 'aafreen__couture',
  instagramUrl: 'https://www.instagram.com/aafreen__couture/',
  freeShippingThreshold: 500000, // ₹5,000 in paise
  currency: 'INR',
  locale: 'en-IN',
} as const;
