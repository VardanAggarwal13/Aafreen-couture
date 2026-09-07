export const siteConfig = {
  name: 'Aafreen Couture',
  tagline: 'Timeless Elegance, Crafted for You',
  description:
    'Premium bridal and ethnic couture — handcrafted lenghas, suits, dresses, sharara, and accessories for the modern Indian bride.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'https://aafreencouture.com',
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
