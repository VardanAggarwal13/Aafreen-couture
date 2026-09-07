import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';
import { productRepository } from '@/server/repositories/product.repository';
import { categoryRepository } from '@/server/repositories/category.repository';
import { collectionRepository } from '@/server/repositories/collection.repository';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/+$/, '');

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/bridal`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/ready-to-wear`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/suits`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/occasions`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/bags`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/jewellery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/shipping-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/returns-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Specific high-value Occasion subcategories
  const occasionRoutes: MetadataRoute.Sitemap = [
    'engagement', 'haldi', 'mehendi', 'sangeet', 'jago', 'wedding', 'reception'
  ].map((occ) => ({
    url: `${baseUrl}/occasions/${occ}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Bridal subcategories
  const bridalRoutes: MetadataRoute.Sitemap = [
    'bridal-lehengas', 'reception-gowns', 'haldi'
  ].map((sub) => ({
    url: `${baseUrl}/bridal/${sub}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic products from repository
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const { items: products } = await productRepository.findMany({}, { limit: 1000 });
    productRoutes = products.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));
  } catch (err) {
    console.error('[Sitemap] Error fetching products:', err);
  }

  // Dynamic categories
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await categoryRepository.findAll();
    categoryRoutes = categories.map((c) => ({
      url: `${baseUrl}/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    }));
  } catch (err) {
    console.error('[Sitemap] Error fetching categories:', err);
  }

  // Dynamic collections
  let collectionRoutes: MetadataRoute.Sitemap = [];
  try {
    const collections = await collectionRepository.findAll();
    collectionRoutes = collections.map((col) => ({
      url: `${baseUrl}/collections/${col.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    }));
  } catch (err) {
    console.error('[Sitemap] Error fetching collections:', err);
  }

  return [
    ...staticRoutes,
    ...occasionRoutes,
    ...bridalRoutes,
    ...categoryRoutes,
    ...collectionRoutes,
    ...productRoutes,
  ];
}
