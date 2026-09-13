import { siteConfig } from '@/config/site.config';

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
      ...(item.href ? { item: `${siteConfig.url}${item.href}` } : {}),
    })),
  };
}
