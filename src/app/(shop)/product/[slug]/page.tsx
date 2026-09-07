import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { productService } from '@/server/services/product.service';
import { ProductDetailClient } from '@/features/product/components/ProductDetailClient';
import { siteConfig } from '@/config/site.config';
import type { IProduct } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 120;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const raw = await productService.getProductBySlug(slug);
    const product = JSON.parse(JSON.stringify(raw)) as IProduct;
    return {
      title: product.seoTitle ?? `${product.name} — ${siteConfig.name}`,
      description: product.seoDescription ?? product.shortDescription ?? product.description.slice(0, 160),
      openGraph: {
        title: product.name,
        description: product.shortDescription ?? product.description.slice(0, 160),
        images: product.images[0] ? [{ url: product.images[0] }] : [],
      },
    };
  } catch {
    return { title: `Product — ${siteConfig.name}` };
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

    const rawRelated = await productService.getRelatedProducts(product._id, categoryId);
    const related = JSON.parse(JSON.stringify(rawRelated)) as IProduct[];

    const productJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.shortDescription ?? product.description.slice(0, 300),
      image: product.images.map((img) => (img.startsWith('http') ? img : `${siteConfig.url}${img}`)),
      sku: product.slug,
      brand: {
        '@type': 'Brand',
        name: siteConfig.name,
      },
      offers: {
        '@type': 'Offer',
        url: `${siteConfig.url}/product/${product.slug}`,
        priceCurrency: 'INR',
        price: (product.basePrice / 100).toFixed(2),
        availability: product.isActive !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <ProductDetailClient product={product} related={related} />
      </>
    );
  } catch {
    notFound();
  }
}
