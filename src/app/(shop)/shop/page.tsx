import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ShopClientPage } from '@/features/shop/components/ShopClientPage';
import { siteConfig } from '@/config/site.config';
import { productService } from '@/server/services/product.service';
import { ProductCard } from '@/components/product/ProductCard';
import { buildItemListJsonLd, jsonLdString } from '@/utils/seo';
import type { IProduct } from '@/types';
import type { PaginatedResponse } from '@/types/api.types';

export const revalidate = 120;

export const metadata: Metadata = {
  title: 'Luxury Bridal Lehengas, Suits & Festive Wear',
  description:
    'Explore the complete luxury collection of handcrafted bridal lehengas, designer suits, shararas, and accessories from the Aafreen Couture atelier in Amritsar, shipped across India.',
  // Sorted, filtered and paginated views all canonicalise to the main listing.
  alternates: { canonical: `${siteConfig.url}/shop` },
  openGraph: {
    title: `Shop All Luxury Bridal Lehengas & Suits | ${siteConfig.name}`,
    description:
      'Explore handcrafted luxury bridal lehengas, designer suits, shararas, and accessories by Aafreen Couture.',
    url: `${siteConfig.url}/shop`,
    siteName: siteConfig.name,
    images: [{ url: `${siteConfig.url}/images/og-image.jpg`, width: 1200, height: 630, alt: 'Aafreen Couture Collection' }],
  },
};

/**
 * Static first paint for /shop. The interactive page reads the query string, so the framework
 * renders it on the client; this fallback is the HTML crawlers (and slow connections) receive.
 */
function ShopFallback({ products }: { products: IProduct[] }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(buildItemListJsonLd('Shop All Couture', products)) }}
        />
      )}
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-12">
        <h1 className="mb-8 text-center font-serif text-3xl tracking-tight text-[#221617] sm:text-4xl">
          Luxury Bridal Lehengas, Suits &amp; Festive Wear
        </h1>
        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={String(product._id)} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ShopPage() {
  let initialData: PaginatedResponse<IProduct> | undefined;
  try {
    const result = await productService.getProducts({ sort: 'newest' }, { page: 1, limit: 24 });
    initialData = JSON.parse(JSON.stringify(result)) as PaginatedResponse<IProduct>;
  } catch (err) {
    console.error('[ShopPage] initial fetch failed:', err);
  }

  return (
    <Suspense fallback={<ShopFallback products={initialData?.data ?? []} />}>
      <ShopClientPage initialData={initialData} />
    </Suspense>
  );
}
