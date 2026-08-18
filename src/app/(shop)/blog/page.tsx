import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blog.data';

export const metadata: Metadata = {
  title: 'The Journal | Aafreen Couture',
  description: 'Editorial guides, bridal styling tips, and heritage craftsmanship stories by Aafreen Couture.',
};

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <div className="bg-white border-b border-[#E8D8C8] py-14 text-center">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.4em] text-[#A67C52] mb-3">
          The Bridal Journal
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#221617] uppercase tracking-wider">
          Stories of Grace & Heritage
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-[#6E6A66] max-w-md mx-auto font-sans">
          Curated styling guides, karigari secrets, and couture inspiration for modern brides.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Featured article */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-[#E8D8C8] rounded-xs overflow-hidden shadow-2xs mb-14 hover:border-[#A67C52] transition-colors"
          >
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-[#FAF7F2]">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-center">
              <span className="text-[10px] text-[#A67C52] font-semibold uppercase tracking-[0.25em] mb-2">
                {featured.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#221617] leading-snug mb-4 group-hover:text-[#A67C52] transition-colors">
                {featured.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6A66] leading-relaxed font-sans mb-6">
                {featured.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-[#6E6A66] pt-4 border-t border-[#E8D8C8]/60">
                <span>By {featured.author}</span>
                <span className="flex items-center gap-1.5"><Clock size={13} /> {featured.readTime}</span>
              </div>
            </div>
          </Link>
        )}

        {/* Other articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white border border-[#E8D8C8] rounded-xs overflow-hidden shadow-2xs hover:border-[#A67C52] transition-colors"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF7F2]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="text-[9.5px] text-[#A67C52] font-semibold uppercase tracking-[0.25em] mb-1.5">
                  {post.category}
                </span>
                <h3 className="font-serif text-lg text-[#221617] leading-snug mb-3 group-hover:text-[#A67C52] transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-[#6E6A66] line-clamp-2 leading-relaxed font-sans mb-5">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between text-[11px] text-[#6E6A66] pt-3 border-t border-[#E8D8C8]/50">
                  <span>{post.publishedAt}</span>
                  <span className="text-[#A67C52] font-semibold uppercase tracking-wider flex items-center gap-1">
                    Read <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
