import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { collectionRepository } from '@/server/repositories/collection.repository';
import { productService } from '@/server/services/product.service';
import { ProductCard } from '@/components/product/ProductCard';
import { siteConfig } from '@/config/site.config';
import type { IProduct } from '@/types';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await collectionRepository.findBySlug(slug);
  if (!collection) return { title: 'Collection Not Found' };
  return {
    title: `${collection.seoTitle ?? collection.name} | Aafreen Couture`,
    description: collection.seoDescription ?? collection.description,
    openGraph: {
      title: collection.name,
      description: collection.description,
      images: collection.bannerImage ? [{ url: collection.bannerImage }] : [],
    },
    alternates: { canonical: `${siteConfig.url}/collections/${slug}` },
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const collection = await collectionRepository.findBySlug(slug);
  if (!collection) notFound();

  const result = await productService.getProducts(
    { collectionRef: collection.slug || String(collection._id) },
    { page: 1, limit: 48 }
  );
  let products = (JSON.parse(JSON.stringify(result.data ?? [])) as IProduct[]);

  if (products.length === 0) {
    const catFallback = await productService.getProducts(
      { category: slug },
      { page: 1, limit: 48 }
    );
    if (catFallback.data?.length) {
      products = JSON.parse(JSON.stringify(catFallback.data)) as IProduct[];
    }
  }

  const isBridal = slug === 'bridal' || slug === 'bridal-lehengas-suits';

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Hero Section */}
      {isBridal ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#FDFBF7] via-[#FAF5EC] to-[#F5ECE1] border-b border-[#E8D4BE]">
          {/* Subtle gold ornamental corner accents */}
          <div className="absolute top-4 left-4 w-5 h-5 border-t border-l border-[#C49A5A]/50 pointer-events-none hidden sm:block" />
          <div className="absolute top-4 right-4 w-5 h-5 border-t border-r border-[#C49A5A]/50 pointer-events-none hidden sm:block" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
              {/* Left Column: Royal Narrative & Atelier Pillars */}
              <div className="lg:col-span-6 text-left order-2 lg:order-1 flex flex-col justify-center">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-8 h-px bg-[#C49A5A]" />
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#A67C52] font-semibold">
                    Aafreen Atelier · Royal Heritage
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#221617] tracking-tight leading-[1.15] mb-3">
                  The Royal <span className="italic font-light text-[#A67C52]">Bridal</span> Edit
                </h1>

                {/* Ornamental Filigree Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="h-px w-10 bg-gradient-to-r from-[#C49A5A] to-transparent" />
                  <span className="text-[#C49A5A] text-xs">✦</span>
                  <div className="h-px w-10 bg-gradient-to-l from-[#C49A5A] to-transparent" />
                </div>

                <p className="text-sm sm:text-base text-[#5C554E] font-sans leading-relaxed mb-6 max-w-lg">
                  {collection.description || 'An ode to the timeless majesty of royal Indian weddings. Each masterpiece is individually hand-embroidered by master artisans in pure silks, velvets, and heirloom organza, adorned with authentic zardozi, dabka, cutdana, and micro-pearl craftsmanship.'}
                </p>

                {/* Atelier Craftsmanship Highlights */}
                <div className="space-y-2.5 pb-6 mb-6 border-b border-[#E8D4BE]/70">
                  <div className="flex items-center gap-3 text-xs text-[#3D332A] font-serif tracking-wide">
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0" />
                    <span>200+ hours of painstaking hand embroidery per ensemble</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#3D332A] font-serif tracking-wide">
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0" />
                    <span>Pure raw silks, heritage velvets & sheer organza dupattas</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#3D332A] font-serif tracking-wide">
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#C49A5A] shrink-0" />
                    <span>Personalized made-to-measure couture consultation</span>
                  </div>
                </div>

                {/* Call-to-action row */}
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="https://wa.me/919876543210?text=Hello%20Aafreen%20Couture%2C%20I%20would%20like%20to%20inquire%20about%20the%20Royal%20Bridal%20Collection."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#221617] hover:bg-[#3D2628] text-[#F9F5EF] text-[11px] uppercase tracking-[0.2em] font-semibold rounded-xs transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <span>Book Bridal Consultation</span>
                    <span className="text-[#C49A5A]">→</span>
                  </a>
                  <span className="text-xs text-[#8C7A6B] font-sans">
                    {products.length} Heirloom Ensembles Available
                  </span>
                </div>
              </div>

              {/* Right Column: Archival Framed Un-cropped Photograph */}
              <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center">
                <div className="p-2 sm:p-2.5 bg-white/80 border border-[#E8D4BE] rounded-xs shadow-[0_20px_50px_rgba(34,22,23,0.12)] max-w-[480px] w-full">
                  <div className="relative w-full aspect-[2/3] max-h-[640px] rounded-xs overflow-hidden bg-[#1A0E0C]">
                    <Image
                      src={collection.bannerImage || '/images/banners/bridal-hero.webp'}
                      alt="Aafreen Couture Royal Bridal Campaign"
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 480px"
                      className="object-contain sm:object-cover object-center"
                    />
                  </div>
                  <div className="pt-2 pb-0.5 text-center">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#8C7A6B] font-sans">
                      The Grand Palace Showcase · Jaipur Atelier
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <section className="w-full bg-[#FAF5EE] border-b border-[#E8D4BE] overflow-hidden">
          <div className="max-w-[1560px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[420px] lg:min-h-[460px]">
            {/* Left Side: Editorial Text Canvas */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center px-6 sm:px-8 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-9 bg-[#FAF5EE] text-[#221617] z-10">
              <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#E8D4BE]/40 border border-[#C49A5A]/50 text-[9.5px] sm:text-[10px] uppercase tracking-[0.3em] text-[#A67C52] font-semibold w-fit mb-2.5">
                <span>Aafreen Atelier · Curated Collection</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-[38px] xl:text-[42px] font-serif text-[#221617] tracking-tight leading-[1.12] mb-1.5">
                {collection.name}
              </h1>
              <div className="flex items-center gap-2.5 my-2">
                <div className="h-px w-8 bg-gradient-to-r from-[#C49A5A] to-transparent" />
                <span className="text-[#C49A5A] text-xs">✦</span>
                <div className="h-px w-8 bg-gradient-to-l from-[#C49A5A] to-transparent" />
              </div>
              <p className="text-xs sm:text-[13px] text-[#5C554E] font-sans leading-relaxed mb-4 max-w-lg">
                {collection.description || 'Explore our exclusive handcrafted couture archive, individually tailored with heritage embroidery techniques and fine silks.'}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A67C52]">
                  {products.length} Designs in Collection
                </span>
              </div>
            </div>

            {/* Right Side: Full Picture Showcase (ZERO Overlap) */}
            <div className="lg:col-span-6 xl:col-span-7 relative w-full h-[340px] sm:h-[400px] lg:h-auto min-h-[340px] lg:min-h-[460px] overflow-hidden bg-[#1A0E0C] border-t lg:border-t-0 lg:border-l border-[#E8D4BE]/80">
              {collection.bannerImage ? (
                <Image
                  src={collection.bannerImage}
                  alt={collection.name}
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              ) : (
                <Image
                  src="/images/banners/rtw-hero.webp"
                  alt={collection.name}
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {products.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-brand-stone text-base">No products in this collection yet.</p>
          </div>
        ) : (
          <>
            <p className="text-xs font-sans text-brand-stone mb-4 sm:mb-5">{products.length} piece{products.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6">
              {products.map((product) => (
                <ProductCard key={String(product._id)} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
