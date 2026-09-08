/**
 * Database seed script
 * Run: npx tsx scripts/seed.ts
 *
 * Seeds categories, collections, and luxury products with authentic images and data.
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('MONGODB_URI not set in .env.local');

// ─── Schemas matching app models ─────────────────────────────────────────────

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    image: String,
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

const CollectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    image: String,
    bannerImage: String,
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

const VariantSchema = new mongoose.Schema({
  size: String,
  color: String,
  colorHex: String,
  material: String,
  sku: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  comparePrice: Number,
  stock: { type: Number, default: 0 },
  images: [String],
  isActive: { type: Boolean, default: true },
});

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: String,
    basePrice: { type: Number, required: true, min: 0 },
    comparePrice: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    collectionRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
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
    averageRating: { type: Number, default: 5 },
    reviewCount: { type: Number, default: 0 },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true }
);

// Models
const Category = mongoose.models.Category ?? mongoose.model('Category', CategorySchema);
const Collection = mongoose.models.Collection ?? mongoose.model('Collection', CollectionSchema);
const Product = mongoose.models.Product ?? mongoose.model('Product', ProductSchema);

// ─── Data Definitions ────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Bridal Lehengas', slug: 'bridal-lehengas', description: 'Exquisite bridal lehengas for your most special day', image: '/images/cats/bridal.webp', sortOrder: 1, isActive: true },
  { name: 'Bridesmaid Lehengas', slug: 'bridesmaid-lehengas', description: 'Beautiful coordinated looks for the bridal squad', image: '/images/cats/bridesmaid.webp', sortOrder: 2, isActive: true },
  { name: 'Suits', slug: 'suits', description: 'Elegantly crafted suits and royal anarkalis', image: '/images/cats/suits.webp', sortOrder: 3, isActive: true },
  { name: 'Co-ord Sets', slug: 'co-ord-sets', description: 'Signature co-ordinated sets', image: '/images/cats/coord.webp', sortOrder: 4, isActive: true },
  { name: 'Jewellery', slug: 'jewellery', description: 'Statement Jadau & Kundan jewellery pieces', image: '/images/cats/jewellery.webp', sortOrder: 5, isActive: true },
  { name: 'The Bag Edit', slug: 'the-bag-edit', description: 'Luxury handcrafted potlis and clutches', image: '/images/cats/bags.webp', sortOrder: 6, isActive: true },
];

const COLLECTIONS = [
  {
    name: 'Bridal Collection',
    slug: 'bridal-lehengas-suits',
    description: 'Statement bridal pieces for your most celebrated day — crafted with intricate zari work and premium fabrics.',
    bannerImage: '/images/products/noor-e-ishq.webp',
    image: '/images/products/noor-e-ishq.webp',
    isFeatured: true,
    sortOrder: 1,
    seoTitle: 'Bridal Lehengas & Suits | Aafreen Couture',
    seoDescription: 'Discover exquisite bridal lehengas and suits by Aafreen Couture. Timeless craftsmanship for your wedding day.',
  },
  {
    name: 'Bridesmaid Lehengas',
    slug: 'bridesmaid-lehengas',
    description: 'Beautiful coordinated lehengas for the bridal squad.',
    bannerImage: '/images/products/gulbahar.webp',
    image: '/images/products/gulbahar.webp',
    isFeatured: true,
    sortOrder: 2,
  },
  {
    name: 'Signature Co-Ord Sets',
    slug: 'signature-co-ord-sets',
    description: 'Curated sets that define modern elegance.',
    bannerImage: '/images/products/roshani-coord.webp',
    image: '/images/products/roshani-coord.webp',
    isFeatured: true,
    sortOrder: 3,
  },
  {
    name: 'The Bag Edit',
    slug: 'the-bag-edit',
    description: 'Luxury in every detail — potlis, clutches, and handbags.',
    bannerImage: '/images/products/begum-potli.webp',
    image: '/images/products/begum-potli.webp',
    isFeatured: true,
    sortOrder: 4,
  },
];

function makeVariants(basePrice: number, sizes: string[], colors: { name: string; hex: string }[], img: string) {
  const variants = [];
  for (const color of colors) {
    for (const size of sizes) {
      variants.push({
        size,
        color: color.name,
        colorHex: color.hex,
        sku: `AFR-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        price: basePrice,
        comparePrice: Math.round((basePrice * 1.2) / 100) * 100,
        stock: Math.floor(Math.random() * 10) + 3,
        images: [img],
        isActive: true,
      });
    }
  }
  return variants;
}

const LEHENGA_SIZES = ['S', 'M', 'L', 'XL'];
const SUIT_SIZES = ['S', 'M', 'L', 'XL'];

async function seed() {
  console.log('🌱 Connecting to MongoDB Atlas…');
  await mongoose.connect(MONGODB_URI!, { serverSelectionTimeoutMS: 10000 });
  console.log('✅ Connected successfully!');

  console.log('🗑  Clearing old collections…');
  await Promise.all([
    Category.deleteMany({}),
    Collection.deleteMany({}),
    Product.deleteMany({}),
  ]);

  console.log('📦 Seeding categories…');
  const insertedCats = await Category.insertMany(CATEGORIES);
  const catMap: Record<string, mongoose.Types.ObjectId> = {};
  insertedCats.forEach((c) => {
    catMap[c.slug] = c._id as mongoose.Types.ObjectId;
  });
  console.log(`✅ Seeded ${insertedCats.length} categories`);

  console.log('📦 Seeding collections…');
  const insertedCols = await Collection.insertMany(COLLECTIONS);
  const colMap: Record<string, mongoose.Types.ObjectId> = {};
  insertedCols.forEach((c) => {
    colMap[c.slug] = c._id as mongoose.Types.ObjectId;
  });
  console.log(`✅ Seeded ${insertedCols.length} collections`);

  console.log('✨ Seeding luxury couture products…');
  const PRODUCTS = [
    {
      name: 'Shahi Sindoori Red & Heritage Zardozi Bridal Lehenga',
      slug: 'shahi-sindoori-red-heritage-zardozi-bridal-lehenga',
      description: 'A masterpiece of royal bridal couture, the Shahi Sindoori Red Lehenga is tailored in pure heritage raw silk with an imperial double-cancan flare. The skirt is richly embellished with Mughal architectural jharokhas, peacock (mor) kalis, palm tree motifs, and exquisite hand-rendered dabka, mukaish, and antique tilla zardozi. Paired with a regal red silk blouse boasting a sweetheart neckline and intricate jharokha embroidery, alongside an embroidered sheer dupatta with a scalloped border. Complete with a signature matching crimson red silk potli bag adorned with fine zardozi flora and pearl tassels.',
      shortDescription: 'Sindoori crimson red pure raw silk heritage bridal lehenga featuring Mughal architectural jharokhas, peacock motifs, and matching embroidered potli.',
      basePrice: 4085000,
      comparePrice: 4700000,
      category: catMap['bridal-lehengas'],
      collectionRef: colMap['bridal-lehengas-suits'],
      images: [
        '/images/products/shahi-sindoori-red-bridal-lehenga-0929.webp',
        '/images/products/shahi-sindoori-red-bridal-lehenga-0922.webp',
        '/images/products/shahi-sindoori-red-bridal-lehenga-0927.webp',
        '/images/products/shahi-sindoori-red-bridal-lehenga-0925.webp',
      ],
      variants: makeVariants(4085000, LEHENGA_SIZES, [{ name: 'Sindoori Crimson Red', hex: '#C41E3A' }], '/images/products/shahi-sindoori-red-bridal-lehenga-0929.webp'),
      fabric: 'Heritage Pure Raw Silk, Velvet Accents, Micro Net Dupatta & Heavy Double Cancan Flare',
      workType: 'Handcrafted Dabka, Mukaish, Antique Tilla, Mughal Architectural Jharokha & Peacock Kalis',
      occasion: ['Wedding', 'Bridal', 'Pheras', 'Royal Occasion'],
      careInstructions: 'Specialist dry clean only. Preserve wrapped in unbleached pure cotton muslin with acid-free butter paper.',
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      tags: ['bridal', 'lehenga', 'bridal-lehengas', 'red', 'sindoori', 'crimson', 'gold', 'zardozi', 'wedding', 'royal', 'heirloom', 'mughal'],
      averageRating: 5.0,
      reviewCount: 42,
      soldCount: 56,
      seoTitle: 'Shahi Sindoori Red & Heritage Zardozi Bridal Lehenga | Aafreen Couture',
      seoDescription: 'Imperial sindoori crimson red raw silk bridal lehenga with handcrafted Mughal jharokhas, peacock motifs, antique dabka zardozi, and matching potli.',
    },
    {
      name: 'Mumtaz Blossom Pink & Scalloped Zardozi Bridal Lehenga',
      slug: 'mumtaz-blossom-pink-scalloped-zardozi-bridal-lehenga',
      description: 'An ode to Mughal grandeur and feminine grace, the Mumtaz Blossom Pink Bridal Lehenga is tailored in pure organza-lined raw silk with an imperial kalidar flare. Adorned with delicate vertical silver tilla and antique gold zardozi jaal work, the skirt transitions into a dramatic scalloped hem enriched with handcrafted lotus and architectural jharokha embroidery.',
      shortDescription: 'Blossom pink kalidar raw silk bridal lehenga with scalloped lotus zardozi hem, sweetheart blouse, and matching embroidered potli bag.',
      basePrice: 2975000,
      comparePrice: 3450000,
      category: catMap['bridal-lehengas'],
      collectionRef: colMap['bridal-lehengas-suits'],
      images: [
        '/images/products/mumtaz-blossom-pink-bridal-lehenga-0994.webp',
        '/images/products/mumtaz-blossom-pink-bridal-lehenga-0991.webp',
        '/images/products/mumtaz-blossom-pink-bridal-lehenga-0969.webp',
        '/images/products/mumtaz-blossom-pink-bridal-lehenga-0966.webp',
      ],
      variants: makeVariants(2975000, LEHENGA_SIZES, [{ name: 'Blossom Pink', hex: '#F472B6' }], '/images/products/mumtaz-blossom-pink-bridal-lehenga-0994.webp'),
      fabric: 'Pure Mulberry Raw Silk, Shimmer Tissue Accents, Sheer Net Dupatta & Double Cancan Kalis',
      workType: 'Handcrafted Silver-Tilla, Antique Gold Zardozi, Scalloped Lotus Hem, Dabka, Mukaish & Pearl Latkans',
      occasion: ['Wedding', 'Bridal', 'Pheras', 'Royal Reception'],
      careInstructions: 'Specialist dry clean only. Preserve wrapped in unbleached pure cotton muslin.',
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      tags: ['bridal', 'lehenga', 'bridal-lehengas', 'pink', 'blossom', 'rani-pink', 'silver', 'gold', 'zardozi', 'wedding', 'royal', 'heirloom', 'lotus'],
      averageRating: 5.0,
      reviewCount: 36,
      soldCount: 48,
      seoTitle: 'Mumtaz Blossom Pink & Scalloped Zardozi Bridal Lehenga | Aafreen Couture',
      seoDescription: 'Handcrafted blossom pink raw silk bridal lehenga with architectural scalloped lotus border, silver-tilla zardozi, sweetheart blouse, and matching embroidered potli.',
    },
    {
      name: 'Gulbahar Rose Garden Lehenga',
      slug: 'gulbahar-lehenga',
      description: 'Romantic blush rose pink and sage green raw silk lehenga featuring exquisite pastel floral resham threadwork, hand-set mirror accents, and a scalloped organza dupatta.',
      shortDescription: 'Blush pink and sage raw silk lehenga with floral resham and mirror work.',
      basePrice: 9500000,
      comparePrice: 11000000,
      category: catMap['bridesmaid-lehengas'],
      collectionRef: colMap['bridesmaid-lehengas'],
      images: ['/images/products/gulbahar.webp', '/images/products/gulbahar.jpg'],
      variants: makeVariants(9500000, LEHENGA_SIZES, [{ name: 'Blush Pink', hex: '#FFB6C1' }], '/images/products/gulbahar.webp'),
      fabric: 'Raw Silk & Organza',
      workType: 'Resham & Mirror Embroidery',
      occasion: ['Mehendi', 'Sangeet', 'Wedding Guest'],
      careInstructions: 'Dry clean only.',
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      tags: ['lehenga', 'pink', 'sage', 'mehendi', 'bridesmaid', 'mirror-work'],
      averageRating: 4.9,
      reviewCount: 15,
      soldCount: 24,
      seoTitle: 'Gulbahar Rose Garden Lehenga | Aafreen Couture',
      seoDescription: 'Blush pink and sage green raw silk lehenga with pastel floral embroidery and mirror work.',
    },
    {
      name: 'Mehrunissa Royal Velvet Anarkali',
      slug: 'mehrunissa-velvet-anarkali',
      description: 'Regal deep emerald green royal velvet floor-length anarkali suit gown with heavy antique gold tilla and zardozi embroidery on the yoke and kalis, paired with a sheer dupatta.',
      shortDescription: 'Emerald green velvet floor-length anarkali with antique gold tilla work.',
      basePrice: 5499900,
      comparePrice: 6499900,
      category: catMap['suits'],
      collectionRef: colMap['bridal-lehengas-suits'],
      images: ['/images/products/mehrunissa-anarkali.webp', '/images/products/mehrunissa-anarkali.jpg'],
      variants: makeVariants(5499900, SUIT_SIZES, [{ name: 'Emerald Green', hex: '#1B4D3E' }], '/images/products/mehrunissa-anarkali.webp'),
      fabric: 'Micro Velvet',
      workType: 'Antique Tilla & Zardozi',
      occasion: ['Reception', 'Sangeet', 'Festive'],
      careInstructions: 'Dry clean only.',
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      tags: ['suits', 'anarkali', 'emerald', 'velvet', 'reception', 'tilla'],
      averageRating: 5.0,
      reviewCount: 22,
      soldCount: 51,
      seoTitle: 'Mehrunissa Royal Velvet Anarkali | Aafreen Couture',
      seoDescription: 'Emerald green velvet floor-length anarkali suit with handcrafted antique gold tilla embroidery.',
    },
    {
      name: 'Roshani Chanderi Co-Ord Set',
      slug: 'roshani-chanderi-coord-set',
      description: 'Contemporary blush peach and rose gold Chanderi silk co-ord set featuring a tailored peplum embroidered top, flared tiered sharara trousers, and a hand-worked gotapatti belt.',
      shortDescription: 'Blush peach Chanderi silk peplum top and flared sharara co-ord set.',
      basePrice: 3899900,
      comparePrice: 4500000,
      category: catMap['co-ord-sets'],
      collectionRef: colMap['signature-co-ord-sets'],
      images: ['/images/products/roshani-coord.webp', '/images/products/roshani-coord.jpg'],
      variants: makeVariants(3899900, SUIT_SIZES, [{ name: 'Blush Peach', hex: '#FFCBA4' }], '/images/products/roshani-coord.webp'),
      fabric: 'Chanderi Silk',
      workType: 'Gotapatti & Resham Embroidery',
      occasion: ['Mehendi', 'Haldi', 'Festive', 'Party Wear'],
      careInstructions: 'Dry clean recommended.',
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      tags: ['coord', 'co-ord-sets', 'chanderi', 'peach', 'sharara', 'mehendi'],
      averageRating: 4.7,
      reviewCount: 18,
      soldCount: 39,
      seoTitle: 'Roshani Chanderi Silk Co-Ord Set | Aafreen Couture',
      seoDescription: 'Blush peach Chanderi silk co-ord set with peplum top, flared sharara pants, and embroidered belt.',
    },
    {
      name: 'Sitara Jadau Kundan Polki Choker',
      slug: 'sitara-jadau-kundan-choker',
      description: 'Royal 22k gold-plated Jadau Kundan polki choker necklace featuring natural emerald teardrop beads, ruby accents, and lustrous South Sea pearls, complete with matching earrings and maangtikka.',
      shortDescription: '22k gold-plated Jadau Kundan polki choker set with emerald drops and pearls.',
      basePrice: 2899900,
      comparePrice: 3500000,
      category: catMap['jewellery'],
      collectionRef: colMap['bridal-lehengas-suits'],
      images: ['/images/products/sitara-polki-choker.webp', '/images/products/sitara-polki-choker.jpg'],
      variants: [{ size: 'One Size', color: 'Gold Emerald', colorHex: '#C49A5A', sku: 'STR-JWL-OS', price: 2899900, comparePrice: 3500000, stock: 8, images: ['/images/products/sitara-polki-choker.webp'], isActive: true }],
      fabric: '22k Gold Plated Brass & Semi-Precious Stones',
      workType: 'Jadau Kundan Setting',
      occasion: ['Wedding', 'Reception', 'Bridal'],
      careInstructions: 'Keep away from moisture and perfume. Store in velvet pouch.',
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      tags: ['jewellery', 'kundan', 'polki', 'choker', 'bridal', 'gold'],
      averageRating: 4.9,
      reviewCount: 31,
      soldCount: 68,
      seoTitle: 'Sitara Jadau Kundan Polki Choker Set | Aafreen Couture',
      seoDescription: 'Handcrafted 22k gold-plated Jadau Kundan polki choker necklace set with natural emeralds and pearls.',
    },
    {
      name: 'Shahzadi Royal Silk Sharara Suit',
      slug: 'shahzadi-silk-sharara-suit',
      description: 'Majestic royal sapphire blue pure raw silk short kurta with dramatically flared tiered sharara pants, decorated with fine marodi and gota patti borders and a matching organza dupatta.',
      shortDescription: 'Royal sapphire blue raw silk kurta and flared tiered sharara suit.',
      basePrice: 4899900,
      comparePrice: 5800000,
      category: catMap['suits'],
      collectionRef: colMap['bridal-lehengas-suits'],
      images: ['/images/products/shahzadi-sharara.webp', '/images/products/shahzadi-sharara.jpg'],
      variants: makeVariants(4899900, SUIT_SIZES, [{ name: 'Royal Blue', hex: '#1A1A5E' }], '/images/products/shahzadi-sharara.webp'),
      fabric: 'Pure Raw Silk & Organza',
      workType: 'Marodi & Gota Patti',
      occasion: ['Sangeet', 'Wedding Guest', 'Festive'],
      careInstructions: 'Dry clean only.',
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      tags: ['suits', 'sharara', 'royal-blue', 'silk', 'sangeet', 'gota-patti'],
      averageRating: 4.8,
      reviewCount: 14,
      soldCount: 29,
      seoTitle: 'Shahzadi Royal Silk Sharara Suit | Aafreen Couture',
      seoDescription: 'Royal sapphire blue raw silk kurta with flared tiered sharara and gota patti marodi border.',
    },
    {
      name: 'Begum Handcrafted Zardozi Potli Bag',
      slug: 'begum-embroidered-potli-bag',
      description: 'Handcrafted deep crimson velvet bridal potli bag featuring opulent gold zardozi and pearl motifs, a woven pearl handle, and ornate hanging jhumka latkan tassels.',
      shortDescription: 'Deep crimson velvet bridal potli bag with gold zardozi embroidery and pearl handle.',
      basePrice: 1499900,
      comparePrice: 1899900,
      category: catMap['the-bag-edit'],
      collectionRef: colMap['the-bag-edit'],
      images: ['/images/products/begum-potli.webp', '/images/products/begum-potli.jpg'],
      variants: [{ size: 'One Size', color: 'Crimson Maroon', colorHex: '#8B1F1F', sku: 'BGM-PTL-OS', price: 1499900, comparePrice: 1899900, stock: 12, images: ['/images/products/begum-potli.webp'], isActive: true }],
      fabric: 'Pure Silk Velvet & Pearls',
      workType: 'Hand Zardozi & Pearl Work',
      occasion: ['Wedding', 'Reception', 'Bridal'],
      careInstructions: 'Spot clean only. Store in velvet dust bag.',
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: true,
      tags: ['bags', 'potli', 'bridal', 'velvet', 'zardozi', 'pearls'],
      averageRating: 5.0,
      reviewCount: 43,
      soldCount: 94,
      seoTitle: 'Begum Handcrafted Zardozi Potli Bag | Aafreen Couture',
      seoDescription: 'Crimson maroon velvet bridal potli with handcrafted gold zardozi and freshwater pearl handle.',
    },
  ];

  const insertedProducts = await Product.insertMany(PRODUCTS);
  console.log(`✅ Successfully seeded ${insertedProducts.length} luxury products!`);

  console.log('🎉 Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
