'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, X, ArrowRight } from 'lucide-react';
import { api } from '@/utils/api';
import { formatPrice } from '@/utils/format';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/utils';
import type { IProduct } from '@/types';
import type { ApiResponse } from '@/types/api.types';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const RESULT_LIMIT = 8;

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => {
        document.body.style.overflow = '';
        clearTimeout(t);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setDebouncedQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const trimmed = debouncedQuery.trim();
  const { data, isFetching } = useQuery<ApiResponse<IProduct[]>>({
    queryKey: ['search-overlay', trimmed],
    queryFn: () => api.get<IProduct[]>(`/api/products?q=${encodeURIComponent(trimmed)}&limit=${RESULT_LIMIT}`),
    enabled: isOpen && trimmed.length >= 2,
  });

  const results = data?.data ?? [];

  function goToFullResults() {
    const q = query.trim();
    if (!q) return;
    router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(q)}`);
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    goToFullResults();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[9vh] sm:pt-[11vh] pb-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-surface rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[74vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Search input row */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 sm:px-6 h-16 sm:h-[68px] shrink-0">
          <Search size={19} className={cn('shrink-0 transition-colors', focused ? 'text-gold' : 'text-text/50')} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="What are you looking for?"
            className="flex-1 bg-transparent text-base sm:text-lg text-heading placeholder:text-text/45 outline-none min-w-0"
          />
          <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-md border border-border text-[10px] font-mono text-text/50 bg-background shrink-0">
            esc
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-full text-text/60 hover:text-heading hover:bg-background transition-colors cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </form>
        <div className="border-t border-border" />

        {/* Results */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6 py-4">
          {trimmed.length < 2 ? (
            <p className="text-sm text-text/60 text-center py-10 font-sans">
              Start typing to search our full catalogue…
            </p>
          ) : isFetching ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5 sm:gap-4">
              {Array.from({ length: RESULT_LIMIT }, (_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="aspect-[4/5] rounded-lg bg-background animate-pulse" />
                  <div className="h-2.5 bg-background rounded-full animate-pulse w-4/5" />
                  <div className="h-2.5 bg-background rounded-full animate-pulse w-1/3" />
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 sm:py-10">
              <p className="text-sm font-medium text-heading mb-1">
                No results for &ldquo;{trimmed}&rdquo;
              </p>
              <p className="text-xs text-text/70 font-sans mb-4">
                Try a different search term, or explore our curated edits below.
              </p>
              <Link
                href={ROUTES.COLLECTIONS}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold hover:text-heading transition-colors"
              >
                Browse Collections
                <ArrowRight size={12} />
              </Link>
            </div>
          ) : (
            <>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-text/50 pb-2.5">
                {results.length} Result{results.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5 sm:gap-4">
                {results.map((product) => (
                  <Link
                    key={String(product._id)}
                    href={ROUTES.PRODUCT(product.slug)}
                    onClick={onClose}
                    className="group flex flex-col gap-2"
                  >
                    <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-background border border-border">
                      {product.images?.[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 30vw, 22vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-heading line-clamp-1 group-hover:text-gold transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs text-text/80 mt-0.5">{formatPrice(product.basePrice)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer action */}
        {trimmed.length >= 2 && results.length > 0 && (
          <button
            onClick={goToFullResults}
            className="group w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-heading hover:text-gold transition-colors py-3.5 border-t border-border shrink-0 cursor-pointer"
          >
            <span>View All Results</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </div>
    </div>
  );
}
