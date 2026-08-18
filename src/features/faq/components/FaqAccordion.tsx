'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem { q: string; a: string; }
interface FaqCategory { category: string; items: FaqItem[]; }

export function FaqAccordion({ faqs }: { faqs: FaqCategory[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      {faqs.map((cat) => (
        <div key={cat.category}>
          <h2 className="text-lg font-serif text-brand-black mb-4 border-b border-brand-cream pb-2">
            {cat.category}
          </h2>
          <div className="space-y-2">
            {cat.items.map((item) => {
              const id = `${cat.category}-${item.q}`;
              const isOpen = open === id;
              return (
                <div key={id} className="border border-brand-cream">
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-brand-black hover:text-brand-gold transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 ml-3 text-brand-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-sm text-brand-stone leading-relaxed border-t border-brand-cream pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
