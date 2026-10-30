import Link from 'next/link';
import { BadgeCheck, Star } from 'lucide-react';
import { reviewRepository } from '@/server/repositories/review.repository';

const MIN_REVIEWS_TO_SHOW = 3;

/**
 * Homepage social proof built only from real, admin-approved reviews written by
 * verified buyers. Renders nothing until enough genuine reviews exist, so the
 * page never shows invented testimonials.
 */
export async function CustomerReviews() {
  let reviews: Awaited<ReturnType<typeof reviewRepository.findLatestApproved>> = [];
  try {
    reviews = await reviewRepository.findLatestApproved(4, 6);
  } catch {
    return null;
  }
  if (reviews.length < MIN_REVIEWS_TO_SHOW) return null;

  return (
    <section aria-labelledby="home-reviews-heading" className="bg-background py-14 sm:py-20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.3em] text-gold mb-2">Verified Client Reviews</p>
          <h2 id="home-reviews-heading" className="font-serif text-3xl sm:text-4xl text-heading">
            Words from our brides
          </h2>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review) => (
            <li key={review.id} className="bg-surface border border-border rounded-2xl p-6 flex flex-col">
              <span className="inline-flex items-center gap-0.5 mb-3" aria-label={`${review.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} size={14} className={n <= review.rating ? 'text-gold fill-gold' : 'text-border fill-border'} />
                ))}
              </span>
              <h3 className="text-sm font-semibold text-heading font-sans">{review.title}</h3>
              <p className="text-sm text-text leading-relaxed mt-2 font-sans line-clamp-5">{review.body}</p>
              <div className="mt-auto pt-4 text-[11px] text-text font-sans">
                <span className="font-semibold text-heading">{review.authorName}</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 ml-3">
                  <BadgeCheck size={13} /> Verified purchase
                </span>
                <Link
                  href={`/product/${review.productSlug}#reviews`}
                  className="block mt-1 text-gold hover:text-heading transition-colors"
                >
                  {review.productName}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
