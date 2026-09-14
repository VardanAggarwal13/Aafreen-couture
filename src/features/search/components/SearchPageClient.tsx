'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import type { IProduct } from '@/types';
import type { PaginatedResponse } from '@/types/api.types';
import { ProductCard } from '@/components/product/ProductCard';
import { Pagination } from '@/components/common/Pagination';

const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initial = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initial);
  const [debouncedQuery, setDebouncedQuery] = useState(initial);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const { data, isFetching } = useQuery<PaginatedResponse<IProduct>>({
    queryKey: ['search', debouncedQuery, page, pageSize],
    queryFn: () => api.getPaginated<IProduct>(`/api/products?q=${encodeURIComponent(debouncedQuery)}&limit=${pageSize}&page=${page}`),
    enabled: debouncedQuery.trim().length >= 2,
  });

  const results = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const totalResults = data?.pagination?.total ?? results.length;

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPage(1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div>
      {/* Search bar */}
      <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto mb-10">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-brand-cream bg-white pl-12 pr-10 py-4 text-base focus:outline-none focus:border-brand-gold transition-colors"
          placeholder="Search for lehengas, suits, accessories…"
          autoFocus
        />
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-stone" />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-stone hover:text-brand-black"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Results */}
      {debouncedQuery.trim().length >= 2 && (
        <div>
          <p className="text-sm text-brand-stone mb-6">
            {isFetching
              ? 'Searching…'
              : totalResults > 0
              ? `${totalResults} result${totalResults !== 1 ? 's' : ''} for "${debouncedQuery}"`
              : `No results for "${debouncedQuery}"`}
          </p>

          {isFetching ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="aspect-[4/5] bg-brand-cream/40 rounded-lg animate-pulse" />
                  <div className="h-3.5 bg-brand-cream/60 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-brand-cream/40 rounded animate-pulse w-1/3" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {results.map((product: IProduct) => (
                  <ProductCard key={product._id as string} product={product} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                pageSize={pageSize}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                onPageSizeChange={handlePageSizeChange}
              />
            </>
          ) : null}

          {!isFetching && results.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-brand-stone text-sm mb-6">Try a different search term or browse our collections.</p>
              <Link
                href="/collections"
                className="inline-block bg-brand-gold text-white text-[11px] font-semibold tracking-[0.22em] uppercase px-8 py-3.5 hover:bg-[#b8893f] transition-colors"
              >
                Browse Collections
              </Link>
            </div>
          )}
        </div>
      )}

      {debouncedQuery.trim().length < 2 && (
        <p className="text-center text-sm text-brand-stone py-12">
          Start typing to search our catalogue…
        </p>
      )}
    </div>
  );
}
