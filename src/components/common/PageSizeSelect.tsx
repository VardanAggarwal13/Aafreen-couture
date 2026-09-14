'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface PageSizeSelectProps {
  pageSize: number;
  pageSizeOptions: number[];
  /** Client mode: called with the new page size instead of navigating. */
  onPageSizeChange?: (size: number) => void;
}

export function PageSizeSelect({ pageSize, pageSizeOptions, onPageSizeChange }: PageSizeSelectProps) {
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
      className="border border-[#E8D8C8] bg-white rounded-lg px-2 py-1.5 text-xs text-[#221617] outline-none focus:border-[#C49A5A] cursor-pointer"
    >
      {pageSizeOptions.map((size) => (
        <option key={size} value={size}>{size}</option>
      ))}
    </select>
  );
}
