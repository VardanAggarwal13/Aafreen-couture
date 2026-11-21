import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getCatalogSnapshot } from '@/server/services/catalog-nav.service';
import { productService } from '@/server/services/product.service';
import { ProductCard } from '@/components/product/ProductCard';
import { siteConfig } from '@/config/site.config';
import { CATEGORY_HUB_PATH } from '@/config/catalog-seo.config';
import { buildBreadcrumbJsonLd, buildItemListJsonLd, jsonLdString } from '@/utils/seo';
import type { IProduct } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

/** Pieces shown on the page; larger categories link on to the full, filterable shop listing. */
const PAGE_SIZE = 48;

export const revalidate = 120;

// Every active category gets a page that is built ahead of time; categories added later are built on
// their first visit (dynamicParams stays on) and the list refreshes when an admin changes a category.
export async function generateStaticParams() {
  const { categories } = await getCatalogSnapshot();
  return categories.map((c) => ({ slug: c.slug }));
}

async function loadCategory(slug: string) {
  const { categories } = await getCatalogSnapshot();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return null;
  const parent = category.parentId ? categories.find((c) => c.id === category.parentId) ?? null : null;
  const children = categories.filter((c) => c.parentId === category.id);
  return { category, parent, children };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const found = await loadCategory(slug);
  if (!found) notFound(); // a real 404 status, not a 200 page that says "not found"
  const { category } = found;

  const title = category.seoTitle || category.name;
  const description =
    category.seoDescription ||
    category.description ||
    `Shop ${category.name} from ${siteConfig.name}: handcrafted couture, made to measure in Amritsar and shipped across India.`;
  // Categories that already have a dedicated landing page point search engines at that page instead.
  const hub = CATEGORY_HUB_PATH[slug]?.href;
  const url = `${siteConfig.url}${hub ?? `/category/${slug}`}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      type: 'website',
      locale: 'en_IN',
      ...(category.image ? { images: [{ url: category.image, width: 1200, height: 630, alt: category.name }] } : {}),
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const found = await loadCategory(slug);
  if (!found) notFound();
  const { category, parent, children } = found;

  let products: IProduct[] = [];
  let total = 0;
  try {
    const result = await productService.getProducts({ category: slug }, { page: 1, limit: PAGE_SIZE });
    products = JSON.parse(JSON.stringify(result.data ?? [])) as IProduct[];
    total = result.pagination?.total ?? products.length;
  } catch (err) {
    console.error('[CategoryPage] product load failed for', slug, err);
  }

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    ...(parent ? [{ label: parent.name, href: `/category/${parent.slug}` }] : []),
    { label: category.name },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-dvh">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(buildBreadcrumbJsonLd(crumbs)) }} />
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString(buildItemListJsonLd(category.name, products)) }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#6E5C4D]">
          {crumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-2">
              {i > 0 && <ChevronRight size="0.75rem" className="text-[#C49A5A]" />}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-[#8A6240] transition-colors">{crumb.label}</Link>
              ) : (
                <span className="text-[#221617] font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>

      {/* Header */}
      <section className="border-b border-[#E8D4BE] bg-[#FAF5EE]">
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-1 gap-6 items-center ${
            category.image ? 'lg:grid-cols-[1fr_22rem]' : ''
          }`}
        >
          <div>
            <p className="mb-2 text-[0.625rem] sm:text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-[#8A6240]">
              Aafreen Atelier · Category
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-[#221617] leading-[1.12]">{category.name}</h1>
            <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-[#5C554E]">
              {category.description ||
                `Explore our ${category.name} collection: handcrafted couture, individually tailored with heritage embroidery and fine fabrics.`}
            </p>
            {children.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {children.map((child) => (
                  <Link
                    key={child.id}
                    href={`/category/${child.slug}`}
                    className="rounded-full border border-[#DDD2C5] bg-white px-3.5 py-1.5 text-xs font-medium text-[#2E221C] transition-colors hover:border-[#C49A5A]"
                  >
                    {child.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {category.image && (
            <div className="relative mx-auto h-48 w-full max-w-sm overflow-hidden rounded-2xl bg-[#EFE8DD] sm:h-56 lg:h-60">
              <Image
                src={category.image}
                alt={category.name}
                fill
                priority
                sizes="(max-width: 64em) 90vw, 22rem"
                className="object-cover object-center"
              />
            </div>
          )}
        </div>
      </section>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {products.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-brand-stone text-base">New designs are on their way to this category.</p>
            <Link href="/shop" className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-[#8A6240] underline-offset-4 hover:underline">
              Browse all designs
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs font-sans text-brand-stone mb-4 sm:mb-5">
              {total} piece{total !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6">
              {products.map((product, i) => (
                <ProductCard key={String(product._id)} product={product} priority={i < 2} />
              ))}
            </div>
            {total > products.length && (
              <div className="mt-8 text-center">
                <Link
                  href={`/shop?category=${slug}`}
                  className="inline-block rounded-lg border border-[#DDD2C5] bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#2E221C] transition-colors hover:border-[#C49A5A]"
                >
                  View all {total} in the shop
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
