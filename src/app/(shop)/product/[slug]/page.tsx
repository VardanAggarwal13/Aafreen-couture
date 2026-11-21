import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { productService } from '@/server/services/product.service';
import { NotFoundError } from '@/lib/api-errors';
import { categoryCrumbHref } from '@/config/catalog-seo.config';
import { productRepository } from '@/server/repositories/product.repository';
import { ProductDetailClient } from '@/features/product/components/ProductDetailClient';
import { siteConfig } from '@/config/site.config';
import { buildProductJsonLd, buildBreadcrumbJsonLd, jsonLdString } from '@/utils/seo';
import type { IProduct } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 120;

// Every active product page is built ahead of time, so opening one is served instantly from the CDN
// instead of being rendered on the first visitor's click. Pages refresh in the background every 120s,
// and a product added later is rendered on its first visit (dynamicParams stays on).
export async function generateStaticParams() {
  try {
    const slugs = await productRepository.findAllActiveSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

const getProduct = cache(async (slug: string) => {
  const raw = await productService.getProductBySlug(slug);
  return JSON.parse(JSON.stringify(raw)) as IProduct;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await getProduct(slug);

    // Strip redundant branding if already present in seoTitle so template doesn't duplicate
    const cleanTitle = (product.seoTitle || product.name)
      .replace(/\s*([|—–-]\s*Aafreen Couture)+/gi, '')
      .trim();

    // Calibrate meta description to optimal 130-155 character range
    const rawDesc = product.seoDescription || product.shortDescription || product.description;
    let cleanDesc = rawDesc.replace(/\s+/g, ' ').trim();
    if (cleanDesc.length > 155) {
      const truncated = cleanDesc.slice(0, 150);
      const lastSpace = truncated.lastIndexOf(' ');
      cleanDesc = (lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated) + '...';
    } else if (cleanDesc.length < 120) {
      const enhanced = `${cleanDesc} Handcrafted luxury couture with insured delivery by ${siteConfig.name}.`;
      cleanDesc = enhanced.length <= 155 ? enhanced : enhanced.slice(0, 152) + '...';
    }

    const firstImage = product.images?.[0]
      ? (product.images[0].startsWith('http') ? product.images[0] : `${siteConfig.url}${product.images[0]}`)
      : `${siteConfig.url}/images/og-image.jpg`;

    return {
      title: cleanTitle,
      description: cleanDesc,
      alternates: { canonical: `${siteConfig.url}/product/${slug}` },
      openGraph: {
        title: `${cleanTitle} | ${siteConfig.name}`,
        description: cleanDesc,
        url: `${siteConfig.url}/product/${slug}`,
        siteName: siteConfig.name,
        type: 'website',
        locale: 'en_IN',
        images: [
          {
            url: firstImage,
            width: 1200,
            height: 1500,
            alt: `${product.name} — ${siteConfig.name}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${cleanTitle} | ${siteConfig.name}`,
        description: cleanDesc,
        images: [firstImage],
      },
    };
  } catch (err) {
    // An unknown product is a real 404; any other failure (e.g. a database hiccup) keeps a generic title.
    if (err instanceof NotFoundError) notFound();
    return { title: 'Product' };
  }
}

export default async function ProductPage({ params }: Props) {
  try {
    const { slug } = await params;
    const product = await getProduct(slug);

    const categoryId = typeof product.category === 'string'
      ? product.category
      : (product.category as IProduct['category'] & { _id: string })._id;

    // Both lookups start together: the featured fallback costs nothing extra when it is not needed,
    // and waiting for the first one before starting the second used to add a full database round trip.
    const [relatedResult, featuredResult] = await Promise.allSettled([
      productService.getRelatedProducts(product._id, categoryId),
      productService.getFeaturedProducts(6),
    ]);
    let related: IProduct[] =
      relatedResult.status === 'fulfilled'
        ? (JSON.parse(JSON.stringify(relatedResult.value)) as IProduct[])
        : [];
    if (related.length === 0 && featuredResult.status === 'fulfilled') {
      related = JSON.parse(
        JSON.stringify(featuredResult.value.filter((p) => String(p._id) !== String(product._id)).slice(0, 4))
      ) as IProduct[];
    }

    const hasCategoryCrumb = typeof product.category === 'object' && !!product.category?.name;
    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/shop' },
      ...(hasCategoryCrumb
        ? [{ label: (product.category as { name: string }).name, href: categoryCrumbHref((product.category as { slug: string }).slug) }]
        : []),
      { label: product.name },
    ]);

    // Product pages show no ratings or reviews (many pieces are one-offs), so the stored placeholder
    // rating fields are cleared here and never reach the screen or the search-engine data.
    const displayProduct: IProduct = { ...product, averageRating: 0, reviewCount: 0 };

    const productJsonLd = buildProductJsonLd(displayProduct, []);

    return (
      <>
        {/* Full Google Rich Results & Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(productJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(breadcrumbJsonLd) }}
        />
        <ProductDetailClient product={displayProduct} related={related} />
      </>
    );
  } catch (err) {
    // Only a genuinely missing product is a 404; a DB hiccup must not get cached as one.
    if (err instanceof NotFoundError) notFound();
    throw err;
  }
}
