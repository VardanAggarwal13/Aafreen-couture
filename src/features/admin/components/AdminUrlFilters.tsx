'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

/** Updates one query parameter, drops the page number (a new filter starts on page 1) and navigates. */
function useParamNavigator() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (param: string, value: string, replace = false) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(param, value);
    else params.delete(param);
    params.delete('page');
    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    if (replace) router.replace(url);
    else router.push(url);
  };
}

interface SearchProps {
  param?: string;
  placeholder: string;
  initialValue: string;
  className?: string;
}

/** Search box that filters on the server: it updates the URL after a short pause in typing. */
export function AdminUrlSearch({ param = 'q', placeholder, initialValue, className }: SearchProps) {
  const go = useParamNavigator();
  const [value, setValue] = useState(initialValue);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goRef = useRef(go);
  goRef.current = go;

  // Keep the box in step with the URL (e.g. after "clear filters" or the browser back button).
  useEffect(() => setValue(initialValue), [initialValue]);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function onChange(next: string) {
    setValue(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => goRef.current(param, next.trim(), true), 400);
  }

  return (
    <div className={`relative ${className ?? ''}`}>
      <Search size="0.875rem" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A6A55]" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (timer.current) clearTimeout(timer.current);
            go(param, value.trim(), true);
          }
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-[#FAF7F2] border border-[#DDD2C5] rounded-lg pl-8 pr-3 py-2 text-xs text-[#2E221C] placeholder:text-[#8A6A55]/60 outline-none focus:border-[#C9A86A] transition-colors"
      />
    </div>
  );
}

interface SelectProps {
  param: string;
  value: string;
  options: { value: string; label: string }[];
  ariaLabel: string;
  className?: string;
}

/** Drop-down that filters on the server by setting one query parameter. */
export function AdminUrlSelect({ param, value, options, ariaLabel, className }: SelectProps) {
  const go = useParamNavigator();
  return (
    <select
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => go(param, e.target.value)}
      className={`bg-white border border-[#DDD2C5] rounded-lg px-3.5 py-2 text-xs text-[#2E221C] outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] shadow-xs cursor-pointer ${className ?? ''}`}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
