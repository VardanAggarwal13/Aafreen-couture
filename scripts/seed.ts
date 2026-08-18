/**
 * Database seed script
 * Run: npx tsx scripts/seed.ts
 *
 * Seeds: admin user, categories, collections, sample products
 * Images: placeholder Cloudinary URLs — replace with real uploads later
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error('MONGODB_URI not set in .env.local');

// ─── Schemas (inline for seed independence) ──────────────────────────────────

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    image: String,
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CollectionSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    bannerImage: String,
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

const VariantSchema = new mongoose.Schema({
  size: String,
  color: String,
  colorHex: String,
  sku: String,
  price: Number,
  comparePrice: Number,
  stock: { type: Number, default: 0 },
});

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    basePrice: Number,
    comparePrice: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category_seed' },
    collectionRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection_seed' },
    images: [String],
    variants: [VariantSchema],
    fabric: String,
    workType: String,
    occasion: [String],
    careInstructions: String,
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    tags: [String],
    soldCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    emailVerified: { type: Boolean, default: true },
    role: { type: String, default: 'customer' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }
);

// ─── Models ──────────────────────────────────────────────────────────────────

const Category = mongoose.models.Category_seed ?? mongoose.model('Category_seed', CategorySchema);
const Collection = mongoose.models.Collection_seed ?? mongoose.model('Collection_seed', CollectionSchema);
const Product = mongoose.models.Product_seed ?? mongoose.model('Product_seed', ProductSchema);
const User = mongoose.models.User_seed ?? mongoose.model('User_seed', UserSchema);

// ─── Seed data ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Bridal Lehengas', slug: 'bridal-lehengas', description: 'Exquisite bridal lehengas for your most special day', displayOrder: 1 },
  { name: 'Bridesmaid Lehengas', slug: 'bridesmaid-lehengas', description: 'Beautiful coordinated looks for the bridal squad', displayOrder: 2 },
  { name: 'Suits', slug: 'suits', description: 'Elegantly crafted suits for every occasion', displayOrder: 3 },
  { name: 'Co-ord Sets', slug: 'co-ord-sets', description: 'Signature co-ordinated sets', displayOrder: 4 },
  { name: 'Dresses', slug: 'dresses', description: 'Contemporary dresses with ethnic flair', displayOrder: 5 },
  { name: 'Sharara', slug: 'sharara', description: 'Classic sharara sets', displayOrder: 6 },
  { name: 'Sarees', slug: 'sarees', description: 'Curated saree collection', displayOrder: 7 },
  { name: 'Jewellery', slug: 'jewellery', description: 'Statement jewellery pieces', displayOrder: 8 },
  { name: 'Handbags', slug: 'handbags', description: 'Luxury handbags and potlis', displayOrder: 9 },
  { name: 'Clutches', slug: 'clutches', description: 'Evening clutches and minaudières', displayOrder: 10 },
  { name: 'Accessories', slug: 'accessories', description: 'Dupattas, belts, and accessories', displayOrder: 11 },
];

const COLLECTIONS = [
  {
    name: 'Bridal Lehengas + Suits',
    slug: 'bridal-lehengas-suits',
    description: 'Statement bridal pieces for your most celebrated day — crafted with intricate zari work and premium fabrics.',
    isFeatured: true,
    displayOrder: 1,
    metaTitle: 'Bridal Lehengas & Suits | Aafreen Couture',
    metaDescription: 'Discover exquisite bridal lehengas and suits by Aafreen Couture. Timeless craftsmanship for your wedding day.',
  },
  {
    name: 'Bridesmaid Lehengas',
    slug: 'bridesmaid-lehengas',
    description: 'Beautiful coordinated lehengas for the bridal squad.',
    isFeatured: true,
    displayOrder: 2,
  },
  {
    name: 'Formals — Cotton Kurta Set',
    slug: 'formals-cotton-kurta-set',
    description: 'Polished cotton kurta sets for professional and casual occasions.',
    isFeatured: false,
    displayOrder: 3,
  },
  {
    name: 'Indo-Western',
    slug: 'indo-western',
    description: 'Where tradition meets contemporary design.',
    isFeatured: true,
    displayOrder: 4,
  },
  {
    name: 'Signature Co-Ord Sets',
    slug: 'signature-co-ord-sets',
    description: 'Curated sets that define modern elegance.',
    isFeatured: true,
    displayOrder: 5,
  },
  {
    name: 'Summer Essential Cotton Suits',
    slug: 'summer-essentials',
    description: 'Lightweight cotton suits for warm days, festive evenings.',
    isFeatured: true,
    displayOrder: 6,
  },
  {
    name: 'Partywear Unstitched Suits',
    slug: 'partywear-unstitched',
    description: 'Rich fabrics, ready for your own tailor.',
    isFeatured: false,
    displayOrder: 7,
  },
  {
    name: 'Custom Embroidered Suits',
    slug: 'custom-embroidered-suits',
    description: 'Bespoke embroidered suits crafted to your vision.',
    isFeatured: false,
    displayOrder: 8,
  },
  {
    name: 'Saree Edit',
    slug: 'saree-edit',
    description: 'Grace in every drape — our curated saree collection.',
    isFeatured: true,
    displayOrder: 9,
  },
  {
    name: 'Jewellery',
    slug: 'jewellery',
    description: 'Statement jewellery to complete your look.',
    isFeatured: true,
    displayOrder: 10,
  },
  {
    name: 'The Bag Edit',
    slug: 'the-bag-edit',
    description: 'Luxury in every detail — potlis, clutches, and handbags.',
    isFeatured: true,
    displayOrder: 11,
  },
  {
    name: 'Occasion-Based Lehengas',
    slug: 'occasion-lehengas',
    description: 'Crafted for every milestone celebration.',
    isFeatured: false,
    displayOrder: 12,
  },
];

const PLACEHOLDER_IMG = (slug: string, n = 1) => {
  if (slug.includes('noor-e-ishq')) return '/images/products/noor-e-ishq.webp';
  if (slug.includes('zarafshan')) return '/images/products/zarafshan.webp';
  if (slug.includes('gulbahar')) return '/images/products/gulbahar.webp';
  if (slug.includes('co-ord') || slug.includes('coord')) return '/images/products/signature-coord.webp';
  if (slug.includes('bag') || slug.includes('potli') || slug.includes('handbag')) return '/images/products/luxury-potli.webp';
  return '/images/products/noor-e-ishq.webp';
};

function makeVariants(basePrice: number, sizes: string[], colors: { name: string; hex: string }[]) {
  const variants = [];
  for (const color of colors) {
    for (const size of sizes) {
      variants.push({
        size,
        color: color.name,
        colorHex: color.hex,
        sku: `SKU-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        price: basePrice,
        comparePrice: Math.round(basePrice * 1.2 / 100) * 100,
        stock: Math.floor(Math.random() * 20) + 2,
      });
    }
  }
  return variants;
}

const LEHENGA_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SUIT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

async function main() {
  console.log('🌱 Connecting to MongoDB…');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected');

  // Clear existing seed data
  await Promise.all([
    Category.deleteMany({}),
    Collection.deleteMany({}),
    Product.deleteMany({}),
  ]);
  console.log('🗑  Cleared existing seed data');

  // Seed categories
  const cats = await Category.insertMany(CATEGORIES);
  const catMap = Object.fromEntries(cats.map((c) => [c.slug as string, c._id]));
  console.log(`✅ Seeded ${cats.length} categories`);

  // Seed collections
  const cols = await Collection.insertMany(COLLECTIONS);
  const colMap = Object.fromEntries(cols.map((c) => [c.slug as string, c._id]));
  console.log(`✅ Seeded ${cols.length} collections`);

  // Seed products
  const PRODUCTS = [
    // ── Bridal Lehengas ─────────────────────────────────────────────────
    {
      name: 'Noor-e-ishq Lehenga',
      slug: 'noor-e-ishq-lehenga',
      description: 'A masterpiece of craftsmanship with intricate embroidery, zari work and premium fabrics. The perfect choice for your bridal ceremony.',
      basePrice: 8999900,
      comparePrice: 10999900,
      category: catMap['bridal-lehengas'],
      collectionRef: colMap['bridal-lehengas-suits'],
      images: [PLACEHOLDER_IMG('noor-e-ishq', 1), PLACEHOLDER_IMG('noor-e-ishq', 2), PLACEHOLDER_IMG('noor-e-ishq', 3)],
      variants: makeVariants(8999900, LEHENGA_SIZES, [
        { name: 'Maroon', hex: '#8B1F1F' },
        { name: 'Ivory', hex: '#F5F0E8' },
        { name: 'Royal Blue', hex: '#1A1A5E' },
      ]),
      fabric: 'Silk',
      workType: 'Zari Embroidery',
      occasion: ['Wedding', 'Reception', 'Engagement'],
      careInstructions: 'Dry clean only. Store in muslin bag.',
      isActive: true, isFeatured: true, isNewArrival: true, isBestSeller: true,
      tags: ['bridal', 'lehenga', 'wedding', 'zari', 'silk'],
      soldCount: 47,
      metaTitle: 'Noor-e-ishq Bridal Lehenga | Aafreen Couture',
      metaDescription: 'Premium bridal lehenga with intricate embroidery. Available in multiple colours and sizes.',
    },
    {
      name: 'Zarafshan Lehenga',
      slug: 'zarafshan-lehenga',
      description: 'Opulent bridal lehenga with hand-crafted thread embroidery and sequin work on pure georgette.',
      basePrice: 12500000,
      comparePrice: 14500000,
      category: catMap['bridal-lehengas'],
      collectionRef: colMap['bridal-lehengas-suits'],
      images: [PLACEHOLDER_IMG('zarafshan', 1), PLACEHOLDER_IMG('zarafshan', 2)],
      variants: makeVariants(12500000, LEHENGA_SIZES, [
        { name: 'Peach', hex: '#FFCBA4' },
        { name: 'Blush Pink', hex: '#FFB6C1' },
      ]),
      fabric: 'Georgette',
      workType: 'Thread Embroidery & Sequin',
      occasion: ['Wedding', 'Reception'],
      careInstructions: 'Dry clean only.',
      isActive: true, isFeatured: true, isNewArrival: false, isBestSeller: false,
      tags: ['bridal', 'lehenga', 'georgette', 'sequin'],
      soldCount: 22,
    },
    {
      name: 'Gulbahar Lehenga',
      slug: 'gulbahar-lehenga',
      description: 'Floral-inspired bridal lehenga with delicate mirror work and hand embroidery.',
      basePrice: 9500000,
      comparePrice: 11000000,
      category: catMap['bridal-lehengas'],
      collectionRef: colMap['bridal-lehengas-suits'],
      images: [PLACEHOLDER_IMG('gulbahar', 1)],
      variants: makeVariants(9500000, LEHENGA_SIZES, [
        { name: 'Red', hex: '#8B0000' },
        { name: 'Mint Green', hex: '#98D8C8' },
      ]),
      fabric: 'Velvet',
      workType: 'Mirror Work & Embroidery',
      occasion: ['Wedding', 'Mehendi'],
      careInstructions: 'Dry clean only.',
      isActive: true, isFeatured: false, isNewArrival: true, isBestSeller: false,
      tags: ['bridal', 'lehenga', 'mirror-work', 'velvet'],
      soldCount: 15,
    },
    // ── Suits ─────────────────────────────────────────────────────────────
    {
      name: 'Cotton Kurta Set — Classic',
      slug: 'cotton-kurta-set-classic',
      description: 'Lightweight cotton kurta set perfect for daily wear and formal occasions. Breathable and stylish.',
      basePrice: 429900,
      comparePrice: 550000,
      category: catMap['suits'],
      collectionRef: colMap['formals-cotton-kurta-set'],
      images: [PLACEHOLDER_IMG('cotton-kurta', 1), PLACEHOLDER_IMG('cotton-kurta', 2)],
      variants: makeVariants(429900, SUIT_SIZES, [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Sky Blue', hex: '#87CEEB' },
        { name: 'Sage Green', hex: '#8FBC8F' },
      ]),
      fabric: 'Cotton',
      workType: 'Block Print',
      occasion: ['Formal', 'Casual', 'Daily Wear'],
      careInstructions: 'Machine wash cold. Iron on medium heat.',
      isActive: true, isFeatured: true, isNewArrival: true, isBestSeller: true,
      tags: ['suits', 'cotton', 'formal', 'kurta-set'],
      soldCount: 89,
    },
    {
      name: 'Signature Co-Ord Set',
      slug: 'signature-co-ord-set',
      description: 'Our signature coordinated set — elevated fabrics, modern silhouette, timeless appeal.',
      basePrice: 679900,
      comparePrice: 850000,
      category: catMap['co-ord-sets'],
      collectionRef: colMap['signature-co-ord-sets'],
      images: [PLACEHOLDER_IMG('co-ord-set', 1)],
      variants: makeVariants(679900, SUIT_SIZES, [
        { name: 'Mint Green', hex: '#98D8C8' },
        { name: 'Lavender', hex: '#E6E6FA' },
        { name: 'Terracotta', hex: '#E2725B' },
      ]),
      fabric: 'Chanderi Silk',
      workType: 'Hand Block Print',
      occasion: ['Party Wear', 'Sangeet', 'Festive'],
      careInstructions: 'Dry clean recommended.',
      isActive: true, isFeatured: true, isNewArrival: true, isBestSeller: false,
      tags: ['co-ord-sets', 'chanderi', 'festive'],
      soldCount: 63,
    },
    {
      name: 'Summer Essential Cotton Suit',
      slug: 'summer-essential-cotton-suit',
      description: 'Stay cool and stylish this season with our lightweight unstitched cotton suit in vibrant prints.',
      basePrice: 329900,
      comparePrice: 420000,
      category: catMap['suits'],
      collectionRef: colMap['summer-essentials'],
      images: [PLACEHOLDER_IMG('summer-suit', 1)],
      variants: makeVariants(329900, ['Free Size'], [
        { name: 'Yellow', hex: '#FFD700' },
        { name: 'Peach', hex: '#FFCBA4' },
        { name: 'Powder Blue', hex: '#B0E0E6' },
      ]),
      fabric: 'Cotton',
      workType: 'Digital Print',
      occasion: ['Casual', 'Daily Wear', 'Festive'],
      careInstructions: 'Machine wash cold.',
      isActive: true, isFeatured: false, isNewArrival: true, isBestSeller: false,
      tags: ['suits', 'summer', 'cotton', 'unstitched'],
      soldCount: 112,
    },
    // ── Jewellery ────────────────────────────────────────────────────────
    {
      name: 'Kundan Choker Set',
      slug: 'kundan-choker-set',
      description: 'Traditional kundan choker with earrings and maangtikka — the perfect bridal jewellery set.',
      basePrice: 149900,
      comparePrice: 200000,
      category: catMap['jewellery'],
      collectionRef: colMap['jewellery'],
      images: [PLACEHOLDER_IMG('kundan-choker', 1)],
      variants: [{ size: 'One Size', color: 'Gold', colorHex: '#C49A5A', sku: 'JWL-001', price: 149900, comparePrice: 200000, stock: 10 }],
      fabric: 'Metal & Stone',
      workType: 'Kundan Setting',
      occasion: ['Wedding', 'Reception', 'Festive'],
      careInstructions: 'Wipe with soft cloth. Store in pouch.',
      isActive: true, isFeatured: true, isNewArrival: true, isBestSeller: true,
      tags: ['jewellery', 'kundan', 'bridal', 'choker'],
      soldCount: 34,
    },
    // ── The Bag Edit ─────────────────────────────────────────────────────
    {
      name: 'Embroidered Potli',
      slug: 'embroidered-potli',
      description: 'Handcrafted embroidered potli bag — a timeless bridal accessory.',
      basePrice: 329900,
      comparePrice: 450000,
      category: catMap['handbags'],
      collectionRef: colMap['the-bag-edit'],
      images: [PLACEHOLDER_IMG('potli', 1)],
      variants: [
        { size: 'One Size', color: 'Maroon', colorHex: '#8B1F1F', sku: 'BAG-001', price: 329900, comparePrice: 450000, stock: 15 },
        { size: 'One Size', color: 'Gold', colorHex: '#C49A5A', sku: 'BAG-002', price: 329900, comparePrice: 450000, stock: 12 },
      ],
      fabric: 'Velvet',
      workType: 'Zari Embroidery',
      occasion: ['Wedding', 'Reception', 'Sangeet'],
      careInstructions: 'Spot clean only.',
      isActive: true, isFeatured: true, isNewArrival: false, isBestSeller: true,
      tags: ['bags', 'potli', 'bridal', 'embroidered'],
      soldCount: 78,
    },
    {
      name: 'Beaded Clutch',
      slug: 'beaded-clutch',
      description: 'Elegant beaded clutch perfect for evening events and bridal functions.',
      basePrice: 429900,
      comparePrice: 560000,
      category: catMap['clutches'],
      collectionRef: colMap['the-bag-edit'],
      images: [PLACEHOLDER_IMG('clutch', 1)],
      variants: [
        { size: 'One Size', color: 'Ivory', colorHex: '#F5F0E8', sku: 'CLT-001', price: 429900, comparePrice: 560000, stock: 8 },
        { size: 'One Size', color: 'Black', colorHex: '#1A1A1A', sku: 'CLT-002', price: 429900, comparePrice: 560000, stock: 10 },
      ],
      fabric: 'Satin & Beads',
      workType: 'Hand Beading',
      occasion: ['Wedding', 'Cocktail', 'Party Wear'],
      careInstructions: 'Wipe with damp cloth.',
      isActive: true, isFeatured: false, isNewArrival: true, isBestSeller: false,
      tags: ['bags', 'clutch', 'evening', 'beaded'],
      soldCount: 41,
    },
    // ── Sarees ───────────────────────────────────────────────────────────
    {
      name: 'Zari Silk Saree',
      slug: 'zari-silk-saree',
      description: 'Opulent Banarasi silk saree with intricate zari work. A timeless piece for weddings and receptions.',
      basePrice: 999900,
      comparePrice: 1299900,
      category: catMap['sarees'],
      collectionRef: colMap['saree-edit'],
      images: [PLACEHOLDER_IMG('zari-saree', 1)],
      variants: [
        { size: 'One Size (6.3m)', color: 'Red', colorHex: '#8B0000', sku: 'SAR-001', price: 999900, comparePrice: 1299900, stock: 6 },
        { size: 'One Size (6.3m)', color: 'Navy Blue', colorHex: '#000080', sku: 'SAR-002', price: 999900, comparePrice: 1299900, stock: 4 },
      ],
      fabric: 'Banarasi Silk',
      workType: 'Zari Weave',
      occasion: ['Wedding', 'Reception', 'Festive'],
      careInstructions: 'Dry clean only. Store wrapped in muslin.',
      isActive: true, isFeatured: true, isNewArrival: false, isBestSeller: true,
      tags: ['sarees', 'banarasi', 'silk', 'zari', 'wedding'],
      soldCount: 29,
    },
    // ── Occasion Lehengas ────────────────────────────────────────────────
    {
      name: 'Mehfil-e-Khus Lehenga',
      slug: 'mehfil-e-khus-lehenga',
      description: 'A vibrant party lehenga with sequin embellishments — perfect for sangeet and cocktail events.',
      basePrice: 10500000,
      comparePrice: 12500000,
      category: catMap['bridal-lehengas'],
      collectionRef: colMap['occasion-lehengas'],
      images: [PLACEHOLDER_IMG('mehfil-lehenga', 1)],
      variants: makeVariants(10500000, LEHENGA_SIZES, [
        { name: 'Teal', hex: '#008080' },
        { name: 'Purple', hex: '#800080' },
      ]),
      fabric: 'Net',
      workType: 'Sequin & Thread Embroidery',
      occasion: ['Sangeet', 'Cocktail', 'Reception'],
      careInstructions: 'Dry clean only.',
      isActive: true, isFeatured: false, isNewArrival: true, isBestSeller: false,
      tags: ['lehenga', 'sequin', 'sangeet', 'cocktail'],
      soldCount: 18,
    },
  ];

  const products = await Product.insertMany(PRODUCTS);
  console.log(`✅ Seeded ${products.length} products`);

  // Check for admin user in Better Auth's user collection
  // Note: Better Auth manages its own users collection. This creates a reference record.
  console.log('\n📝 Admin setup note:');
  console.log('   Register at /register with your email, then run:');
  console.log('   db.users.updateOne({ email: "YOUR_EMAIL" }, { $set: { role: "admin" } })');
  console.log('   in MongoDB Atlas to grant admin access.\n');

  console.log('🎉 Seed complete!');
  console.log(`   Categories: ${cats.length}`);
  console.log(`   Collections: ${cols.length}`);
  console.log(`   Products: ${products.length}`);
  console.log('\n⚠️  Image URLs are placeholders — upload real images to Cloudinary and update.');

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
