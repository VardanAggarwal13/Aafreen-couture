import { productRepository, type ProductFilters } from '@/server/repositories/product.repository';
import { NotFoundError } from '@/lib/api-errors';
import type { IProduct } from '@/models/Product';
import type { PaginationParams, PaginatedResponse } from '@/types';

export class ProductService {
  async getProductBySlug(slug: string): Promise<IProduct> {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw new NotFoundError('Product');
    return product;
  }

  async getProducts(
    filters: ProductFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResponse<IProduct>> {
    const limit = pagination.limit ?? 24;
    const page = pagination.page ?? 1;

    const { items, total } = await productRepository.findMany(filters, { page, limit });

    return {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async getFeaturedProducts(limit = 8): Promise<IProduct[]> {
    return productRepository.findFeatured(limit);
  }

  async getNewArrivals(limit = 8): Promise<IProduct[]> {
    return productRepository.findNewArrivals(limit);
  }

  async getBestSellers(limit = 8): Promise<IProduct[]> {
    return productRepository.findBestSellers(limit);
  }

  async getRelatedProducts(productId: string, categoryId: string): Promise<IProduct[]> {
    return productRepository.findRelated(productId, categoryId);
  }
}

export const productService = new ProductService();
