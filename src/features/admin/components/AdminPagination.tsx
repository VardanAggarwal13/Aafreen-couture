import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminPageSizeSelect } from '@/features/admin/components/AdminPageSizeSelect';

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  /** Client mode: called with the target page number. */
  onPageChange?: (page: number) => void;
  /** Server/link mode: returns the href for a given page number. */
  hrefForPage?: (page: number) => string;
  /** Optional "items per page" control. */
  pageSize?: number;
  pageSizeOptions?: number[];
  /** Client mode: called with the new page size. */
  onPageSizeChange?: (size: number) => void;
}

function pageWindow(page: number, totalPages: number): number[] {
  const span = 1;
  const start = Math.max(1, page - span);
  const end = Math.min(totalPages, page + span);
  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
}

export function AdminPagination({
  page,
  totalPages,
  onPageChange,
  hrefForPage,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
}: AdminPaginationProps) {
  const showPageSize = pageSize !== undefined && pageSizeOptions && pageSizeOptions.length > 0;
  if (totalPages <= 1 && !showPageSize) return null;

  const pages = pageWindow(page, totalPages);
  const btnBase =
    'inline-flex items-center justify-center min-w-8 h-8 px-2 text-xs font-medium rounded-lg border transition-colors';
  const activeCls = 'bg-[#C9A86A] border-[#C9A86A] text-white';
  const idleCls = 'bg-white border-[#DDD2C5] text-[#2E221C] hover:border-[#C9A86A] hover:text-[#9E7B3A]';
  const disabledCls = 'bg-[#FAF7F2] border-[#DDD2C5] text-[#8A6A55]/40 cursor-not-allowed';

  function renderNumber(p: number) {
    const cls = `${btnBase} ${p === page ? activeCls : idleCls}`;
    if (hrefForPage) {
      return (
        <Link key={p} href={hrefForPage(p)} className={cls} aria-current={p === page ? 'page' : undefined}>
          {p}
        </Link>
      );
    }
    return (
      <button key={p} type="button" onClick={() => onPageChange?.(p)} className={`${cls} cursor-pointer`} aria-current={p === page ? 'page' : undefined}>
        {p}
      </button>
    );
  }

  function renderNav(direction: 'prev' | 'next') {
    const target = direction === 'prev' ? page - 1 : page + 1;
    const disabled = direction === 'prev' ? page <= 1 : page >= totalPages;
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
    const label = direction === 'prev' ? 'Previous page' : 'Next page';

    if (disabled) {
      return (
        <span className={`${btnBase} ${disabledCls}`} aria-hidden="true">
          <Icon size={14} />
        </span>
      );
    }
    if (hrefForPage) {
      return (
        <Link href={hrefForPage(target)} className={`${btnBase} ${idleCls}`} aria-label={label}>
          <Icon size={14} />
        </Link>
      );
    }
    return (
      <button type="button" onClick={() => onPageChange?.(target)} className={`${btnBase} ${idleCls} cursor-pointer`} aria-label={label}>
        <Icon size={14} />
      </button>
    );
  }

  return (
    <nav className="flex items-center justify-between gap-3 px-3.5 py-2.5 border-t border-[#DDD2C5] flex-wrap" aria-label="Pagination">
      <div className="flex items-center gap-3">
        <p className="text-[11px] text-[#8A6A55] font-sans">
          Page {page} of {totalPages}
        </p>
        {showPageSize && (
          <label className="flex items-center gap-1.5 text-[11px] text-[#8A6A55] font-sans">
            <span className="hidden sm:inline">Show</span>
            <AdminPageSizeSelect
              pageSize={pageSize!}
              pageSizeOptions={pageSizeOptions!}
              onPageSizeChange={onPageSizeChange}
            />
            <span className="hidden sm:inline">per page</span>
          </label>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          {renderNav('prev')}
          {pages[0] > 1 && (
            <>
              {renderNumber(1)}
              {pages[0] > 2 && <span className="text-[#8A6A55] text-xs px-1">…</span>}
            </>
          )}
          {pages.map(renderNumber)}
          {pages[pages.length - 1] < totalPages && (
            <>
              {pages[pages.length - 1] < totalPages - 1 && <span className="text-[#8A6A55] text-xs px-1">…</span>}
              {renderNumber(totalPages)}
            </>
          )}
          {renderNav('next')}
        </div>
      )}
    </nav>
  );
}
