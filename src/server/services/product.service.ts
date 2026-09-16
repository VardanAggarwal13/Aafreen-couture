import { productRepository, type ProductFilters } from '@/server/repositories/product.repository';
import { NotFoundError } from '@/lib/api-errors';
import type { IProduct } from '@/models/Product';
import type { PaginationParams, PaginatedResponse } from '@/types';

// Fields actually rendered by ProductCard grids (storefront listings, home
// sections, related products). Full documents are only needed on the single
// product detail page (findById/findBySlug), so listing endpoints project
// down to this set to cut payload size and JSON parse/serialize cost.
const CARD_FIELDS = '_id name slug images basePrice comparePrice isNewArrival fabric category';

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

    const { items, total } = await productRepository.findMany(filters, { page, limit }, { select: CARD_FIELDS });

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
    return productRepository.findFeatured(limit, CARD_FIELDS);
  }

  async getNewArrivals(limit = 8): Promise<IProduct[]> {
    return productRepository.findNewArrivals(limit, CARD_FIELDS);
  }

  async getBestSellers(limit = 8): Promise<IProduct[]> {
    return productRepository.findBestSellers(limit, CARD_FIELDS);
  }

  async getRelatedProducts(productId: string, categoryId: string): Promise<IProduct[]> {
    return productRepository.findRelated(productId, categoryId, 4, CARD_FIELDS);
  }

  async updateVariantStockBatch(
    updates: { productId: string; sku: string; stock: number }[]
  ): Promise<{ updated: number; failed: { productId: string; sku: string }[] }> {
    let updated = 0;
    const failed: { productId: string; sku: string }[] = [];

    for (const u of updates) {
      const ok = await productRepository.updateVariantStock(u.productId, u.sku, u.stock);
      if (ok) updated += 1;
      else failed.push({ productId: u.productId, sku: u.sku });
    }

    return { updated, failed };
  }
}

export const productService = new ProductService();
