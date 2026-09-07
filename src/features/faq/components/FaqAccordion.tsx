'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Search, HelpCircle, MessageCircle, X, Phone, Mail } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import Link from 'next/link';

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  category: string;
  items: FaqItem[];
}

export function FaqAccordion({ faqs }: { faqs: FaqCategory[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.items[0]?.q ? `${faqs[0].category}-${faqs[0].items[0].q}` : null);
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
      {/* Interactive Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions (e.g., customisation, bridal measurements, shipping, refund)..."
          className="w-full bg-white border border-[#E8D8C8] text-[#221617] placeholder:text-[#8C7E72]/60 pl-11 pr-10 py-3.5 sm:py-4 text-xs sm:text-sm rounded-xs focus:outline-none focus:border-[#C49A5A] focus:ring-1 focus:ring-[#C49A5A]/30 transition-all shadow-[0_2px_12px_rgba(34,22,23,0.03)]"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A67C52]" size={17} />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#8C7E72] hover:text-[#221617] transition-colors"
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          const count = cat === 'All' 
            ? faqs.reduce((acc, c) => acc + c.items.length, 0)
            : faqs.find((c) => c.category === cat)?.items.length ?? 0;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[11px] sm:text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-200 select-none flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'bg-[#221617] text-[#C49A5A] border border-[#C49A5A]/40 shadow-xs'
                  : 'bg-white border border-[#E8D8C8] text-[#6E6A66] hover:text-[#221617] hover:border-[#C49A5A]/50'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-[#C49A5A] text-[#1A1011] font-bold' : 'bg-[#FAF7F2] text-[#8C7E72]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Accordion List */}
      <div className="space-y-8">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white border border-[#E8D8C8] p-10 text-center rounded-xs space-y-3 shadow-2xs">
            <HelpCircle size={32} className="text-[#C49A5A] mx-auto opacity-70" />
            <h3 className="font-serif text-lg text-[#221617] uppercase tracking-wide">No Questions Matching &ldquo;{searchQuery}&rdquo;</h3>
            <p className="text-xs sm:text-[13px] text-[#6E6A66] max-w-sm mx-auto leading-relaxed">
              Our concierge team is available to assist you personally with sizing, custom fabrics, or delivery timelines.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#A67C52] hover:text-[#221617] underline font-semibold uppercase tracking-wider"
              >
                Clear Search Filter
              </button>
            </div>
          </div>
        ) : (
          filteredFaqs.map((cat) => (
            <div key={cat.category} className="space-y-3.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#E8D8C8]">
                <h2 className="text-xs sm:text-sm font-serif uppercase tracking-[0.2em] text-[#A67C52] flex items-center gap-2">
                  <span>✦</span>
                  <span>{cat.category}</span>
                </h2>
                <span className="text-[11px] font-mono text-[#8C7E72]">{cat.items.length} answers</span>
              </div>

              <div className="space-y-2.5">
                {cat.items.map((item) => {
                  const id = `${cat.category}-${item.q}`;
                  const isOpen = open === id;
                  return (
                    <div
                      key={id}
                      className={`bg-white border transition-all duration-200 rounded-xs overflow-hidden shadow-2xs ${
                        isOpen ? 'border-[#C49A5A] ring-1 ring-[#C49A5A]/20' : 'border-[#E8D8C8] hover:border-[#C49A5A]/50'
                      }`}
                    >
                      <button
                        onClick={() => setOpen(isOpen ? null : id)}
                        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left text-xs sm:text-[13.5px] font-medium text-[#221617] hover:text-[#A67C52] transition-colors gap-4"
                        aria-expanded={isOpen}
                      >
                        <span className="font-serif font-semibold tracking-wide pr-2">{item.q}</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'bg-[#221617] text-[#C49A5A] rotate-180' : 'bg-[#FAF7F2] text-[#A67C52]'}`}>
                          <ChevronDown size={14} />
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-[13px] text-[#5C554E] leading-[1.8] border-t border-[#E8D8C8]/60 bg-gradient-to-b from-[#FAF7F2]/40 to-white">
                          <p>{item.a}</p>
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
      <div className="bg-[#221617] text-white p-7 sm:p-10 rounded-xs border border-[#C49A5A]/30 text-center space-y-4 shadow-md">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C49A5A] block">
          ✦ Dedicated Atelier Support
        </span>
        <h3 className="font-serif text-xl sm:text-2xl uppercase tracking-wider text-white">
          Still Have Questions About Sizing or Orders?
        </h3>
        <p className="text-xs sm:text-[13px] text-white/70 max-w-lg mx-auto leading-relaxed">
          From personalized made-to-measure bridal consultations to express air dispatch coordinates, our stylists are delighted to help.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/${siteConfig.whatsapp}?text=Hello%20Aafreen%20Couture%2C%20I%20have%20a%20question%20regarding%20an%20order.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#C49A5A] text-[#1A1011] hover:bg-[#FAF7F2] text-[11px] font-semibold uppercase tracking-[0.16em] px-6 py-3 transition-all rounded-xs shadow-xs flex items-center justify-center gap-2"
          >
            <MessageCircle size={15} />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href={`tel:${siteConfig.phone}`}
            className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/20 border border-white/20 text-[11px] font-semibold uppercase tracking-[0.16em] px-6 py-3 transition-colors flex items-center justify-center gap-2 rounded-xs"
          >
            <Phone size={14} className="text-[#C49A5A]" />
            <span>Call: {siteConfig.phone}</span>
          </a>

          <Link
            href="/contact"
            className="w-full sm:w-auto bg-transparent text-white/80 hover:text-white border border-white/20 text-[11px] font-semibold uppercase tracking-[0.16em] px-6 py-3 transition-colors flex items-center justify-center gap-2 rounded-xs"
          >
            <Mail size={14} className="text-[#C49A5A]" />
            <span>Write to Us</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
