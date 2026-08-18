import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import type { IProduct } from '@/models/Product';
import type { PaginationParams } from '@/types';
import type { SortOrder } from 'mongoose';
import { FALLBACK_PRODUCTS } from '@/data/products.data';

export interface ProductFilters {
  category?: string;
  collectionRef?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  search?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating';
}

function matchFallbackFilters(p: IProduct, filters: ProductFilters): boolean {
  if (filters.isActive !== undefined && p.isActive !== filters.isActive) return false;
  if (filters.isFeatured !== undefined && p.isFeatured !== filters.isFeatured) return false;
  if (filters.isNewArrival !== undefined && p.isNewArrival !== filters.isNewArrival) return false;
  if (filters.isBestSeller !== undefined && p.isBestSeller !== filters.isBestSeller) return false;

  if (filters.category) {
    const catSlug = typeof p.category === 'object' && p.category ? (p.category as { slug?: string }).slug : String(p.category);
    if (catSlug !== filters.category) return false;
  }

  if (filters.collectionRef) {
    const colSlug = typeof p.collectionRef === 'object' && p.collectionRef ? (p.collectionRef as { slug?: string }).slug : String(p.collectionRef);
    if (colSlug !== filters.collectionRef) return false;
  }

  if (filters.minPrice !== undefined && p.basePrice < filters.minPrice) return false;
  if (filters.maxPrice !== undefined && p.basePrice > filters.maxPrice) return false;

  if (filters.tags?.length) {
    const hasTag = filters.tags.some((t) => p.tags.includes(t));
    if (!hasTag) return false;
  }

  if (filters.search) {
    const s = filters.search.toLowerCase();
    const match =
      p.name.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s) ||
      p.tags.some((t) => t.toLowerCase().includes(s));
    if (!match) return false;
  }

  return true;
}

export class ProductRepository {
  async findById(id: string): Promise<IProduct | null> {
    try {
      await connectDB();
      const doc = await Product.findById(id).populate('category').lean<IProduct>();
      if (doc) return doc;
    } catch {
      // Fallback below
    }
    const found = FALLBACK_PRODUCTS.find((p) => p._id === id || String(p._id) === id);
    return (found as unknown as IProduct) ?? null;
  }

  async findBySlug(slug: string): Promise<IProduct | null> {
    try {
      await connectDB();
      const doc = await Product.findOne({ slug, isActive: true })
        .populate('category', 'name slug')
        .lean<IProduct>();
      if (doc) return doc;
    } catch {
      // Fallback below
    }
    const found = FALLBACK_PRODUCTS.find((p) => p.slug === slug);
    return (found as unknown as IProduct) ?? null;
  }

  async findMany(
    filters: ProductFilters,
    pagination: PaginationParams
  ): Promise<{ items: IProduct[]; total: number }> {
    try {
      await connectDB();

      const query: Record<string, unknown> = { isActive: true };

      if (filters.category) query.category = filters.category;
      if (filters.collectionRef) query.collectionRef = filters.collectionRef;
      if (filters.isFeatured !== undefined) query.isFeatured = filters.isFeatured;
      if (filters.isNewArrival !== undefined) query.isNewArrival = filters.isNewArrival;
      if (filters.isBestSeller !== undefined) query.isBestSeller = filters.isBestSeller;
      if (filters.tags?.length) query.tags = { $in: filters.tags };
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.basePrice = {};
        if (filters.minPrice !== undefined) (query.basePrice as Record<string, number>).$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) (query.basePrice as Record<string, number>).$lte = filters.maxPrice;
      }
      if (filters.search) {
        query.$text = { $search: filters.search };
      }

      const sortMap: Record<string, Record<string, SortOrder>> = {
        newest: { createdAt: -1 },
        'price-asc': { basePrice: 1 },
        'price-desc': { basePrice: -1 },
        popular: { soldCount: -1 },
        rating: { averageRating: -1 },
      };
      const sort = sortMap[filters.sort ?? 'newest'] ?? { createdAt: -1 as SortOrder };

      const { page = 1, limit = 24 } = pagination;
      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        Product.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .populate('category', 'name slug')
          .lean<IProduct[]>(),
        Product.countDocuments(query),
      ]);

      if (items.length > 0) {
        return { items, total };
      }
    } catch {
      // Fallback below
    }

    // Filter fallback products
    let list = (FALLBACK_PRODUCTS as unknown as IProduct[]).filter((p) =>
      matchFallbackFilters(p, filters)
    );

    // Sort fallback
    if (filters.sort === 'price-asc') {
      list.sort((a, b) => a.basePrice - b.basePrice);
    } else if (filters.sort === 'price-desc') {
      list.sort((a, b) => b.basePrice - a.basePrice);
    } else if (filters.sort === 'popular') {
      list.sort((a, b) => (b.soldCount ?? 0) - (a.soldCount ?? 0));
    } else if (filters.sort === 'rating') {
      list.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
    }

    const { page = 1, limit = 24 } = pagination;
    const skip = (page - 1) * limit;
    const items = list.slice(skip, skip + limit);

    return { items, total: list.length };
  }

  async findFeatured(limit = 8): Promise<IProduct[]> {
    try {
      await connectDB();
      const docs = await Product.find({ isActive: true, isFeatured: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('category', 'name slug')
        .lean<IProduct[]>();
      if (docs.length > 0) return docs;
    } catch {
      // Fallback below
    }
    return (FALLBACK_PRODUCTS as unknown as IProduct[])
      .filter((p) => p.isFeatured && p.isActive)
      .slice(0, limit);
  }

  async findNewArrivals(limit = 8): Promise<IProduct[]> {
    try {
      await connectDB();
      const docs = await Product.find({ isActive: true, isNewArrival: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('category', 'name slug')
        .lean<IProduct[]>();
      if (docs.length > 0) return docs;
    } catch {
      // Fallback below
    }
    return (FALLBACK_PRODUCTS as unknown as IProduct[])
      .filter((p) => p.isNewArrival && p.isActive)
      .slice(0, limit);
  }

  async findBestSellers(limit = 8): Promise<IProduct[]> {
    try {
      await connectDB();
      const docs = await Product.find({ isActive: true, isBestSeller: true })
        .sort({ soldCount: -1 })
        .limit(limit)
        .populate('category', 'name slug')
        .lean<IProduct[]>();
      if (docs.length > 0) return docs;
    } catch {
      // Fallback below
    }
    return (FALLBACK_PRODUCTS as unknown as IProduct[])
      .filter((p) => p.isBestSeller && p.isActive)
      .slice(0, limit);
  }

  async findRelated(productId: string, categoryId: string, limit = 4): Promise<IProduct[]> {
    try {
      await connectDB();
      const docs = await Product.find({
        _id: { $ne: productId },
        category: categoryId,
        isActive: true,
      })
        .sort({ soldCount: -1 })
        .limit(limit)
        .populate('category', 'name slug')
        .lean<IProduct[]>();
      if (docs.length > 0) return docs;
    } catch {
      // Fallback below
    }
    return (FALLBACK_PRODUCTS as unknown as IProduct[])
      .filter((p) => String(p._id) !== String(productId))
      .slice(0, limit);
  }
}

export const productRepository = new ProductRepository();
