'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface AdminPageSizeSelectProps {
  pageSize: number;
  pageSizeOptions: number[];
  /** Client mode: called with the new page size instead of navigating. */
  onPageSizeChange?: (size: number) => void;
}

export function AdminPageSizeSelect({ pageSize, pageSizeOptions, onPageSizeChange }: AdminPageSizeSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const size = Number(e.target.value);
    if (onPageSizeChange) {
      onPageSizeChange(size);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', String(size));
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={pageSize}
      onChange={handleChange}
      className="bg-white border border-[#DDD2C5] rounded-lg px-1.5 py-1 text-[11px] text-[#2E221C] outline-none focus:border-[#C9A86A] cursor-pointer"
    >
      {pageSizeOptions.map((size) => (
        <option key={size} value={size}>{size}</option>
      ))}
    </select>
  );
}
