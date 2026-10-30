import { CoutureCatalogView, type CoutureCatalogProps } from '@/components/shop/CoutureCatalogView';
import { productService } from '@/server/services/product.service';
import { CatalogSeoContent } from '@/components/shop/CatalogSeoContent';
import type { IProduct } from '@/types';
import type { PaginatedResponse } from '@/types/api.types';

/**
 * Fetches the first page of products on the server so listing pages ship real
 * product links and images in their initial HTML (crawlers and AI agents do not
 * run the client-side query). Filtered or paginated views still load through
 * the client query as before.
 */
export async function CoutureCatalogServer({ seoKey, ...props }: CoutureCatalogProps & { seoKey?: string }) {
  let initialData: PaginatedResponse<IProduct> | undefined;
  try {
    const result = await productService.getProducts(
      {
        category: props.categorySlug,
        occasion: props.occasionSlug,
        sort: (props.defaultSort ?? 'newest') as 'newest',
      },
      { page: 1, limit: 24 }
    );
    initialData = JSON.parse(JSON.stringify(result)) as PaginatedResponse<IProduct>;
  } catch (err) {
    console.error('[CoutureCatalogServer] initial fetch failed:', err);
  }
  return (
    <>
      <CoutureCatalogView {...props} initialData={initialData} />
      <CatalogSeoContent seoKey={seoKey} title={props.title} />
    </>
  );
}
