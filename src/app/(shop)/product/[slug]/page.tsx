import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { productService } from '@/server/services/product.service';
import { ProductDetailClient } from '@/features/product/components/ProductDetailClient';
import { siteConfig } from '@/config/site.config';
import { buildProductJsonLd, buildBreadcrumbJsonLd } from '@/utils/seo';
import type { IProduct } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const raw = await productService.getProductBySlug(slug);
    const product = JSON.parse(JSON.stringify(raw)) as IProduct;

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
      const enhanced = `${cleanDesc} Handcrafted luxury couture with complimentary express shipping by ${siteConfig.name}.`;
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
    const raw = await productService.getProductBySlug(slug);
    const product = JSON.parse(JSON.stringify(raw)) as IProduct;

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
        ? [{ label: (product.category as { name: string }).name, href: `/shop?category=${(product.category as { slug: string }).slug}` }]
        : []),
      { label: product.name },
    ]);

    const productJsonLd = buildProductJsonLd(product);

    return (
      <>
        {/* Full Google Rich Results & Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <ProductDetailClient product={product} related={related} />
      </>
    );
  } catch {
    notFound();
  }
}
