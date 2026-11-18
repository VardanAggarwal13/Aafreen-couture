import { HelpCircle } from 'lucide-react';
import { CATALOG_SEO, HUB_SEO } from '@/config/catalog-seo.config';

interface CatalogSeoContentProps {
  /** Key into CATALOG_SEO, e.g. "bridal/bridal-lehengas". */
  seoKey?: string;
  /** Key into HUB_SEO, e.g. "bridal". */
  hubKey?: string;
  title?: string;
  /**
   * "section" (default): full-width band with the heading beside the copy.
   * "column": a plain column that sits beside another block (used next to the consultation block).
   */
  variant?: 'section' | 'column';
}

/**
 * Server-rendered descriptive copy under a product listing. Gives every landing
 * page unique, crawlable text and a visible FAQ, instead of a bare product grid.
 */
export function CatalogSeoContent({ seoKey, hubKey, title, variant = 'section' }: CatalogSeoContentProps) {
  const page = seoKey ? CATALOG_SEO[seoKey] : undefined;
  const hub = hubKey ? HUB_SEO[hubKey] : undefined;
  if (!page && !hub) return null;

  const label = title ? `About ${title}` : 'About this collection';
  const heading = page ? label : hub?.heading;
  const paragraphs = page ? [page.intro] : (hub?.paragraphs ?? []);
  const isColumn = variant === 'column';

  const headingBlock = (
    <div className={isColumn ? undefined : 'lg:sticky lg:top-28 lg:self-start'}>
      <div className="mb-4 flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-8 bg-[#C49A5A]" />
        <p className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.3em] text-gold-ink sm:text-[0.6875rem]">
          From The Atelier
        </p>
      </div>
      <h2 className="font-serif text-[1.75rem] leading-[1.15] tracking-tight text-[#221617] sm:text-4xl lg:text-[2.25rem]">
        {heading}
      </h2>
    </div>
  );

  const copyBlock = (
    <div className={isColumn ? 'mt-5' : undefined}>
      <div className="space-y-4">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="font-sans text-sm leading-[1.85] text-[#5C554E] sm:text-[0.9375rem]">
            {paragraph}
          </p>
        ))}
      </div>

      {page && (
        <div className="mt-8 flex gap-3 rounded-md border border-[#E8D8C8] border-l-[3px] border-l-[#C49A5A] bg-white p-5">
          <HelpCircle size="1.125rem" className="mt-0.5 shrink-0 text-[#C49A5A]" aria-hidden="true" />
          <div className="min-w-0">
            <h3 className="font-serif text-lg font-semibold leading-snug text-[#221617]">{page.faq.q}</h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-[#5C554E]">{page.faq.a}</p>
          </div>
        </div>
      )}
    </div>
  );

  if (isColumn) {
    return (
      <section aria-label={label} className="border-t border-[#E8D8C8] pt-12 lg:border-t-0 lg:pt-0 lg:pl-12 xl:pl-20">
        {headingBlock}
        {copyBlock}
      </section>
    );
  }

  return (
    <section
      aria-label={label}
      className="border-t border-[#E8D4BE] bg-[#FAF5EE] px-4 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-20"
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        {headingBlock}
        {copyBlock}
      </div>
    </section>
  );
}
