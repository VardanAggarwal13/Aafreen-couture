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
          className="w-full bg-white border border-border text-heading placeholder:text-text/60 pl-11 pr-10 py-3.5 sm:py-4 text-xs sm:text-sm rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all shadow-[0_2px_12px_rgba(34,22,23,0.03)]"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-ink" size="1.0625rem" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-text hover:text-heading transition-colors"
            aria-label="Clear search"
          >
            <X size="0.9375rem" />
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
              className={`px-4 py-2 rounded-full text-[0.6875rem] sm:text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-200 select-none flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'bg-gold/20 text-heading border border-gold shadow-xs'
                  : 'bg-white border border-border text-text hover:text-heading hover:border-gold/50'
              }`}
            >
              <span>{cat}</span>
              <span className={`text-[0.59375rem] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-gold text-heading font-bold' : 'bg-background text-text'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Accordion List */}
      <div className="space-y-8">
        {filteredFaqs.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-2xl space-y-3 shadow-sm">
            <HelpCircle size="2rem" className="text-gold-ink mx-auto opacity-70" />
            <h3 className="font-serif font-semibold text-lg text-heading">No Questions Matching &ldquo;{searchQuery}&rdquo;</h3>
            <p className="text-xs sm:text-[0.8125rem] text-text max-w-sm mx-auto leading-relaxed">
              Our concierge team is available to assist you personally with sizing, custom fabrics, or delivery timelines.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-gold-ink hover:text-heading underline font-semibold uppercase tracking-wider"
              >
                Clear Search Filter
              </button>
            </div>
          </div>
        ) : (
          filteredFaqs.map((cat) => (
            <div key={cat.category} className="space-y-3.5">
              <div className="flex items-center justify-between pb-1.5 border-b border-border">
                <h2 className="text-xs sm:text-sm font-serif font-semibold uppercase tracking-[0.15em] text-gold-ink">
                  {cat.category}
                </h2>
                <span className="text-[0.6875rem] font-mono text-text">{cat.items.length} answers</span>
              </div>

              <div className="space-y-2.5">
                {cat.items.map((item) => {
                  const id = `${cat.category}-${item.q}`;
                  const isOpen = open === id;
                  return (
                    <div
                      key={id}
                      className={`bg-white border transition-all duration-200 rounded-lg overflow-hidden shadow-sm ${
                        isOpen ? 'border-gold ring-1 ring-gold/20' : 'border-border hover:border-gold/50'
                      }`}
                    >
                      <button
                        onClick={() => setOpen(isOpen ? null : id)}
                        className="w-full flex items-center justify-between px-5 sm:px-6 py-4 text-left text-xs sm:text-[0.84375rem] font-medium text-heading hover:text-gold-ink transition-colors gap-4"
                        aria-expanded={isOpen}
                      >
                        <span className="font-sans font-semibold pr-2">{item.q}</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'bg-gold/20 text-gold-ink rotate-180' : 'bg-background text-gold-ink'}`}>
                          <ChevronDown size="0.875rem" />
                        </div>
                      </button>
                      <div hidden={!isOpen} className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-[0.8125rem] text-text leading-[1.8] border-t border-border/60 bg-gradient-to-b from-background/40 to-white">
                          <p>{item.a}</p>
                        </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Still Have Questions Box */}
      <div className="bg-navbar text-heading border border-border border-t-2 border-t-gold p-7 sm:p-10 rounded-2xl text-center space-y-4">
        <span className="text-[0.625rem] font-semibold uppercase tracking-[0.3em] text-gold-ink block">
          Dedicated Atelier Support
        </span>
        <h3 className="font-serif font-semibold text-xl sm:text-2xl text-heading">
          Still Have Questions About Sizing or Orders?
        </h3>
        <p className="text-xs sm:text-[0.8125rem] text-text max-w-lg mx-auto leading-relaxed">
          From personalized made-to-measure bridal consultations to express air dispatch coordinates, our stylists are delighted to help.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/${siteConfig.whatsapp}?text=Hello%20Aafreen%20Couture%2C%20I%20have%20a%20question%20regarding%20an%20order.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-gold text-heading hover:bg-background text-[0.6875rem] font-semibold uppercase tracking-[0.16em] px-6 py-3 transition-all rounded-lg shadow-xs flex items-center justify-center gap-2"
          >
            <MessageCircle size="0.9375rem" />
            <span>Chat on WhatsApp</span>
          </a>

          <a
            href={`tel:${siteConfig.phone}`}
            className="w-full sm:w-auto bg-transparent text-heading hover:text-gold-ink border border-heading/30 hover:border-gold text-[0.6875rem] font-semibold uppercase tracking-[0.16em] px-6 py-3 transition-colors flex items-center justify-center gap-2 rounded-lg"
          >
            <Phone size="0.875rem" className="text-gold-ink" />
            <span>Call: {siteConfig.phone}</span>
          </a>

          <Link
            href="/contact"
            className="w-full sm:w-auto bg-transparent text-heading hover:text-gold-ink border border-heading/30 hover:border-gold text-[0.6875rem] font-semibold uppercase tracking-[0.16em] px-6 py-3 transition-colors flex items-center justify-center gap-2 rounded-lg"
          >
            <Mail size="0.875rem" className="text-gold-ink" />
            <span>Write to Us</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
