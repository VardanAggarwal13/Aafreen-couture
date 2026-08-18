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
    { collectionRef: String(collection._id) },
    { page: 1, limit: 48 }
  );
  const products = (JSON.parse(JSON.stringify(result.data ?? [])) as IProduct[]);

  return (
    <div>
      {/* Banner */}
      <div className="relative h-64 sm:h-80 lg:h-96 bg-brand-black overflow-hidden">
        {collection.bannerImage ? (
          <Image
            src={collection.bannerImage}
            alt={collection.name}
            fill
            className="object-cover opacity-70"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-brand-black via-brand-black/90 to-brand-gold/20" />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white mb-3">{collection.name}</h1>
          {collection.description && (
            <p className="text-sm sm:text-base text-white/80 max-w-lg">{collection.description}</p>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-stone text-base">No products in this collection yet.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-brand-stone mb-6">{products.length} piece{products.length !== 1 ? 's' : ''}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
