import { CATALOG_SEO, HUB_SEO } from '@/config/catalog-seo.config';

interface CatalogSeoContentProps {
  /** Key into CATALOG_SEO, e.g. "bridal/bridal-lehengas". */
  seoKey?: string;
  /** Key into HUB_SEO, e.g. "bridal". */
  hubKey?: string;
  title?: string;
}

/**
 * Server-rendered descriptive copy under a product listing. Gives every landing
 * page unique, crawlable text and a visible FAQ, instead of a bare product grid.
 */
export function CatalogSeoContent({ seoKey, hubKey, title }: CatalogSeoContentProps) {
  const page = seoKey ? CATALOG_SEO[seoKey] : undefined;
  const hub = hubKey ? HUB_SEO[hubKey] : undefined;
  if (!page && !hub) return null;

  return (
    <section
      aria-label={title ? `About ${title}` : 'About this collection'}
      className="border-t border-[#E8D4BE] bg-[#FAF5EE] px-4 py-10 sm:px-6 sm:py-14 lg:px-12"
    >
      <div className="mx-auto max-w-3xl">
        {page && (
          <>
            <h2 className="mb-4 font-serif text-2xl text-[#221617] sm:text-3xl">{title ? `About ${title}` : 'About this collection'}</h2>
            <p className="text-sm leading-[1.85] text-[#5C554E] sm:text-[15px]">{page.intro}</p>
            <div className="mt-8 rounded-xl border border-[#E8D4BE] bg-white p-5 sm:p-6">
              <h3 className="mb-2 font-sans text-sm font-semibold text-[#221617]">{page.faq.q}</h3>
              <p className="text-sm leading-relaxed text-[#5C554E]">{page.faq.a}</p>
            </div>
          </>
        )}
        {hub && (
          <>
            <h2 className="mb-4 font-serif text-2xl text-[#221617] sm:text-3xl">{hub.heading}</h2>
            <div className="space-y-4">
              {hub.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-[1.85] text-[#5C554E] sm:text-[15px]">
                  {paragraph}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
