'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/product/ProductCard';
import { queryKeys } from '@/constants/query-keys';
import { api } from '@/utils/api';
import type { IProduct } from '@/types';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

const PRICE_RANGES = [
  { label: 'Under ₹30,000', min: 0, max: 3000000 },
  { label: '₹30,000 – ₹50,000', min: 3000000, max: 5000000 },
  { label: '₹50,000 – ₹75,000', min: 5000000, max: 7500000 },
  { label: '₹75,000+', min: 7500000, max: undefined },
];

const CATEGORY_FILTERS = [
  // Bridal
  { label: 'Bridal Lehengas', slug: 'bridal-lehengas' },
  { label: 'Bridal Suits', slug: 'bridal-suits' },
  { label: 'Bridesmaid Lehengas', slug: 'bridesmaid-lehengas' },
  { label: 'Reception Gowns', slug: 'reception-gowns' },
  { label: 'Reception Gowns', slug: 'gowns' },
  // Suits
  { label: 'Suits', slug: 'suits' },
  { label: 'Cotton Kurta Sets', slug: 'cotton-kurta-sets' },
  { label: 'Co-ord Sets', slug: 'co-ord-sets' },
  { label: 'Summer Essentials', slug: 'summer-essentials' },
  { label: 'Partywear Unstitched', slug: 'partywear-unstitched' },
  { label: 'Handcrafted Luxury', slug: 'custom-embroidered-suits' },
  { label: 'Indo-Western', slug: 'indo-western' },
  // Ready to Wear
  { label: 'Dresses', slug: 'dresses' },
  { label: 'Sharara Sets', slug: 'sharara' },
  { label: 'Occasion Lehengas', slug: 'occasion-lehengas' },
  // Bags
  { label: 'The Bag Edit', slug: 'the-bag-edit' },
  { label: 'Handbags', slug: 'handbags' },
  { label: 'Potlis', slug: 'potlis' },
  { label: 'Clutches', slug: 'clutches' },
  { label: 'Totes', slug: 'totes' },
  { label: 'Shoulder Bags', slug: 'shoulder-bags' },
  // Jewellery
  { label: 'Jewellery', slug: 'jewellery' },
  // Occasions
  { label: 'Engagement Collection', slug: 'engagement' },
  { label: 'Haldi Collection', slug: 'haldi' },
  { label: 'Mehendi Collection', slug: 'mehendi' },
  { label: 'Sangeet Collection', slug: 'sangeet' },
  { label: 'Jago Edit', slug: 'jago' },
  { label: 'Wedding Collection', slug: 'wedding' },
  { label: 'Reception Collection', slug: 'reception' },
];

const COLOR_SWATCHES = [
  { label: 'Maroon', hex: '#6B141C' },
  { label: 'Peach', hex: '#FFCBA4' },
  { label: 'Gold', hex: '#C49A5A' },
  { label: 'Emerald', hex: '#1B4D3E' },
  { label: 'Blush Pink', hex: '#FFB6C1' },
  { label: 'Royal Blue', hex: '#1A1A5E' },
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const FABRIC_OPTIONS = ['Silk', 'Organza', 'Velvet', 'Georgette', 'Chiffon', 'Crepe'];

export function ShopClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const sort = searchParams.get('sort') ?? 'newest';
  const category = searchParams.get('category') ?? '';
  const occasion = searchParams.get('occasion') ?? '';
  const selectedColor = searchParams.get('color') ?? '';
  const selectedSize = searchParams.get('size') ?? '';
  const selectedFabric = searchParams.get('fabric') ?? '';
  const minPrice = searchParams.get('minPrice') ?? '';
  const maxPrice = searchParams.get('maxPrice') ?? '';
  const page = Number(searchParams.get('page') ?? 1);

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.products.list({
      sort,
      category,
      occasion,
      color: selectedColor,
      size: selectedSize,
      fabric: selectedFabric,
      minPrice,
      maxPrice,
      page,
    }),
    queryFn: () => {
      const q = new URLSearchParams();
      if (sort) q.set('sort', sort);
      if (category) q.set('category', category);
      if (occasion) q.set('occasion', occasion);
      if (selectedColor) q.set('color', selectedColor);
      if (selectedSize) q.set('size', selectedSize);
      if (selectedFabric) q.set('fabric', selectedFabric);
      if (minPrice) q.set('minPrice', minPrice);
      if (maxPrice) q.set('maxPrice', maxPrice);
      if (page) q.set('page', String(page));
      return api.getPaginated<IProduct>(`/api/products?${q.toString()}`);
    },
    placeholderData: (prev) => prev,
  });

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && params.get(key) !== value) params.set(key, value);
      else params.delete(key);
      params.delete('page');
      router.push(`/shop?${params.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const products = data?.data ?? [];
  const pagination = data?.pagination;

  const activeCatObj = CATEGORY_FILTERS.find((c) => c.slug === category);
  const activeOccObj = CATEGORY_FILTERS.find((c) => c.slug === occasion);
  const isNewArrivals = sort === 'newest' && !category && !occasion;
  const pageTitle = isNewArrivals
    ? 'New Arrivals'
    : activeCatObj
    ? activeCatObj.label
    : category
    ? category.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : activeOccObj
    ? activeOccObj.label
    : occasion
    ? `${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Collection`
    : 'Bridal & Ethnic Couture';

  const isBridalCategory = category === 'bridal-lehengas' || category === 'bridal';

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Full-Width Bridal Hero (Edge-to-edge, NOT wrapped in any section card) */}
      {isBridalCategory && (
        <section className="w-full bg-gradient-to-r from-[#FBF8F3] via-[#FAF5EE] to-[#F5ECE1] border-b border-[#E8D4BE]">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Left Column: Royal Narrative & Atelier Pillars */}
              <div className="lg:col-span-6 text-left order-2 lg:order-1 flex flex-col justify-center">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-8 h-px bg-[#C49A5A]" />
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#A67C52] font-semibold">
                    Aafreen Atelier · Royal Heritage
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#221617] tracking-tight leading-[1.15] mb-3">
                  The Royal <span className="italic font-light text-[#A67C52]">Bridal</span> Edit
                </h1>

                {/* Ornamental Filigree Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="h-px w-10 bg-gradient-to-r from-[#C49A5A] to-transparent" />
                  <span className="text-[#C49A5A] text-xs">✦</span>
                  <div className="h-px w-10 bg-gradient-to-l from-[#C49A5A] to-transparent" />
                </div>

                <p className="text-sm sm:text-base text-[#5C554E] font-sans leading-relaxed mb-6 max-w-lg">
                  An ode to the timeless majesty of royal Indian weddings. Each masterpiece is individually hand-embroidered by master artisans in pure silks, velvets, and heirloom organza, adorned with authentic zardozi, dabka, cutdana, and micro-pearl craftsmanship.
                </p>

                {/* Atelier Craftsmanship Highlights */}
                <div className="space-y-2.5 pb-6 mb-6 border-b border-[#E8D4BE]/70">
                  <div className="flex items-center gap-3 text-xs text-[#3D332A] font-serif tracking-wide">
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0" />
                    <span>200+ hours of painstaking hand embroidery per ensemble</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#3D332A] font-serif tracking-wide">
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0" />
                    <span>Pure raw silks, heritage velvets & sheer organza dupattas</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#3D332A] font-serif tracking-wide">
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0" />
                    <span>Personalized made-to-measure couture consultation</span>
                  </div>
                </div>

                {/* Call-to-action row */}
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="https://wa.me/919517901117?text=Hello%20Aafreen%20Couture%2C%20I%20would%20like%20to%20inquire%20about%20the%20Royal%20Bridal%20Collection."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#221617] hover:bg-[#3D2628] text-[#F9F5EF] text-[11px] uppercase tracking-[0.2em] font-semibold rounded-xs transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <span>Book Bridal Consultation</span>
                    <span className="text-[#C49A5A]">→</span>
                  </a>
                  <span className="text-xs text-[#8C7A6B] font-sans">
                    {pagination?.total ?? products.length} Ensembles Curated
                  </span>
                </div>
              </div>

              {/* Right Column: Complete Un-cropped Photograph */}
              <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[460px] aspect-[2/3] max-h-[600px] rounded-xs overflow-hidden shadow-[0_20px_50px_rgba(34,22,23,0.14)] border border-[#E8D4BE] bg-[#1A0E0C]">
                  <Image
                    src="/images/banners/bridal-hero.webp"
                    alt="Aafreen Couture Royal Bridal Lehengas"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 460px"
                    className="object-contain sm:object-cover object-center"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#1A0E0C]/90 via-[#1A0E0C]/40 to-transparent py-2.5 text-center">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#E8D4BE] font-sans">
                      The Grand Palace Showcase · Jaipur Atelier
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Catalog Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header matching reference mockup */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8D8C8] mb-6">
          <div>
            {!isBridalCategory && (
              <h1 className="text-2xl lg:text-3xl font-serif uppercase tracking-wider text-[#221617]">
                {pageTitle}
              </h1>
            )}
            <p className="text-xs text-[#6E6A66] mt-1 font-sans">
              For the bride and family who love timeless elegance · {pagination?.total ?? products.length} items
            </p>
          </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-[#221617] border border-[#E8D8C8] px-3.5 py-1.5 hover:border-[#A67C52] transition-colors lg:hidden"
          >
            <SlidersHorizontal size={13} />
            Filters
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6E6A66] hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="text-xs border border-[#E8D8C8] px-2.5 py-1.5 bg-white text-[#221617] uppercase tracking-wider focus:outline-none focus:border-[#A67C52]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-5 lg:gap-6">
        {/* Sidebar filters — desktop always visible */}
        <aside className={`w-60 shrink-0 bg-white border border-[#E8D8C8] p-4 rounded-xs h-fit ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-24 space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8D8C8]">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#221617]">
                FILTERS
              </h2>
              {(category || occasion || selectedColor || selectedSize || selectedFabric || minPrice || maxPrice) && (
                <button
                  onClick={() => router.push('/shop')}
                  className="flex items-center gap-1 text-[10px] text-[#A67C52] font-semibold uppercase tracking-wider hover:underline"
                >
                  <X size={12} /> Clear All
                </button>
              )}
            </div>

            {/* Category filter */}
            <div>
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-2.5">
                Category
              </h3>
              <div className="space-y-1.5">
                {CATEGORY_FILTERS.map((cat) => {
                  const isOccasion = ['reception', 'engagement', 'wedding-guest', 'mehendi', 'haldi', 'sangeet', 'jago'].includes(cat.slug);
                  const isSelected = isOccasion ? occasion === cat.slug : category === cat.slug;
                  return (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        if (isOccasion) {
                          params.delete('category');
                          if (occasion === cat.slug) params.delete('occasion');
                          else params.set('occasion', cat.slug);
                        } else {
                          params.delete('occasion');
                          if (category === cat.slug) params.delete('category');
                          else params.set('category', cat.slug);
                        }
                        params.delete('page');
                        router.push(`/shop?${params.toString()}`, { scroll: false });
                      }}
                      className={`block w-full text-left text-xs transition-colors ${
                        isSelected ? 'text-[#A67C52] font-semibold' : 'text-[#6E6A66] hover:text-[#221617]'
                      }`}
                    >
                      • {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="pt-3 border-t border-[#E8D8C8]">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-2.5">
                Price
              </h3>
              <div className="space-y-1.5">
                {PRICE_RANGES.map(({ label, min, max }) => (
                  <button
                    key={label}
                    className="block w-full text-left text-xs text-[#6E6A66] hover:text-[#A67C52] transition-colors"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString());
                      params.set('minPrice', String(min));
                      if (max) params.set('maxPrice', String(max));
                      else params.delete('maxPrice');
                      router.push(`/shop?${params.toString()}`);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color filter swatches */}
            <div className="pt-3 border-t border-[#E8D8C8]">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-2.5">
                Color
              </h3>
              <div className="flex flex-wrap gap-2">
                {COLOR_SWATCHES.map((col) => (
                  <button
                    key={col.label}
                    onClick={() => setParam('color', col.label)}
                    title={col.label}
                    className={`w-6 h-6 rounded-full border border-gray-300 transition-transform ${
                      selectedColor === col.label ? 'ring-2 ring-[#A67C52] scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: col.hex }}
                  />
                ))}
              </div>
            </div>

            {/* Size filter */}
            <div className="pt-3 border-t border-[#E8D8C8]">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-2.5">
                Size
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {SIZE_OPTIONS.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setParam('size', sz)}
                    className={`px-2.5 py-1 text-[10px] font-semibold border uppercase transition-colors ${
                      selectedSize === sz
                        ? 'border-[#221617] bg-[#221617] text-white'
                        : 'border-[#E8D8C8] text-[#221617] hover:border-[#A67C52]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric filter */}
            <div className="pt-3 border-t border-[#E8D8C8]">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-2.5">
                Fabric
              </h3>
              <div className="space-y-1.5">
                {FABRIC_OPTIONS.map((fab) => (
                  <label key={fab} className="flex items-center gap-2 text-xs text-[#6E6A66] cursor-pointer hover:text-[#221617]">
                    <input
                      type="checkbox"
                      checked={selectedFabric === fab}
                      onChange={() => setParam('fabric', selectedFabric === fab ? '' : fab)}
                      className="accent-[#A67C52]"
                    />
                    {fab}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
              {Array.from({ length: 9 }, (_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="aspect-[4/5] bg-[#FAF7F2] border border-[#E8D8C8] rounded-xs animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 bg-[#FAF7F2] rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-[#FAF7F2] rounded animate-pulse w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white border border-[#E8D8C8] rounded-xs p-6 sm:p-8">
              <p className="text-[#6E6A66] text-base font-serif">No products found for this filter selection.</p>
              <button
                onClick={() => router.push('/shop')}
                className="mt-3 text-[#A67C52] hover:underline text-xs uppercase tracking-wider font-semibold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} priority={i < 4} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 mt-8 sm:mt-10">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setParam('page', String(p))}
                      className={`w-8 h-8 text-xs font-semibold border transition-colors ${
                        p === page
                          ? 'border-[#221617] bg-[#221617] text-white'
                          : 'border-[#E8D8C8] text-[#221617] hover:border-[#A67C52] bg-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
