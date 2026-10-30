import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';
import { SUBCATEGORY_SLUGS } from '@/config/catalog-seo.config';
import { productRepository } from '@/server/repositories/product.repository';
import { collectionRepository } from '@/server/repositories/collection.repository';
import { blogRepository } from '@/server/repositories/blog.repository';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url.replace(/\/+$/, '');

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/bridal`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/ready-to-wear`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/suits`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/occasions`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/bags`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/jewellery`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/collections`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/faq`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/shipping-policy`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/returns-policy`, changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Subcategory landing pages come from the same config the pages validate against
  const occasionRoutes: MetadataRoute.Sitemap = SUBCATEGORY_SLUGS.occasions.map((occ) => ({
    url: `${baseUrl}/occasions/${occ}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Bridal subcategories
  const bridalRoutes: MetadataRoute.Sitemap = SUBCATEGORY_SLUGS.bridal.map((sub) => ({
    url: `${baseUrl}/bridal/${sub}`,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Suits subcategories
  const suitsRoutes: MetadataRoute.Sitemap = SUBCATEGORY_SLUGS.suits.map((sub) => ({
    url: `${baseUrl}/suits/${sub}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Ready To Wear subcategories
  const rtwRoutes: MetadataRoute.Sitemap = SUBCATEGORY_SLUGS['ready-to-wear'].map((sub) => ({
    url: `${baseUrl}/ready-to-wear/${sub}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Bags subcategories
  const bagsRoutes: MetadataRoute.Sitemap = SUBCATEGORY_SLUGS.bags.map((sub) => ({
    url: `${baseUrl}/bags/${sub}`,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  // Dynamic products from repository
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const { items: products } = await productRepository.findMany({}, { limit: 5000 });
    productRoutes = products.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));
  } catch (err) {
    console.error('[Sitemap] Error fetching products:', err);
  }

  // Dynamic collections
  let collectionRoutes: MetadataRoute.Sitemap = [];
  try {
    const collections = await collectionRepository.findAll();
    collectionRoutes = collections.map((col) => ({
      url: `${baseUrl}/collections/${col.slug}`,
      changeFrequency: 'weekly',
      priority: 0.75,
    }));
  } catch (err) {
    console.error('[Sitemap] Error fetching collections:', err);
  }

  // Dynamic blog posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await blogRepository.findAllPublished();
    blogRoutes = posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch (err) {
    console.error('[Sitemap] Error fetching blog posts:', err);
  }

  // /shop?category=… URLs are intentionally omitted: /shop canonicalises to itself,
  // so listing parameterised duplicates in the sitemap sends conflicting signals.
  return [
    ...staticRoutes,
    ...bridalRoutes,
    ...suitsRoutes,
    ...rtwRoutes,
    ...occasionRoutes,
    ...bagsRoutes,
    ...collectionRoutes,
    ...productRoutes,
    ...blogRoutes,
  ];
}
