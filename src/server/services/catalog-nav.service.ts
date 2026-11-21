import { unstable_cache } from 'next/cache';
import { categoryRepository } from '@/server/repositories/category.repository';
import { collectionRepository } from '@/server/repositories/collection.repository';
import { CATEGORY_HUB_PATH } from '@/config/catalog-seo.config';
import type { NavLink } from '@/config/navigation.config';

/** Cache tag: admin category/collection changes call revalidateTag(CATALOG_NAV_TAG). */
export const CATALOG_NAV_TAG = 'catalog-nav';

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId: string | null;
  showInMenu: boolean;
  sortOrder: number;
  seoTitle: string;
  seoDescription: string;
}

export interface CatalogCollection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

interface CatalogSnapshot {
  categories: CatalogCategory[];
  collections: CatalogCollection[];
}

/**
 * One read of the active categories and collections, shared by the menu, the shop filters, the
 * collections page and the category page. It is cached (refreshed every 2 minutes and immediately
 * whenever an admin changes a category or collection), so reading it never makes a page dynamic.
 */
const loadSnapshot = unstable_cache(
  async (): Promise<CatalogSnapshot> => {
    const [categories, collections] = await Promise.all([
      categoryRepository.findAll(false),
      collectionRepository.findAll(false),
    ]);
    return {
      categories: categories.map((c) => ({
        id: String(c._id),
        name: c.name,
        slug: c.slug,
        description: c.description ?? '',
        image: c.image ?? '',
        parentId: c.parent ? String(c.parent) : null,
        showInMenu: Boolean(c.showInMenu),
        sortOrder: c.sortOrder ?? 0,
        seoTitle: c.seoTitle ?? '',
        seoDescription: c.seoDescription ?? '',
      })),
      collections: collections.map((c) => ({
        id: String(c._id),
        name: c.name,
        slug: c.slug,
        description: c.description ?? '',
        image: c.bannerImage || c.image || '',
      })),
    };
  },
  ['catalog-nav-snapshot-v1'],
  { tags: [CATALOG_NAV_TAG], revalidate: 120 }
);

/** Never throws: if the database is unreachable the site simply shows its built-in lists. */
export async function getCatalogSnapshot(): Promise<CatalogSnapshot> {
  try {
    return await loadSnapshot();
  } catch (error) {
    console.error('[CatalogNav] Could not load categories/collections:', error);
    return { categories: [], collections: [] };
  }
}

/**
 * Categories the admin has ticked "show in menu" for, that the built-in menu does not already have
 * (the built-in pages are matched by slug).
 */
function menuCategories(categories: CatalogCategory[]): CatalogCategory[] {
  return categories
    .filter((c) => c.showInMenu && !CATEGORY_HUB_PATH[c.slug])
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

/** Extra top-level menu entry for admin-created categories; empty when there are none. */
export async function getMenuExtras(): Promise<NavLink[]> {
  const { categories } = await getCatalogSnapshot();
  const extras = menuCategories(categories);
  if (extras.length === 0) return [];
  return [
    {
      label: 'More',
      href: '/shop',
      megaMenu: [
        {
          title: 'Categories',
          links: extras.map((c) => ({ label: c.name, href: `/category/${c.slug}` })),
        },
      ],
    },
  ];
}

/** Extra entries for the shop page's Category filter. */
export async function getShopExtraFilters(): Promise<{ label: string; slug: string }[]> {
  const { categories } = await getCatalogSnapshot();
  return menuCategories(categories).map((c) => ({ label: c.name, slug: c.slug }));
}
