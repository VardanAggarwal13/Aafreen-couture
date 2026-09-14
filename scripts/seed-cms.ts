/**
 * Seeds the CmsPage collection with the current live hero content for the
 * static info/policy pages, so the new Admin > CMS Pages editor starts with
 * real data instead of an empty list.
 *
 * Idempotent — safe to re-run; upserts by slug and never touches other
 * collections.
 *
 * Run: npx tsx scripts/seed-cms.ts
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('MONGODB_URI not set in .env.local');

const CmsPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, required: true, trim: true },
    route: { type: String, required: true, trim: true },
    heroBadge: String,
    heroTitle: { type: String, required: true },
    heroItalicTitle: String,
    heroSubtitle: { type: String, required: true },
    heroMetaInfo: String,
    status: { type: String, enum: ['published', 'draft'], default: 'published' },
  },
  { timestamps: true }
);

const CmsPage = mongoose.models.CmsPage ?? mongoose.model('CmsPage', CmsPageSchema);

const PAGES = [
  {
    slug: 'about',
    title: 'About the Atelier',
    route: '/about',
    heroBadge: 'Aafreen Couture By Pearl',
    heroTitle: 'Our Story & Atelier',
    heroItalicTitle: 'Heirloom Craftsmanship',
    heroSubtitle:
      "Where every thread tells a regal story. Preserving centuries of authentic Indian karigari, rare zardozi embroidery, and modern silhouette tailoring for life's most cherished milestones.",
    heroMetaInfo: 'Bespoke Bridal Atelier · Amritsar, Punjab · Shipping Worldwide to 50+ Countries',
  },
  {
    slug: 'contact',
    title: 'Customer Care & Contact',
    route: '/contact',
    heroBadge: 'Aafreen Boutique Concierge',
    heroTitle: 'Contact & Concierge',
    heroItalicTitle: 'Personal Styling & Trials',
    heroSubtitle:
      'Whether you seek custom bridal alterations, virtual sizing guidance, or wedding trousseau consultations, our master stylists are dedicated to assisting you.',
    heroMetaInfo: 'Amritsar Atelier Studio · Pan-India & Worldwide Virtual Appointments',
  },
  {
    slug: 'faq',
    title: 'Frequently Asked Questions',
    route: '/faq',
    heroBadge: 'Aafreen Client Helpdesk',
    heroTitle: 'Frequently Asked Questions',
    heroItalicTitle: 'Atelier Guidance',
    heroSubtitle:
      'Everything you need to know regarding bespoke bridal sizing, payment security, express air transit, and our fitting guarantee.',
    heroMetaInfo: 'Dedicated Styling Concierge · Direct WhatsApp Assistance · 24-48h Response Guarantee',
  },
  {
    slug: 'shipping-policy',
    title: 'Shipping & Delivery Policy',
    route: '/shipping-policy',
    heroBadge: 'Aafreen Atelier Transit Protocols',
    heroTitle: 'Shipping & Delivery',
    heroItalicTitle: 'Global Logistics & Care',
    heroSubtitle:
      'Delivering handcrafted Indian bridal couture with 100% transit insurance, white-glove packaging, and live milestone updates across India and 50+ countries.',
    heroMetaInfo: 'Effective Season 2026 · Compliant with Indian E-Commerce Consumer Protection Rules',
  },
  {
    slug: 'returns-policy',
    title: 'Returns & Exchange Policy',
    route: '/returns-policy',
    heroBadge: 'Aafreen Atelier Fitting Protocols',
    heroTitle: 'Exchange & Returns',
    heroItalicTitle: 'Client Care & Fitting Guarantee',
    heroSubtitle:
      'Dedicated to ensuring every heirloom ensemble fits you flawlessly. Learn about our 7-day size exchanges, complimentary bridal alterations, and full refund guarantees.',
    heroMetaInfo: 'Effective Season 2026 · Compliant with Consumer Protection (E-Commerce) Rules',
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy & Security Policy',
    route: '/privacy-policy',
    heroBadge: 'Data Protection & Security',
    heroTitle: 'Privacy Policy',
    heroItalicTitle: 'Client Confidentiality',
    heroSubtitle:
      'At Aafreen Couture, we value your trust. Learn how we collect, safeguard, and responsibly process your personal information with banking-grade security.',
    heroMetaInfo:
      'Effective Season 2026 · Compliant with the Information Technology Act, 2000 & Digital Personal Data Protection Norms, India',
  },
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    route: '/terms',
    heroBadge: 'Legal & Compliance Hub',
    heroTitle: 'Terms & Conditions',
    heroItalicTitle: 'Atelier Service Principles',
    heroSubtitle:
      'These Terms & Conditions govern your use of our boutique website, bespoke made-to-order bridal couture, and international orders.',
    heroMetaInfo: 'Effective Season 2026 · Compliant with the Information Technology Act & Consumer Protection Rules, India',
  },
];

async function main() {
  await mongoose.connect(MONGODB_URI!);
  console.log('Connected to MongoDB');

  for (const page of PAGES) {
    await CmsPage.findOneAndUpdate(
      { slug: page.slug },
      { $set: page },
      { upsert: true, new: true }
    );
    console.log(`Upserted CMS page: ${page.slug}`);
  }

  console.log(`Done — seeded ${PAGES.length} CMS pages.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
