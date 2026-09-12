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

const productImages = [
  '/images/products/mehrunisa-honey-gold-silk-suit-1.webp',
  '/images/products/mehrunisa-honey-gold-silk-suit-2.webp',
  '/images/products/mehrunisa-honey-gold-silk-suit-3.webp',
  '/images/products/mehrunisa-honey-gold-silk-suit-4.webp',
  '/images/products/mehrunisa-honey-gold-silk-suit-5.webp',
];

const sizeDefinitions = [
  { size: 'Unstitched (Fabric Set)', suffix: 'UNST', price: 3850000, comparePrice: 4500000, stock: 10 },
  { size: 'S (Custom Tailored)', suffix: 'S', price: 3850000, comparePrice: 4500000, stock: 5 },
  { size: 'M (Custom Tailored)', suffix: 'M', price: 3850000, comparePrice: 4500000, stock: 8 },
  { size: 'L (Custom Tailored)', suffix: 'L', price: 3850000, comparePrice: 4500000, stock: 6 },
  { size: 'XL (Custom Tailored)', suffix: 'XL', price: 3850000, comparePrice: 4500000, stock: 4 },
  { size: 'Made to Measure (Bespoke)', suffix: 'BESPOKE', price: 4150000, comparePrice: 4850000, stock: 10 },
];

const variants = sizeDefinitions.map((s) => ({
  size: s.size,
  color: 'Honey Gold (Antique Amber)',
  colorHex: '#D4AF37',
  material: 'Pure Raw Silk & Shimmer Tissue Silk',
  sku: `MHR-GLD-${s.suffix}`,
  price: s.price,
  comparePrice: s.comparePrice,
  stock: s.stock,
  images: productImages,
  isActive: true,
}));

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB Atlas successfully.');

  let cat = await Category.findOne({
    $or: [{ slug: 'custom-embroidered-suits' }, { slug: 'handcrafted-luxury' }],
  });

  if (!cat) {
    console.log('Creating category "Handcrafted Luxury" (custom-embroidered-suits)...');
    cat = await Category.create({
      name: 'Handcrafted Luxury',
      slug: 'custom-embroidered-suits',
      description: 'Artisanal unstitched & bespoke suits with intricate zardozi, gotta patti, and resham hand embroidery.',
      image: productImages[0],
      sortOrder: 10,
      isActive: true,
      seoTitle: 'Handcrafted Luxury Suits | Aafreen Couture',
      seoDescription: 'Discover handcrafted luxury unstitched and bespoke suits featuring antique zardozi and raw silk by Aafreen Couture.',
    });
  }

  let col = await Collection.findOne({
    $or: [{ slug: 'bridal-lehengas-suits' }, { slug: 'bridal-collection' }],
  });

  const productData = {
    name: 'Mehrunisa Honey Gold Handcrafted Zardozi Silk Suit',
    slug: 'mehrunisa-honey-gold-handcrafted-silk-suit',
    description:
      'A regal ode to heritage artistry, the Mehrunisa Handcrafted Unstitched Suit is spun from premium pure raw silk in a luminous honey gold tone. The front shirt piece is embellished with an intricate hand-embroidered floral jaal composed of fine antique gold and silver zardozi, hand-set micro-sequins, bullion metallic threadwork, dabka, and delicate resham accents. Complemented by coordinating pure raw silk bottom fabric and a matching shimmer tissue silk dupatta bordered with an opulent scalloped embroidered border. Includes a handcrafted bridal accessory potli bag. Ideal for luxury festive celebrations, family weddings, sangeet ceremonies, and grand evening occasions.',
    shortDescription:
      'Pure raw silk unstitched suit in luminous honey gold featuring intricate antique gold & silver zardozi jaal, bullion wire embroidery, scalloped dupatta, and matching potli bag.',
    basePrice: 3850000, // ₹38,500
    comparePrice: 4500000, // ₹45,000
    category: cat._id,
    collectionRef: col ? col._id : undefined,
    images: productImages,
    variants: variants,
    fabric: 'Pure Raw Silk & Shimmer Tissue Silk with Handcrafted Scalloped Dupatta',
    workType: 'Handcrafted Antique Gold & Silver Zardozi, Bullion Wire, Sequins Floral Jaal, Dabka & Resham Work',
    occasion: ['Wedding', 'Sangeet', 'Reception', 'Festive Celebration', 'Haldi / Mehendi', 'Grand Evening'],
    careInstructions:
      'Dry clean only. Store wrapped in soft unbleached muslin cloth. Avoid spraying perfume directly onto metallic zardozi.',
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    tags: [
      'suits',
      'handcrafted-luxury',
      'custom-embroidered-suits',
      'unstitched',
      'unstitched-suit',
      'partywear-unstitched',
      'honey-gold',
      'gold',
      'yellow',
      'silk',
      'zardozi',
      'bullion-work',
      'luxury-suit',
      'kurta',
      'embroidered',
      'festive',
    ],
    soldCount: 18,
    averageRating: 5.0,
    reviewCount: 14,
    seoTitle: 'Mehrunisa Honey Gold Handcrafted Zardozi Silk Suit | Aafreen Couture',
    seoDescription:
      'Handcrafted pure raw silk unstitched suit in luminous honey gold with intricate antique gold and silver zardozi floral jaal and scalloped dupatta by Aafreen Couture.',
  };

  const product = await Product.findOneAndUpdate(
    { slug: productData.slug },
    { $set: productData },
    { upsert: true, returnDocument: 'after' }
  );

  console.log('✅ Second product added to MongoDB Atlas successfully:');
  console.log('   ID:', product._id);
  console.log('   Name:', product.name);
  console.log('   Slug:', product.slug);
  console.log('   Base Price: ₹' + (product.basePrice / 100).toLocaleString('en-IN'));
  console.log('   Variants count:', product.variants.length);
  console.log('   Images count:', product.images.length);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Error adding product:', err);
  process.exit(1);
});
