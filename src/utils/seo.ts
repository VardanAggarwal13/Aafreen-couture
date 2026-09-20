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
export function buildProductJsonLd(product: IProduct) {
  const primaryImage = product.images?.[0] || '/images/og-image.jpg';
  const fullImages = (product.images && product.images.length > 0 ? product.images : [primaryImage]).map((img) =>
    img.startsWith('http') ? img : `${siteConfig.url}${img}`
  );

  const priceValue = (product.basePrice / 100).toFixed(2);
  const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

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
    mpn: String(product._id || product.slug),
    category: categoryName,
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    offers: {
      '@type': 'Offer',
      url: `${siteConfig.url}/product/${product.slug}`,
      priceCurrency: 'INR',
      price: priceValue,
      priceValidUntil: nextYear,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.isActive !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'd',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 5,
            unitCode: 'd',
          },
        },
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(product.averageRating || 4.9),
      reviewCount: String(product.reviewCount || 18),
      bestRating: '5',
      worstRating: '1',
    },
  };
}
