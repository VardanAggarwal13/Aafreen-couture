'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import type { IProduct } from '@/types';
import type { ApiResponse } from '@/types/api.types';
import { ProductCard } from '@/components/product/ProductCard';

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initial = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initial);
  const [debouncedQuery, setDebouncedQuery] = useState(initial);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(t);
  }, [query]);

  const { data, isFetching } = useQuery<ApiResponse<IProduct[]>>({
    queryKey: ['search', debouncedQuery],
    queryFn: () => api.get<IProduct[]>(`/api/search?q=${encodeURIComponent(debouncedQuery)}`),
    enabled: debouncedQuery.trim().length >= 2,
  });

  const results = data?.data ?? [];

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
              : results.length > 0
              ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${debouncedQuery}"`
              : `No results for "${debouncedQuery}"`}
          </p>

          {results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {results.map((product: IProduct) => (
                <ProductCard key={product._id as string} product={product} />
              ))}
            </div>
          )}

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
