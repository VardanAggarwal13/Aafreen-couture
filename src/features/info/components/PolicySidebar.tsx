'use client';

import { useState, useEffect } from 'react';
import { Share2, Printer, Check, ShieldCheck, MessageCircle } from 'lucide-react';
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

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <aside aria-label={title || 'Policy navigation'} className="space-y-6">
      {/* Table of Contents Card - offset below double sticky header */}
      <div className="bg-white border border-[#E8D8C8] rounded-xs p-5 shadow-[0_4px_16px_rgba(34,22,23,0.04)] sticky top-[136px] sm:top-[144px] lg:top-[152px] space-y-5">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#E8D8C8]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A67C52]">
              Table of Contents
            </p>
            <span className="text-[10px] text-[#7D756C] font-mono">
              {toc.length} Sections
            </span>
          </div>

          {/* Quick links list */}
          <nav className="mt-3 max-h-[44vh] overflow-y-auto space-y-1 pr-1 text-xs font-sans scrollbar-thin">
            {toc.map((item) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-xs flex items-start gap-2.5 transition-all group ${
                    isActive
                      ? 'bg-[#221617] text-[#C49A5A] font-medium shadow-xs'
                      : 'text-[#5C554E] hover:text-[#221617] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-2xs shrink-0 ${
                      isActive
                        ? 'bg-[#C49A5A] text-[#1A1011] font-bold'
                        : 'bg-[#FAF7F2] text-[#A67C52] group-hover:bg-[#E8D8C8]'
                    }`}
                  >
                    {item.number}
                  </span>
                  <span className="truncate text-[11.5px] leading-tight mt-0.5">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Tools */}
        <div className="pt-4 border-t border-[#E8D8C8] space-y-2">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#FAF7F2] hover:bg-[#E8D8C8]/60 text-[#221617] border border-[#E8D8C8] rounded-xs text-[11px] font-medium transition-colors"
          >
            {copied ? <Check size={13} className="text-emerald-600" /> : <Share2 size={13} />}
            <span>{copied ? 'Link Copied!' : 'Copy Page Link'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#FAF7F2] hover:bg-[#E8D8C8]/60 text-[#221617] border border-[#E8D8C8] rounded-xs text-[11px] font-medium transition-colors"
          >
            <Printer size={13} />
            <span>Print or Save PDF</span>
          </button>
        </div>

        {/* Trust & Payment Security Seal */}
        <div className="bg-[#221617] text-white p-4 rounded-xs border border-[#C49A5A]/30 text-xs font-sans space-y-2">
          <div className="flex items-center gap-1.5 text-[#C49A5A] font-semibold text-[11px] uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>100% Insured Delivery</span>
          </div>
          <p className="text-[11px] text-white/70 leading-relaxed">
            All shipments are packed in tamper-proof luxury packaging and fully insured until doorstep delivery.
          </p>
        </div>

        {/* Boutique Concierge mini-box */}
        <div className="bg-[#FAF7F2] border border-[#E8D8C8] p-4 rounded-xs text-xs font-sans space-y-2.5">
          <p className="font-semibold text-[#1A1011] text-[11px] uppercase tracking-wide">
            Need Personal Guidance?
          </p>
          <p className="text-[#6E6A66] text-[11px] leading-relaxed">
            Our atelier concierge is at your service regarding custom sizing, alterations, or dispatch updates.
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full bg-[#221617] text-[#C49A5A] hover:bg-[#3D2628] font-semibold py-2.5 rounded-xs text-[11px] uppercase tracking-wider border border-[#C49A5A]/30 transition-all shadow-xs"
          >
            <MessageCircle size={13} />
            <span>WhatsApp Concierge</span>
          </a>
        </div>
      </div>
    </aside>
  );
}
