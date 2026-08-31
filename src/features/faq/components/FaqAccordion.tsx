'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Search, HelpCircle, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site.config';

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  category: string;
  items: FaqItem[];
}

export function FaqAccordion({ faqs }: { faqs: FaqCategory[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = useMemo(() => ['All', ...faqs.map((f) => f.category)], [faqs]);

  const filteredFaqs = useMemo(() => {
    return faqs
      .filter((cat) => activeCategory === 'All' || cat.category === activeCategory)
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [faqs, activeCategory, searchQuery]);

  return (
    <div className="space-y-8 font-sans">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions (e.g., customisation, shipping, refund, Razorpay)..."
          className="w-full bg-white border border-[#E8D8C8] text-[#221617] placeholder:text-[#7D756C]/60 pl-11 pr-4 py-3.5 text-xs sm:text-sm rounded-xs focus:outline-none focus:border-[#C49A5A] transition-colors shadow-2xs"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A67C52]" size={16} />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all select-none ${
              activeCategory === cat
                ? 'bg-[#221617] text-[#C49A5A] shadow-xs'
                : 'bg-white border border-[#E8D8C8] text-[#6E6A66] hover:text-[#221617] hover:border-[#C49A5A]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-8">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white border border-[#E8D8C8] p-8 text-center rounded-sm space-y-3">
            <HelpCircle size={28} className="text-[#C49A5A] mx-auto opacity-70" />
            <p className="font-serif text-base text-[#1A1011] uppercase tracking-wide">No questions found</p>
            <p className="text-xs text-[#6E6A66] max-w-sm mx-auto">
              We couldn&apos;t find any FAQs matching &ldquo;{searchQuery}&rdquo;. Connect with our concierge for direct guidance.
            </p>
          </div>
        ) : (
          filteredFaqs.map((cat) => (
            <div key={cat.category} className="space-y-3">
              <h2 className="text-sm font-serif uppercase tracking-[0.2em] text-[#A67C52] flex items-center gap-2 pb-1 border-b border-[#E8D8C8]">
                <span>✦</span>
                <span>{cat.category}</span>
              </h2>

              <div className="space-y-2.5">
                {cat.items.map((item) => {
                  const id = `${cat.category}-${item.q}`;
                  const isOpen = open === id;
                  return (
                    <div
                      key={id}
                      className={`bg-white border transition-colors rounded-sm overflow-hidden ${
                        isOpen ? 'border-[#C49A5A]/60 shadow-xs' : 'border-[#E8D8C8]'
                      }`}
                    >
                      <button
                        onClick={() => setOpen(isOpen ? null : id)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left text-xs sm:text-sm font-medium text-[#1A1011] hover:text-[#A67C52] transition-colors"
                      >
                        <span className="font-sans pr-3">{item.q}</span>
                        <ChevronDown
                          size={15}
                          className={`shrink-0 text-[#A67C52] transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-xs sm:text-sm text-[#5C554E] leading-relaxed border-t border-[#E8D8C8]/60 pt-3 bg-[#FAF7F2]/50">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Still Have Questions Box */}
      <div className="bg-[#221617] text-white p-6 sm:p-8 rounded-sm border border-[#C49A5A]/40 text-center space-y-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#C49A5A]">
          Have More Questions?
        </p>
        <h3 className="font-serif text-lg sm:text-xl uppercase tracking-wide text-white">
          Our Atelier Concierge is at Your Service
        </h3>
        <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
          From bridal styling advice to measurement guidance, we are ready to assist you via WhatsApp or Email.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#25D366] text-white hover:bg-[#20ba59] text-[11px] font-semibold uppercase tracking-wider px-6 py-2.5 transition-colors flex items-center justify-center gap-2 rounded-xs"
          >
            <MessageCircle size={14} />
            <span>Chat on WhatsApp</span>
          </a>
          <a
            href="/contact"
            className="w-full sm:w-auto bg-[#C49A5A] text-[#1A1011] hover:bg-white text-[11px] font-semibold uppercase tracking-wider px-6 py-2.5 transition-colors rounded-xs"
          >
            Submit Enquiry
          </a>
        </div>
      </div>
    </div>
  );
}
