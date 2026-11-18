'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Collapsible link group on phones (large tap target), always open from `md` up. The links are
 * server-rendered children, so they stay in the HTML when collapsed; collapsed content is
 * `invisible`, which also removes it from the keyboard tab order.
 */
export function FooterNav({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-b border-heading/10 md:border-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full min-h-12 items-center justify-between text-left md:min-h-0 md:pb-4 md:pointer-events-none md:cursor-default"
      >
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-heading">{title}</span>
        <ChevronDown
          size="1.125rem"
          aria-hidden="true"
          className={cn('text-gold transition-transform duration-300 md:hidden', open && 'rotate-180')}
        />
      </button>
      <div
        id={panelId}
        className={cn(
          'grid transition-[grid-template-rows] duration-300 ease-out md:block',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className={cn('overflow-hidden md:overflow-visible', open ? 'visible' : 'invisible md:visible')}>
          {children}
        </div>
      </div>
    </div>
  );
}
