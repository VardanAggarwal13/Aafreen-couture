import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set in .env.local');
  process.exit(1);
}

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
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
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

const Category = mongoose.models.Category ?? mongoose.model('Category', CategorySchema);
const Collection = mongoose.models.Collection ?? mongoose.model('Collection', CollectionSchema);
const Product = mongoose.models.Product ?? mongoose.model('Product', ProductSchema);

const productsToInsert = [
  // --- 6th Suit: Noorani Moonstone Lilac ---
  {
    name: 'Noorani Moonstone Lilac Handcrafted Schiffli Silk Suit',
    slug: 'noorani-moonstone-lilac-handcrafted-silk-suit',
    description:
      'An exquisite manifestation of regal grace, the Noorani Handcrafted Unstitched Suit is tailored from premium micro-velvet and shimmer silk in an ethereal Moonstone Lilac (Smoky Mauve) palette. The highlight of this masterpiece is the handcrafted schiffli cutwork lace hemline enriched with silver bullion wire, shimmering cutdana, and micro-crystals. The neckline is adorned with delicate cutwork floral resham threadwork and an accompanying pearl tikka. Paired with coordinating silk trousers and a sheer pure organza dupatta accented with chinar leaf motifs and scalloped floral borders. Complete with an artisanal crescent crystal bridal clutch with a silver beaded strap. A showstopper ensemble designed for lavish receptions, cocktail celebrations, and royal evenings.',
    shortDescription:
      'Pure micro-velvet & shimmer silk unstitched suit in Moonstone Lilac featuring schiffli cutwork lace hemline, silver zardozi neckline, chinar leaf organza dupatta, and matching crescent crystal clutch.',
    basePrice: 4250000,
    comparePrice: 4950000,
    images: [
      '/images/products/noorani-moonstone-lilac-silk-suit-1.webp',
      '/images/products/noorani-moonstone-lilac-silk-suit-2.webp',
      '/images/products/noorani-moonstone-lilac-silk-suit-3.webp',
      '/images/products/noorani-moonstone-lilac-silk-suit-4.webp',
      '/images/products/noorani-moonstone-lilac-silk-suit-5.webp',
      '/images/products/noorani-moonstone-lilac-silk-suit-6.webp',
    ],
    fabric: 'Pure Micro-Velvet & Shimmer Silk with Pure Organza Dupatta',
    workType: 'Handcrafted Schiffli Cutwork Lace Hemline, Silver Zardozi, Micro-Crystals, Pearl Droplets & Resham Florets',
    color: 'Moonstone Lilac (Smoky Mauve)',
    colorHex: '#9B8A9E',
    skuPrefix: 'NRN-LLC',
    tags: [
      'suits',
      'handcrafted-luxury',
      'custom-embroidered-suits',
      'unstitched',
      'unstitched-suit',
      'partywear-unstitched',
      'moonstone-lilac',
      'lilac',
      'mauve',
      'silver',
      'schiffli',
      'cutwork',
      'velvet',
      'silk',
      'crystal-clutch',
      'luxury-suit',
      'festive',
    ],
    occasion: ['Reception', 'Cocktail Celebration', 'Grand Wedding', 'Sangeet Soiree', 'Evening Gala'],
    careInstructions: 'Dry clean only. Store wrapped in soft muslin cloth. Do not spray perfume directly on crystal embellishments.',
  },

  // --- 7th Suit: Gul-e-Rana Dusty Rose ---
  {
    name: 'Gul-e-Rana Dusty Rose Handcrafted Zardozi Silk Suit',
    slug: 'gulerana-dusty-rose-handcrafted-silk-suit',
    description:
      'A poetic tribute to imperial grandeur, the Gul-e-Rana Handcrafted Unstitched Suit is tailored from pure silk georgette in a romantic Dusty Rose hue. The shirt panel is crowned by an opulent antique gold and silver bullion zardozi neckline collar sculpted with regal paisley wings, kundan insets, dabka, and micro-sequins. Intricate handcrafted bullion floral vines cascade gracefully down the front panel. Accompanied by coordinating pure silk trousers and an ethereal pure organza dupatta framed with a rich antique gold gotta patti fringe and scalloped zardozi border. An unforgettable ensemble tailored for festive weddings, sangeet ceremonies, and royal milestone celebrations.',
    shortDescription:
      'Pure silk georgette unstitched suit in romantic Dusty Rose featuring heavy antique bullion zardozi paisley collar, kundan work, cascading floral vines, and gotta patti fringe organza dupatta.',
    basePrice: 3950000,
    comparePrice: 4650000,
    images: [
      '/images/products/gulerana-dusty-rose-silk-suit-1.webp',
      '/images/products/gulerana-dusty-rose-silk-suit-2.webp',
      '/images/products/gulerana-dusty-rose-silk-suit-3.webp',
      '/images/products/gulerana-dusty-rose-silk-suit-4.webp',
    ],
    fabric: 'Pure Silk Georgette & Pure Organza Dupatta',
    workType: 'Handcrafted Antique Bullion Zardozi Collar, Kundan Neckline, Floral Vines, Dabka & Gotta Patti Fringe',
    color: 'Dusty Rose (Old Rose Pink)',
    colorHex: '#B86B82',
    skuPrefix: 'GLR-DRS',
    tags: [
      'suits',
      'handcrafted-luxury',
      'custom-embroidered-suits',
      'unstitched',
      'unstitched-suit',
      'partywear-unstitched',
      'dusty-rose',
      'rose-pink',
      'pink',
      'georgette',
      'zardozi',
      'bullion-work',
      'kundan',
      'luxury-suit',
      'festive',
    ],
    occasion: ['Wedding', 'Sangeet', 'Mehendi', 'Reception', 'Festive Celebration'],
    careInstructions: 'Dry clean only. Store wrapped in soft muslin cloth. Avoid direct heat or perfume on bullion embroidery.',
  },

  // --- 8th Suit: Pariwash Sage Mint ---
  {
    name: 'Pariwash Sage Mint Handcrafted Marodi Silk Suit',
    slug: 'pariwash-sage-mint-handcrafted-silk-suit',
    description:
      'Understated nobility defined, the Pariwash Handcrafted Unstitched Suit combines serene Sage Mint Chanderi raw silk with a contrasting rich Dusty Rose Mauve silk base. The shirt is adorned with heritage antique gold marodi and tilla cord embroidery framing a gracefully curved sweetheart neckline with delicate paisley and floral sprigs. Accompanied by coordinating pure silk bottom fabric and a matching pure organza dupatta with gold tilla border edges. Perfect for discerning connoisseurs of minimalist elegance, intimate wedding functions, daytime celebrations, and cultural festivals.',
    shortDescription:
      'Pure Chanderi silk unstitched suit in serene Sage Mint with contrast rose mauve base, featuring antique gold marodi & tilla cord embroidery around the neckline and tilla-bordered dupatta.',
    basePrice: 3650000,
    comparePrice: 4250000,
    images: [
      '/images/products/pariwash-sage-mint-silk-suit-1.webp',
      '/images/products/pariwash-sage-mint-silk-suit-2.webp',
      '/images/products/pariwash-sage-mint-silk-suit-3.webp',
    ],
    fabric: 'Pure Chanderi Silk with Rose Mauve Silk Bottom',
    workType: 'Handcrafted Antique Gold Marodi Cord & Tilla Embroidery with Paisley Florets',
    color: 'Sage Mint & Dusty Mauve (Dual-Tone)',
    colorHex: '#8FA795',
    skuPrefix: 'PRW-SGM',
    tags: [
      'suits',
      'handcrafted-luxury',
      'custom-embroidered-suits',
      'unstitched',
      'unstitched-suit',
      'partywear-unstitched',
      'sage-mint',
      'mint-green',
      'seafoam',
      'mauve',
      'chanderi',
      'marodi-work',
      'tilla',
      'luxury-suit',
      'festive',
    ],
    occasion: ['Day Wedding', 'Roka Ceremony', 'Mehendi', 'Festive Gathering', 'Cultural Soiree'],
    careInstructions: 'Dry clean only. Store wrapped in soft unbleached muslin cloth.',
  },

  // --- 9th Suit: Gulrang Powder Blush ---
  {
    name: 'Gulrang Powder Blush Hand-Painted Botanical Silk Suit',
    slug: 'gulrang-powder-blush-hand-painted-silk-suit',
    description:
      'A whimsical symphony of fine art and couture, the Gulrang Handcrafted Unstitched Suit is fashioned from gossamer pure organza and Chanderi silk in a delicate Powder Blush (Pastel Lotus Pink) shade. The fabric is hand-painted by master artisans with enchanting botanical thistle and blooming flora in gradient mauve and moss green hues, delicately detailed with hand-embroidered fine metallic tilla wire and micro-sequin dewdrops. Paired with coordinating pure silk trousers and a matching sheer organza dupatta bordered with fine gold gotta fringe. An ethereal creation ideal for intimate morning ceremonies, garden soirees, and festive celebrations.',
    shortDescription:
      'Pure organza & Chanderi silk unstitched suit in Powder Blush featuring artisanal hand-painted botanical thistle motifs, fine tilla wire highlights, micro-sequins, and gotta fringe dupatta.',
    basePrice: 3450000,
    comparePrice: 3950000,
    images: [
      '/images/products/gulrang-powder-blush-silk-suit-1.webp',
      '/images/products/gulrang-powder-blush-silk-suit-2.webp',
      '/images/products/gulrang-powder-blush-silk-suit-3.webp',
    ],
    fabric: 'Pure Organza & Chanderi Silk',
    workType: 'Artisanal Hand-Painted Botanical Thistle Motifs, Delicate Tilla Wire Embroidery, Micro-Sequins & Gotta Trim',
    color: 'Powder Blush (Pastel Lotus Pink)',
    colorHex: '#E8B8C2',
    skuPrefix: 'GLR-PBL',
    tags: [
      'suits',
      'handcrafted-luxury',
      'custom-embroidered-suits',
      'unstitched',
      'unstitched-suit',
      'partywear-unstitched',
      'powder-blush',
      'blush-pink',
      'pastel-pink',
      'hand-painted',
      'organza',
      'chanderi',
      'botanical',
      'tilla-work',
      'luxury-suit',
      'festive',
    ],
    occasion: ['Garden Soiree', 'Haldi / Mehendi', 'Intimate Wedding', 'Day Celebration', 'High Tea'],
    careInstructions: 'Dry clean only. Hand-painted textiles should be handled with care. Store wrapped in unbleached muslin cloth.',
  },
];

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB Atlas successfully.');

  let cat = await Category.findOne({
    $or: [{ slug: 'custom-embroidered-suits' }, { slug: 'handcrafted-luxury' }],
  });

  let col = await Collection.findOne({
    $or: [{ slug: 'bridal-lehengas-suits' }, { slug: 'bridal-collection' }],
  });

  for (const item of productsToInsert) {
    const sizeDefinitions = [
      { size: 'Unstitched (Fabric Set)', suffix: 'UNST', price: item.basePrice, comparePrice: item.comparePrice, stock: 15 },
      { size: 'S (Custom Tailored)', suffix: 'S', price: item.basePrice, comparePrice: item.comparePrice, stock: 5 },
      { size: 'M (Custom Tailored)', suffix: 'M', price: item.basePrice, comparePrice: item.comparePrice, stock: 8 },
      { size: 'L (Custom Tailored)', suffix: 'L', price: item.basePrice, comparePrice: item.comparePrice, stock: 6 },
      { size: 'XL (Custom Tailored)', suffix: 'XL', price: item.basePrice, comparePrice: item.comparePrice, stock: 4 },
      { size: 'Made to Measure (Bespoke)', suffix: 'BESPOKE', price: item.basePrice + 300000, comparePrice: item.comparePrice + 300000, stock: 10 },
    ];

    const variants = sizeDefinitions.map((s) => ({
      size: s.size,
      color: item.color,
      colorHex: item.colorHex,
      material: item.fabric,
      sku: `${item.skuPrefix}-${s.suffix}`,
      price: s.price,
      comparePrice: s.comparePrice,
      stock: s.stock,
      images: item.images,
      isActive: true,
    }));

    const productData = {
      name: item.name,
      slug: item.slug,
      description: item.description,
      shortDescription: item.shortDescription,
      basePrice: item.basePrice,
      comparePrice: item.comparePrice,
      category: cat._id,
      collectionRef: col ? col._id : undefined,
      images: item.images,
      variants: variants,
      fabric: item.fabric,
      workType: item.workType,
      occasion: item.occasion,
      careInstructions: item.careInstructions,
      isActive: true,
      isFeatured: true,
      isNewArrival: true,
      isBestSeller: false,
      tags: item.tags,
      soldCount: 12,
      averageRating: 5.0,
      reviewCount: 7,
      seoTitle: `${item.name} | Aafreen Couture`,
      seoDescription: `${item.shortDescription} by Aafreen Couture.`,
    };

    const product = await Product.findOneAndUpdate(
      { slug: productData.slug },
      { $set: productData },
      { upsert: true, returnDocument: 'after' }
    );

    console.log(`✅ [${item.slug}] Upserted successfully (ID: ${product._id}, ₹${(product.basePrice / 100).toLocaleString('en-IN')})`);
  }

  await mongoose.disconnect();
  console.log('All remaining suits upserted into MongoDB Atlas!');
}

run().catch((err) => {
  console.error('Error upserting suits:', err);
  process.exit(1);
});
