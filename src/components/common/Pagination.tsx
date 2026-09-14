import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { PageSizeSelect } from '@/components/common/PageSizeSelect';

interface PaginationProps {
  page: number;
  totalPages: number;
  /** Client mode: called with the target page number. */
  onPageChange?: (page: number) => void;
  /** Server/link mode: returns the href for a given page number. */
  hrefForPage?: (page: number) => string;
  /** Optional "items per page" control. */
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  hrefForPage,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
}: PaginationProps) {
  const showPageSize = pageSize !== undefined && pageSizeOptions && pageSizeOptions.length > 0;
  if (totalPages <= 1 && !showPageSize) return null;

  function go(p: number) {
    onPageChange?.(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderButton(p: number, label: React.ReactNode, variant: 'couture-outline' | 'couture', size: 'couture-sm' | 'icon-sm', disabled = false) {
    const cls = buttonVariants({
      variant,
      size,
      className: `${disabled ? 'disabled:opacity-30 disabled:pointer-events-none' : 'cursor-pointer'} ${variant === 'couture-outline' ? 'hover:border-[#C49A5A]' : ''}`,
    });

    if (hrefForPage) {
      if (disabled) return <span key={`${p}-${label}`} className={cls} aria-hidden="true">{label}</span>;
      return <Link key={`${p}-${label}`} href={hrefForPage(p)} className={cls}>{label}</Link>;
    }
    return (
      <button key={`${p}-${label}`} type="button" disabled={disabled} onClick={() => go(p)} className={cls}>
        {label}
      </button>
    );
  }

  return (
    <div className="mt-8 sm:mt-10 pt-4 sm:pt-5 border-t border-[#E8D8C8] flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 flex-wrap">
      {totalPages > 1 && (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {renderButton(Math.max(1, page - 1), '← Previous', 'couture-outline', 'couture-sm', page <= 1)}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) =>
            renderButton(pNum, pNum, pNum === page ? 'couture' : 'couture-outline', 'icon-sm')
          )}

          {renderButton(Math.min(totalPages, page + 1), 'Next →', 'couture-outline', 'couture-sm', page >= totalPages)}
        </div>
      )}
      {showPageSize && (
        <label className="flex items-center gap-2 text-xs text-[#5C554E] font-sans">
          <span>Show</span>
          <PageSizeSelect
            pageSize={pageSize!}
            pageSizeOptions={pageSizeOptions!}
            onPageSizeChange={onPageSizeChange}
          />
          <span>per page</span>
        </label>
      )}
    </div>
  );
}
