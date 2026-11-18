'use client';

import { useState, useEffect } from 'react';
import { Share2, Check, ShieldCheck, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { siteConfig } from '@/config/site.config';

export interface TocItem {
  id: string;
  number: string | number;
  title: string;
}

interface PolicySidebarProps {
  toc: TocItem[];
  title?: string;
}

export function PolicySidebar({ toc, title }: PolicySidebarProps) {
  const [activeId, setActiveId] = useState<string>(toc[0]?.id || '');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;

      for (let i = toc.length - 1; i >= 0; i--) {
        const item = toc[i];
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(item.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [toc]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -160;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link copied to clipboard', {
        description: 'You can now share this official policy page.',
      });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <aside aria-label={title || 'Policy navigation'} className="space-y-6 sticky top-[8.5rem] sm:top-[9rem] lg:top-[9.5rem]">
      {/* Whole sidebar sticks below the double sticky header and follows the reader */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-5">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <p className="text-[0.625rem] font-semibold uppercase tracking-[0.25em] text-gold-ink">
              Table of Contents
            </p>
            <span className="text-[0.625rem] text-text font-mono">
              {toc.length} Sections
            </span>
          </div>

          {/* Quick links list */}
          <nav className="mt-3 max-h-[30dvh] overflow-y-auto space-y-1 pr-1 text-xs font-sans scrollbar-thin">
            {toc.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg flex items-start gap-2.5 transition-all group ${
                    isActive
                      ? 'bg-gold/15 text-heading font-semibold border border-gold/40'
                      : 'text-text hover:text-heading hover:bg-background'
                  }`}
                >
                  <span
                    className={`text-[0.625rem] font-mono px-1.5 py-0.5 rounded-2xs shrink-0 ${
                      isActive
                        ? 'bg-gold text-heading font-bold'
                        : 'bg-background text-gold-ink group-hover:bg-border'
                    }`}
                  >
                    {item.number}
                  </span>
                  <span className="truncate text-[0.71875rem] leading-tight mt-0.5">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Tools */}
        <div className="pt-4 border-t border-border space-y-2">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-background hover:bg-border/60 text-heading border border-border rounded-lg text-[0.6875rem] font-medium transition-colors"
          >
            {copied ? <Check size="0.8125rem" className="text-emerald-600" /> : <Share2 size="0.8125rem" />}
            <span>{copied ? 'Link Copied!' : 'Copy Page Link'}</span>
          </button>
        </div>

        {/* Trust & Payment Security Seal */}
        <div className="bg-navbar text-heading border border-border border-t-2 border-t-gold p-4 rounded-xl text-xs font-sans space-y-2">
          <div className="flex items-center gap-1.5 text-gold-ink font-semibold text-[0.6875rem] uppercase tracking-wider">
            <ShieldCheck size="0.875rem" />
            <span>Secure Packaging</span>
          </div>
          <p className="text-[0.6875rem] text-text leading-relaxed">
            All shipments are packed in tamper-proof luxury packaging.
          </p>
        </div>

        {/* Boutique Concierge mini-box */}
        <div className="bg-background rounded-xl shadow-sm p-4 text-xs font-sans space-y-2.5">
          <p className="font-semibold text-heading text-[0.6875rem] uppercase tracking-wide">
            Need Personal Guidance?
          </p>
          <p className="text-text text-[0.6875rem] leading-relaxed">
            Our atelier concierge is at your service regarding custom sizing, alterations, or dispatch updates.
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full bg-gold text-heading hover:bg-gold-hover font-semibold py-2.5 rounded-lg text-[0.6875rem] uppercase tracking-wider border border-gold/30 transition-all shadow-xs"
          >
            <MessageCircle size="0.8125rem" />
            <span>WhatsApp Concierge</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
