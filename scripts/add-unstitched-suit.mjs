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
const Product = mongoose.models.Product ?? mongoose.model('Product', ProductSchema);

const blackImages = [
  '/images/products/zeenat-black-handcrafted-luxury-suit-2141.webp',
  '/images/products/zeenat-black-handcrafted-luxury-suit-2147.webp',
  '/images/products/zeenat-black-handcrafted-luxury-suit-2143.webp',
  '/images/products/zeenat-black-handcrafted-luxury-suit-2150.webp',
  '/images/products/zeenat-black-handcrafted-luxury-suit-2149.webp',
  '/images/products/zeenat-black-handcrafted-luxury-suit-2140.webp',
];

const maroonImages = [
  '/images/products/zeenat-maroon-handcrafted-luxury-suit-2075.webp',
  '/images/products/zeenat-maroon-handcrafted-luxury-suit-2076.webp',
  '/images/products/zeenat-maroon-handcrafted-luxury-suit-2077.webp',
  '/images/products/zeenat-maroon-handcrafted-luxury-suit-2078.webp',
  '/images/products/zeenat-maroon-handcrafted-luxury-suit-2079.webp',
  '/images/products/zeenat-maroon-handcrafted-luxury-suit-2082.webp',
];

const allImages = [...blackImages, ...maroonImages];

const sizeDefinitions = [
  { size: 'Unstitched (Fabric Set)', suffix: 'UNST', price: 4250000, comparePrice: 4950000, stock: 12 },
  { size: 'S (Custom Tailored)', suffix: 'S', price: 4250000, comparePrice: 4950000, stock: 5 },
  { size: 'M (Custom Tailored)', suffix: 'M', price: 4250000, comparePrice: 4950000, stock: 8 },
  { size: 'L (Custom Tailored)', suffix: 'L', price: 4250000, comparePrice: 4950000, stock: 6 },
  { size: 'XL (Custom Tailored)', suffix: 'XL', price: 4250000, comparePrice: 4950000, stock: 4 },
  { size: 'Made to Measure (Bespoke)', suffix: 'BESPOKE', price: 4550000, comparePrice: 5250000, stock: 10 },
];

const variants = [
  // Black Variants
  ...sizeDefinitions.map((s) => ({
    size: s.size,
    color: 'Black (Midnight Onyx)',
    colorHex: '#141312',
    material: 'Pure Raw Silk & Organza',
    sku: `ZNT-BLK-${s.suffix}`,
    price: s.price,
    comparePrice: s.comparePrice,
    stock: s.stock,
    images: blackImages,
    isActive: true,
  })),
  // Maroon Variants
  ...sizeDefinitions.map((s) => ({
    size: s.size,
    color: 'Crimson Maroon (Ruby Wine)',
    colorHex: '#6B1322',
    material: 'Pure Raw Silk & Organza',
    sku: `ZNT-MRN-${s.suffix}`,
    price: s.price,
    comparePrice: s.comparePrice,
    stock: s.stock,
    images: maroonImages,
    isActive: true,
  })),
];

async function run() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB Atlas successfully.');

  let cat = await Category.findOne({
    $or: [{ slug: 'custom-embroidered-suits' }, { slug: 'handcrafted-luxury' }]
  });

  if (!cat) {
    console.log('Creating category "Handcrafted Luxury" (custom-embroidered-suits)...');
    cat = await Category.create({
      name: 'Handcrafted Luxury',
      slug: 'custom-embroidered-suits',
      description: 'Artisanal unstitched & bespoke suits with intricate zardozi, gotta patti, and resham hand embroidery.',
      image: blackImages[0],
      sortOrder: 10,
      isActive: true,
      seoTitle: 'Handcrafted Luxury Suits | Aafreen Couture',
      seoDescription: 'Discover handcrafted luxury unstitched and bespoke suits featuring antique zardozi and raw silk by Aafreen Couture.',
    });
  }

  const productData = {
    name: 'Zeenat Handcrafted Unstitched Silk Suit',
    slug: 'zeenat-handcrafted-unstitched-silk-suit',
    description: 'An epitome of understated royal luxury, the Zeenat Handcrafted Unstitched Suit is fashioned from lustrous pure raw silk. The shirt fabric showcases an opulent handcrafted neckline framed with antique gold zardozi, amber kundan stones, cutdana, and micro-beaded floral medallions with emerald accents. Accompanied by coordinating pure raw silk bottom fabric and an ethereal pure organza dupatta adorned with delicate handcrafted butis and scalloped embroidered border trims. Available in regal Midnight Onyx Black and deep Crimson Ruby Wine, perfect for grand receptions, black-tie weddings, and festive soirees.',
    shortDescription: 'Pure raw silk unstitched luxury suit with handcrafted antique gold zardozi, amber kundan, cutdana embroidery, and sheer organza dupatta.',
    basePrice: 4250000, // ₹42,500
    comparePrice: 4950000, // ₹49,500
    category: cat._id,
    images: allImages,
    variants: variants,
    fabric: 'Pure Raw Silk & Shimmer Tissue Silk with Pure Organza Dupatta',
    workType: 'Handcrafted Antique Gold Zardozi, Amber Kundan, Cutdana, Dabka & Emerald Stone Work',
    occasion: ['Wedding', 'Reception', 'Sangeet', 'Festive Luxury', 'Evening Soiree'],
    careInstructions: 'Dry clean only. Store wrapped in soft muslin cloth to preserve artisanal embroidery.',
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    tags: [
      'suits',
      'handcrafted-luxury',
      'custom-embroidered-suits',
      'unstitched',
      'unstitched-suit',
      'partywear-unstitched',
      'black',
      'maroon',
      'ruby-wine',
      'silk',
      'zardozi',
      'kundan',
      'luxury-suit',
      'kurta',
      'embroidered',
      'festive'
    ],
    soldCount: 36,
    averageRating: 5.0,
    reviewCount: 22,
    seoTitle: 'Zeenat Handcrafted Unstitched Silk Suit | Aafreen Couture',
    seoDescription: 'Pure raw silk unstitched luxury suit featuring handcrafted antique gold zardozi, amber kundan, cutdana embroidery, and sheer organza dupatta by Aafreen Couture.',
  };

  const product = await Product.findOneAndUpdate(
    { slug: productData.slug },
    { $set: productData },
    { upsert: true, returnDocument: 'after' }
  );

  console.log('✅ Product updated with 2 color variants in MongoDB Atlas:');
  console.log('   ID:', product._id);
  console.log('   Name:', product.name);
  console.log('   Slug:', product.slug);
  console.log('   Colors: Black (Midnight Onyx), Crimson Maroon (Ruby Wine)');
  console.log('   Variants count:', product.variants.length);
  console.log('   Total 3:4 cropped images:', product.images.length);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
