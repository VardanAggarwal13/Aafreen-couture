import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blog.data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: 'Article Not Found | Aafreen Couture' };

  return {
    title: `${post.title} | Aafreen Couture Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <main className="min-h-screen bg-white">
      {/* Article Header */}
      <div className="bg-[#FAF7F2] border-b border-[#E8D8C8] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A67C52] hover:text-[#221617] transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Back to Journal
          </Link>

          <span className="block text-[10.5px] text-[#A67C52] font-semibold uppercase tracking-[0.3em] mb-2">
            {post.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#221617] leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-[#6E6A66] pt-4 border-t border-[#E8D8C8]/60 font-sans">
            <span className="flex items-center gap-1.5"><User size={14} className="text-[#A67C52]" /> {post.author} ({post.authorRole})</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-[#A67C52]" /> {post.publishedAt}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#A67C52]" /> {post.readTime}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="relative aspect-[16/9] overflow-hidden rounded-xs border border-[#E8D8C8] mb-12 shadow-2xs">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        <div className="max-w-2xl mx-auto space-y-6 text-sm sm:text-base text-[#221617]/85 font-sans leading-relaxed">
          <p className="text-lg font-serif text-[#221617] italic leading-relaxed border-l-2 border-[#A67C52] pl-4">
            {post.excerpt}
          </p>

          {post.content.map((paragraph, i) => (
            <p key={i} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="max-w-2xl mx-auto mt-14 p-8 bg-[#FAF7F2] border border-[#E8D8C8] text-center rounded-xs">
          <h3 className="font-serif text-xl text-[#221617] mb-2 uppercase tracking-wide">
            Book a Personal Bridal Consultation
          </h3>
          <p className="text-xs text-[#6E6A66] mb-5 font-sans">
            Experience our bespoke haute couture collection with personalized styling advice from Pearl Kapoor.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#221617] text-white text-[10.5px] font-semibold tracking-[0.25em] uppercase px-8 py-3 hover:bg-[#A67C52] transition-colors rounded-xs"
          >
            Schedule Atelier Visit
          </Link>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#E8D8C8]">
            <h3 className="font-serif text-xl text-[#221617] mb-8 uppercase tracking-wider text-center">
              More From The Journal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="group flex gap-4 p-4 bg-[#FAF7F2] border border-[#E8D8C8] rounded-xs hover:border-[#A67C52] transition-colors"
                >
                  <div className="relative w-24 h-24 shrink-0 rounded-xs overflow-hidden">
                    <Image src={r.image} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[9px] text-[#A67C52] font-semibold uppercase tracking-wider">{r.category}</span>
                    <h4 className="font-serif text-sm text-[#221617] group-hover:text-[#A67C52] transition-colors line-clamp-2 mt-1">{r.title}</h4>
                    <span className="text-[10.5px] text-[#6E6A66] mt-2">{r.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
