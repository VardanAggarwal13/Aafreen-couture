'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, ChevronRight, ChevronDown, X, RotateCcw } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { api } from '@/utils/api';
import type { PaginatedResponse } from '@/types/api.types';
import { ProductCard } from '@/components/product/ProductCard';
import type { IProduct } from '@/types';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CoutureCatalogProps {
  title: string;
  subtitle?: string;
  categorySlug?: string;
  occasionSlug?: string;
  defaultSort?: string;
  breadcrumbs: BreadcrumbItem[];
  isBridalHero?: boolean;
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Additions' },
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

const COLOR_SWATCHES = [
  { label: 'Maroon', hex: '#6B141C' },
  { label: 'Peach', hex: '#FFCBA4' },
  { label: 'Gold', hex: '#C49A5A' },
  { label: 'Emerald', hex: '#1B4D3E' },
  { label: 'Blush Pink', hex: '#FFB6C1' },
  { label: 'Royal Blue', hex: '#1A1A5E' },
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const FABRIC_OPTIONS = ['Silk', 'Organza', 'Velvet', 'Georgette', 'Chiffon', 'Crepe', 'Cotton', 'Chanderi'];

export function CoutureCatalogView({
  title,
  subtitle,
  categorySlug,
  occasionSlug,
  defaultSort = 'newest',
  breadcrumbs,
}: CoutureCatalogProps) {
  const searchParams = useSearchParams();

  const [activeDropdown, setActiveDropdown] = useState<'price' | 'color' | 'size' | 'fabric' | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sort, setSort] = useState(searchParams?.get('sort') || defaultSort);
  const [selectedColor, setSelectedColor] = useState(searchParams?.get('color') || '');
  const [selectedSize, setSelectedSize] = useState(searchParams?.get('size') || '');
  const [selectedFabric, setSelectedFabric] = useState(searchParams?.get('fabric') || '');
  const initialPriceParam = searchParams?.get('price');
  const [priceIdx, setPriceIdx] = useState<number | null>(
    initialPriceParam !== null && initialPriceParam !== undefined && initialPriceParam !== ''
      ? Number(initialPriceParam)
      : null
  );
  const [page, setPage] = useState(
    searchParams?.get('page') ? Number(searchParams.get('page')) : 1
  );

  // Sync state changes to browser URL query parameters without triggering full page reloads
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (sort && sort !== defaultSort) params.set('sort', sort);
    if (selectedColor) params.set('color', selectedColor);
    if (selectedSize) params.set('size', selectedSize);
    if (selectedFabric) params.set('fabric', selectedFabric);
    if (priceIdx !== null) params.set('price', String(priceIdx));
    if (page > 1) params.set('page', String(page));

    const qs = params.toString();
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [sort, selectedColor, selectedSize, selectedFabric, priceIdx, page, defaultSort]);

  const activeRange = priceIdx !== null ? PRICE_RANGES[priceIdx] : null;

  const { data, isLoading } = useQuery<PaginatedResponse<IProduct>>({
    queryKey: [
      'couture-catalog',
      categorySlug ?? '',
      occasionSlug ?? '',
      sort,
      selectedColor,
      selectedSize,
      selectedFabric,
      priceIdx,
      page,
    ],
    queryFn: () => {
      const q = new URLSearchParams();
      if (sort) q.set('sort', sort);
      if (categorySlug) q.set('category', categorySlug);
      if (occasionSlug) q.set('occasion', occasionSlug);
      if (selectedColor) q.set('color', selectedColor);
      if (selectedSize) q.set('size', selectedSize);
      if (selectedFabric) q.set('fabric', selectedFabric);
      if (activeRange?.min !== undefined) q.set('minPrice', String(activeRange.min));
      if (activeRange?.max !== undefined) q.set('maxPrice', String(activeRange.max));
      if (page > 1) q.set('page', String(page));
      return api.getPaginated<IProduct>(`/api/products?${q.toString()}`);
    },
    placeholderData: (prev) => prev,
    staleTime: 60 * 1000,
  });

  const products = data?.data ?? [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? products.length;
  const totalPages = pagination?.totalPages ?? Math.max(1, Math.ceil(total / 24));

  const hasActiveFilters = Boolean(
    selectedColor || selectedSize || selectedFabric || priceIdx !== null
  );

  const clearFilters = () => {
    setSelectedColor('');
    setSelectedSize('');
    setSelectedFabric('');
    setPriceIdx(null);
    setPage(1);
    setActiveDropdown(null);
  };

  const toggleDropdown = (name: 'price' | 'color' | 'size' | 'fabric') => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* 1. Refined Minimal Editorial Header */}
      <div className="w-full bg-[#FAF5EE] border-b border-[#E8D4BE]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 lg:py-10 text-center">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#8C7A6B] mb-2.5">
            <Link href="/" className="hover:text-[#A67C52] transition-colors">Home</Link>
            {breadcrumbs.map((b, idx) => (
              <span key={b.label} className="flex items-center gap-2">
                <ChevronRight size={10} className="text-[#C49A5A]" />
                {b.href && idx < breadcrumbs.length - 1 ? (
                  <Link href={b.href} className="hover:text-[#A67C52] transition-colors">{b.label}</Link>
                ) : (
                  <span className="text-[#221617] font-semibold">{b.label}</span>
                )}
              </span>
            ))}
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif text-[#221617] uppercase tracking-wider">
            {title}
          </h1>

          <div className="flex items-center justify-center gap-2.5 my-2">
            <div className="h-px w-8 bg-gradient-to-r from-[#C49A5A] to-transparent" />
            <span className="text-[#C49A5A] text-xs">✦</span>
            <div className="h-px w-8 bg-gradient-to-l from-[#C49A5A] to-transparent" />
          </div>

          <p className="text-xs sm:text-[13px] text-[#6E6A66] max-w-xl mx-auto font-sans leading-relaxed">
            {subtitle || `Handcrafted couture designed for timeless elegance · ${total} designs available`}
          </p>
        </div>
      </div>

      {/* 2. Top Horizontal Luxury Filter Bar (Lookbook Style) */}
      <div className="sticky top-[72px] sm:top-[76px] lg:top-[84px] z-30 bg-white/95 backdrop-blur-md border-b border-[#E8D8C8] shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Filter Buttons / Dropdowns */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8C7A6B] mr-1 hidden sm:inline">
              Filter By:
            </span>

            {/* Price Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('price')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] uppercase tracking-wider font-medium transition-all ${
                  priceIdx !== null
                    ? 'border-[#C49A5A] bg-[#FAF5EE] text-[#221617] font-semibold'
                    : 'border-[#E8D8C8] hover:border-[#C49A5A] bg-white text-[#5C554E]'
                }`}
              >
                <span>{priceIdx !== null ? PRICE_RANGES[priceIdx].label : 'Price'}</span>
                <ChevronDown size={11} className={`transition-transform text-[#A67C52] ${activeDropdown === 'price' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'price' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-[#E8D4BE] shadow-xl rounded-xs p-3 z-40">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A67C52] mb-2 pb-1 border-b border-[#F0E8DC]">
                    Select Price Range
                  </p>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => { setPriceIdx(null); setActiveDropdown(null); setPage(1); }}
                      className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors ${priceIdx === null ? 'font-bold text-[#C49A5A] bg-[#FAF5EE]' : 'text-[#221617] hover:bg-[#FAF8F5]'}`}
                    >
                      All Prices
                    </button>
                    {PRICE_RANGES.map((r, idx) => (
                      <button
                        key={r.label}
                        onClick={() => { setPriceIdx(idx); setActiveDropdown(null); setPage(1); }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs rounded transition-colors ${priceIdx === idx ? 'font-bold text-[#C49A5A] bg-[#FAF5EE]' : 'text-[#221617] hover:bg-[#FAF8F5]'}`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Color Swatch Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('color')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] uppercase tracking-wider font-medium transition-all ${
                  selectedColor
                    ? 'border-[#C49A5A] bg-[#FAF5EE] text-[#221617] font-semibold'
                    : 'border-[#E8D8C8] hover:border-[#C49A5A] bg-white text-[#5C554E]'
                }`}
              >
                <span>{selectedColor || 'Color'}</span>
                <ChevronDown size={11} className={`transition-transform text-[#A67C52] ${activeDropdown === 'color' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'color' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-[#E8D4BE] shadow-xl rounded-xs p-3 z-40">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A67C52] mb-2 pb-1 border-b border-[#F0E8DC]">
                    Color Palette
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => { setSelectedColor(''); setActiveDropdown(null); setPage(1); }}
                      className={`col-span-3 text-left px-2 py-1 text-xs text-[#5C554E] hover:text-[#221617] ${!selectedColor ? 'font-bold text-[#C49A5A]' : ''}`}
                    >
                      All Colors
                    </button>
                    {COLOR_SWATCHES.map((c) => (
                      <button
                        key={c.label}
                        onClick={() => { setSelectedColor(selectedColor === c.label ? '' : c.label); setActiveDropdown(null); setPage(1); }}
                        className={`flex items-center gap-2 p-1.5 rounded text-[11px] border transition-all ${selectedColor === c.label ? 'border-[#C49A5A] bg-[#FAF5EE]' : 'border-transparent hover:border-[#E8D8C8]'}`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: c.hex }} />
                        <span className="truncate">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Size Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('size')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] uppercase tracking-wider font-medium transition-all ${
                  selectedSize
                    ? 'border-[#C49A5A] bg-[#FAF5EE] text-[#221617] font-semibold'
                    : 'border-[#E8D8C8] hover:border-[#C49A5A] bg-white text-[#5C554E]'
                }`}
              >
                <span>{selectedSize ? `Size: ${selectedSize}` : 'Size'}</span>
                <ChevronDown size={11} className={`transition-transform text-[#A67C52] ${activeDropdown === 'size' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'size' && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-[#E8D4BE] shadow-xl rounded-xs p-3 z-40">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A67C52] mb-2 pb-1 border-b border-[#F0E8DC]">
                    Select Size
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {SIZE_OPTIONS.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => { setSelectedSize(selectedSize === sz ? '' : sz); setActiveDropdown(null); setPage(1); }}
                        className={`py-1.5 text-xs text-center border font-sans uppercase transition-all ${
                          selectedSize === sz
                            ? 'bg-[#221617] text-[#FAF5EE] border-[#221617] font-bold'
                            : 'border-[#E8D8C8] text-[#221617] hover:border-[#C49A5A]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fabric Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('fabric')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-[11px] uppercase tracking-wider font-medium transition-all ${
                  selectedFabric
                    ? 'border-[#C49A5A] bg-[#FAF5EE] text-[#221617] font-semibold'
                    : 'border-[#E8D8C8] hover:border-[#C49A5A] bg-white text-[#5C554E]'
                }`}
              >
                <span>{selectedFabric || 'Fabric'}</span>
                <ChevronDown size={11} className={`transition-transform text-[#A67C52] ${activeDropdown === 'fabric' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'fabric' && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-[#E8D4BE] shadow-xl rounded-xs p-3 z-40">
                  <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A67C52] mb-2 pb-1 border-b border-[#F0E8DC]">
                    Fabric Selection
                  </p>
                  <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
                    <button
                      onClick={() => { setSelectedFabric(''); setActiveDropdown(null); setPage(1); }}
                      className={`w-full text-left px-2 py-1 text-xs ${!selectedFabric ? 'font-bold text-[#C49A5A]' : 'text-[#5C554E]'}`}
                    >
                      All Fabrics
                    </button>
                    {FABRIC_OPTIONS.map((fab) => (
                      <button
                        key={fab}
                        onClick={() => { setSelectedFabric(selectedFabric === fab ? '' : fab); setActiveDropdown(null); setPage(1); }}
                        className={`w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                          selectedFabric === fab
                            ? 'font-bold text-[#C49A5A] bg-[#FAF5EE]'
                            : 'text-[#221617] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {fab}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Clear Filters Chip */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10.5px] uppercase tracking-wider font-semibold text-[#8C1D2A] hover:bg-[#8C1D2A]/10 transition-colors"
              >
                <RotateCcw size={11} />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Right: Ensembles Count & Sorting Dropdown */}
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-xs text-[#8C7A6B] font-sans hidden md:inline">
              Showing <strong className="text-[#221617]">{total}</strong> Ensembles
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#8C7A6B] font-medium hidden sm:inline">
                Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="text-xs border border-[#E8D8C8] px-3 py-1.5 bg-white text-[#221617] uppercase tracking-wider rounded-xs focus:outline-none focus:border-[#A67C52] cursor-pointer"
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

        {/* Active Filter Badges Bar */}
        {hasActiveFilters && (
          <div className="bg-[#FAF5EE] border-t border-[#E8D8C8]/60 py-2 px-4 sm:px-6 lg:px-12 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7A6B] font-semibold">Active:</span>
            {selectedColor && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-[#E8D4BE] px-2.5 py-0.5 rounded-full text-[10.5px] text-[#221617]">
                Color: {selectedColor}
                <X size={10} className="cursor-pointer hover:text-red-500" onClick={() => setSelectedColor('')} />
              </span>
            )}
            {selectedSize && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-[#E8D4BE] px-2.5 py-0.5 rounded-full text-[10.5px] text-[#221617]">
                Size: {selectedSize}
                <X size={10} className="cursor-pointer hover:text-red-500" onClick={() => setSelectedSize('')} />
              </span>
            )}
            {selectedFabric && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-[#E8D4BE] px-2.5 py-0.5 rounded-full text-[10.5px] text-[#221617]">
                Fabric: {selectedFabric}
                <X size={10} className="cursor-pointer hover:text-red-500" onClick={() => setSelectedFabric('')} />
              </span>
            )}
            {priceIdx !== null && (
              <span className="inline-flex items-center gap-1.5 bg-white border border-[#E8D4BE] px-2.5 py-0.5 rounded-full text-[10.5px] text-[#221617]">
                {PRICE_RANGES[priceIdx].label}
                <X size={10} className="cursor-pointer hover:text-red-500" onClick={() => setPriceIdx(null)} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* 3. Full-Width High-Fashion Product Grid */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="aspect-[3/4] bg-white border border-[#E8D8C8] rounded-xs animate-pulse" />
                <div className="h-3.5 bg-[#E8D8C8]/70 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-[#E8D8C8]/40 rounded animate-pulse w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-white border border-[#E8D8C8] rounded-xs p-8 max-w-lg mx-auto shadow-2xs">
            <h2 className="text-xl font-serif text-[#221617] mb-2">No Ensembles Match The Selected Criteria</h2>
            <p className="text-xs sm:text-sm text-[#6E6A66] font-sans mb-5">
              Try adjusting or clearing your filters to explore our full handcrafted collection.
            </p>
            <button
              onClick={clearFilters}
              className={buttonVariants({ variant: 'couture', size: 'couture' })}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} priority={i < 4} />
              ))}
            </div>

            {/* 4. Luxury Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 sm:mt-10 pt-4 sm:pt-5 border-t border-[#E8D8C8] flex items-center justify-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={buttonVariants({
                    variant: 'couture-outline',
                    size: 'couture-sm',
                    className: 'disabled:opacity-30 disabled:pointer-events-none cursor-pointer',
                  })}
                >
                  ← Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => {
                      setPage(pNum);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={
                      page === pNum
                        ? buttonVariants({ variant: 'couture', size: 'icon-sm', className: 'cursor-default font-bold' })
                        : buttonVariants({ variant: 'couture-outline', size: 'icon-sm', className: 'cursor-pointer hover:border-[#C49A5A]' })
                    }
                  >
                    {pNum}
                  </button>
                ))}

                <button
                  disabled={page >= totalPages}
                  onClick={() => {
                    setPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={buttonVariants({
                    variant: 'couture-outline',
                    size: 'couture-sm',
                    className: 'disabled:opacity-30 disabled:pointer-events-none cursor-pointer',
                  })}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
