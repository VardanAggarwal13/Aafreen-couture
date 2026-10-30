import { CategoryHubView, type CategoryHubProps } from '@/components/shop/CategoryHubView';
import { productService } from '@/server/services/product.service';
import { CatalogSeoContent } from '@/components/shop/CatalogSeoContent';
import type { IProduct } from '@/types';
import type { PaginatedResponse } from '@/types/api.types';

/**
 * Pre-loads each chapter's first four products on the server so hub pages ship
 * product links in their initial HTML instead of an empty client-loaded shelf.
 */
export async function CategoryHubServer({ hubKey, ...props }: CategoryHubProps & { hubKey?: string }) {
  const chapters = await Promise.all(
    props.chapters.map(async (chapter) => {
      if (chapter.tag) return chapter; // tag shelves use free-text search; leave to the client
      try {
        const result = await productService.getProducts(
          { category: chapter.categorySlug, occasion: chapter.occasionSlug },
          { page: 1, limit: 4 }
        );
        return {
          ...chapter,
          initialData: JSON.parse(JSON.stringify(result)) as PaginatedResponse<IProduct>,
        };
      } catch (err) {
        console.error('[CategoryHubServer] chapter fetch failed:', chapter.id, err);
        return chapter;
      }
    })
  );
  return (
    <>
      <CategoryHubView {...props} chapters={chapters} />
      <CatalogSeoContent hubKey={hubKey} title={props.title} />
    </>
  );
}
