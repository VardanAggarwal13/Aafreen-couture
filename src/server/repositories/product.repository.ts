import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import type { IProduct } from '@/models/Product';
import type { PaginationParams } from '@/types';
import type { SortOrder } from 'mongoose';

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

export class ProductRepository {
  async findById(id: string): Promise<IProduct | null> {
    await connectDB();
    return Product.findById(id).populate('category').lean<IProduct>();
  }

  async findBySlug(slug: string): Promise<IProduct | null> {
    await connectDB();
    return Product.findOne({ slug, isActive: true })
      .populate('category', 'name slug')
      .lean<IProduct>();
  }

  async findMany(
    filters: ProductFilters,
    pagination: PaginationParams
  ): Promise<{ items: IProduct[]; total: number }> {
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

    return { items, total };
  }

  async findFeatured(limit = 8): Promise<IProduct[]> {
    await connectDB();
    return Product.find({ isActive: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<IProduct[]>();
  }

  async findNewArrivals(limit = 8): Promise<IProduct[]> {
    await connectDB();
    return Product.find({ isActive: true, isNewArrival: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<IProduct[]>();
  }

  async findBestSellers(limit = 8): Promise<IProduct[]> {
    await connectDB();
    return Product.find({ isActive: true, isBestSeller: true })
      .sort({ soldCount: -1 })
      .limit(limit)
      .lean<IProduct[]>();
  }

  async findRelated(productId: string, categoryId: string, limit = 4): Promise<IProduct[]> {
    await connectDB();
    return Product.find({
      _id: { $ne: productId },
      category: categoryId,
      isActive: true,
    })
      .sort({ soldCount: -1 })
      .limit(limit)
      .lean<IProduct[]>();
  }
}

export const productRepository = new ProductRepository();
