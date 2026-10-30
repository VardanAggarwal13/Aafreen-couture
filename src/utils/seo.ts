import { siteConfig } from '@/config/site.config';
import type { IProduct } from '@/types';

export interface BreadcrumbJsonLdItem {
  label: string;
  href?: string;
}

/**
 * Builds a schema.org BreadcrumbList JSON-LD object from an ordered list of
 * crumbs. The final crumb (current page) should be passed without `href`.
 */
export function buildBreadcrumbJsonLd(items: BreadcrumbJsonLdItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href.startsWith('http') ? item.href : `${siteConfig.url}${item.href}` } : {}),
    })),
  };
}

/**
 * Builds full Google Merchant and Rich Results compliant Product Schema.org JSON-LD
 */
export function buildProductJsonLd(
  product: IProduct,
  reviews: { authorName: string; rating: number; title: string; body: string; createdAt: string }[] = []
) {
  const primaryImage = product.images?.[0] || '/images/og-image.jpg';
  const fullImages = (product.images && product.images.length > 0 ? product.images : [primaryImage]).map((img) =>
    img.startsWith('http') ? img : `${siteConfig.url}${img}`
  );

  const activeVariants = (product.variants ?? []).filter((v) => v.isActive !== false && v.price > 0);
  const prices = [product.basePrice, ...activeVariants.map((v) => v.price)].filter((p) => p > 0);
  const lowPaise = Math.min(...prices);
  const highPaise = Math.max(...prices);
  const priceValue = (lowPaise / 100).toFixed(2);
  const inStock =
    product.isActive !== false &&
    (!product.variants?.length || product.variants.some((v) => v.isActive !== false && v.stock > 0));
  // Only emit ratings backed by real reviews; invented ratings violate Google's structured data policy.
  const hasReviews = (product.reviewCount ?? 0) > 0 && (product.averageRating ?? 0) > 0;

  const categoryName =
    typeof product.category === 'object' && product.category && 'name' in product.category
      ? (product.category as { name: string }).name
      : 'Bridal & Luxury Couture';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: fullImages,
    description:
      product.shortDescription ||
      product.description?.slice(0, 250) ||
      `${product.name} handcrafted by master artisans at Aafreen Couture.`,
    sku: product.slug,
    category: categoryName,
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    offers: {
      ...(highPaise > lowPaise
        ? {
            '@type': 'AggregateOffer',
            lowPrice: priceValue,
            highPrice: (highPaise / 100).toFixed(2),
            offerCount: Math.max(activeVariants.length, 2),
          }
        : { '@type': 'Offer', price: priceValue }),
      url: `${siteConfig.url}/product/${product.slug}`,
      priceCurrency: 'INR',
      itemCondition: 'https://schema.org/NewCondition',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: { '@id': `${siteConfig.url}/#organization` },
      // shippingDetails intentionally omitted until the real delivery-charge list is published.
      // Mirrors /returns-policy: 7-day size exchange on eligible ready-to-wear pieces.
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        refundType: 'https://schema.org/ExchangeRefund',
        merchantReturnLink: `${siteConfig.url}/returns-policy`,
      },
    },
    // Individual reviews are real, admin-approved customer reviews only.
    ...(reviews.length > 0
      ? {
          review: reviews.slice(0, 5).map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.authorName },
            datePublished: r.createdAt.split('T')[0],
            name: r.title,
            reviewBody: r.body,
            reviewRating: { '@type': 'Rating', ratingValue: String(r.rating), bestRating: '5', worstRating: '1' },
          })),
        }
      : {}),
    ...(hasReviews
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: String(product.averageRating),
            reviewCount: String(product.reviewCount),
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
  };
}

/**
 * Serialises JSON-LD for use inside <script>. Escapes '<' so admin-entered text
 * (product names, blog titles) can never close the script tag.
 */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * CollectionPage + ItemList for a product listing. Tells search engines which
 * products a landing page contains; it is not a rich-result type by itself.
 */
export function buildItemListJsonLd(name: string, products: { slug: string; name: string }[], limit = 24) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: Math.min(products.length, limit),
      itemListElement: products.slice(0, limit).map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${siteConfig.url}/product/${p.slug}`,
        name: p.name,
      })),
    },
  };
}
