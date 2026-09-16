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
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Enter a valid hex color, e.g. #C49A5A').optional(),
  material: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number({ message: 'Price must be a number' }).int('Price must be a whole number (no decimals)').min(0, 'Price cannot be negative'),
  comparePrice: z.number({ message: 'Compare price must be a number' }).int('Compare price must be a whole number (no decimals)').min(0, 'Compare price cannot be negative').optional(),
  stock: z.number({ message: 'Stock must be a number' }).int('Stock must be a whole number').min(0, 'Stock cannot be negative'),
  images: z.array(z.string().url('Each image must be a valid URL')).default([]),
  isActive: z.boolean().default(true),
});

export const CreateProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().max(500).optional(),
  category: z.string().min(1, 'Category is required'),
  collectionRef: z.string().min(1).optional(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  variants: z.array(ProductVariantSchema).min(1, 'Add at least one size/variant'),
  basePrice: z.number({ message: 'Price must be a number' }).int('Price must be a whole number (no decimals)').min(0, 'Price cannot be negative'),
  comparePrice: z.number({ message: 'Compare price must be a number' }).int('Compare price must be a whole number (no decimals)').min(0, 'Compare price cannot be negative').optional(),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  careInstructions: z.string().optional(),
  fabric: z.string().optional(),
  workType: z.string().optional(),
  occasion: z.array(z.string()).default([]),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductVariantInput = z.infer<typeof ProductVariantSchema>;
