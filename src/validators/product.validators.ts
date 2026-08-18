import { z } from 'zod';

export const ProductQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(24),
  category: z.string().optional(),
  collection: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.enum(['newest', 'price-asc', 'price-desc', 'popular', 'rating']).optional(),
  q: z.string().max(100).optional(),
  featured: z.coerce.boolean().optional(),
  new: z.coerce.boolean().optional(),
  bestseller: z.coerce.boolean().optional(),
});

export const ProductVariantSchema = z.object({
  size: z.string().optional(),
  color: z.string().optional(),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  material: z.string().optional(),
  sku: z.string().min(1),
  price: z.number().int().min(0),
  comparePrice: z.number().int().min(0).optional(),
  stock: z.number().int().min(0),
  images: z.array(z.string().url()).default([]),
  isActive: z.boolean().default(true),
});

export const CreateProductSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  shortDescription: z.string().max(500).optional(),
  category: z.string().length(24),
  collectionRef: z.string().length(24).optional(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  variants: z.array(ProductVariantSchema).min(1, 'At least one variant is required'),
  basePrice: z.number().int().min(0),
  comparePrice: z.number().int().min(0).optional(),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  careInstructions: z.string().optional(),
  fabric: z.string().optional(),
  occasion: z.array(z.string()).default([]),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type ProductVariantInput = z.infer<typeof ProductVariantSchema>;
