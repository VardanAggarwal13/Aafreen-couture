import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { productService } from '@/server/services/product.service';
import { NotFoundError } from '@/lib/api-errors';
import { categoryCrumbHref } from '@/config/catalog-seo.config';
import { reviewService } from '@/server/services/review.service';
import { ProductReviews } from '@/features/product/components/ProductReviews';
import type { PublicReview } from '@/server/repositories/review.repository';
import { ProductDetailClient } from '@/features/product/components/ProductDetailClient';
import { siteConfig } from '@/config/site.config';
import { buildProductJsonLd, buildBreadcrumbJsonLd, jsonLdString } from '@/utils/seo';
import type { IProduct } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 120;

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
  } catch {
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

    let related: IProduct[] = [];
    try {
      const rawRelated = await productService.getRelatedProducts(product._id, categoryId);
      related = JSON.parse(JSON.stringify(rawRelated)) as IProduct[];
    } catch {
      related = [];
    }

    if (related.length === 0) {
      try {
        const fallbackRelated = await productService.getFeaturedProducts(6);
        related = JSON.parse(
          JSON.stringify(fallbackRelated.filter((p) => String(p._id) !== String(product._id)).slice(0, 4))
        ) as IProduct[];
      } catch {
        related = [];
      }
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

    let reviews: PublicReview[] = [];
    let stats = { count: 0, average: 0 };
    try {
      [reviews, stats] = await Promise.all([
        reviewService.getPublicReviews(product._id),
        reviewService.getRatingStats(product._id),
      ]);
    } catch {
      reviews = [];
    }

    // Ratings shown to shoppers and search engines come only from approved reviews, never from
    // the stored product fields (which seed data may have filled with placeholder numbers).
    const ratedProduct: IProduct = { ...product, averageRating: stats.average, reviewCount: stats.count };

    const productJsonLd = buildProductJsonLd(ratedProduct, reviews);

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
        <ProductDetailClient product={ratedProduct} related={related} />
        <ProductReviews
          productId={product._id}
          productSlug={product.slug}
          productName={product.name}
          reviews={reviews}
          reviewCount={stats.count}
          averageRating={stats.average}
        />
      </>
    );
  } catch (err) {
    // Only a genuinely missing product is a 404; a DB hiccup must not get cached as one.
    if (err instanceof NotFoundError) notFound();
    throw err;
  }
}
