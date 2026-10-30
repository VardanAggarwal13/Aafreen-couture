import { BadgeCheck, Star } from 'lucide-react';
import { ReviewForm } from '@/features/product/components/ReviewForm';
import type { PublicReview } from '@/server/repositories/review.repository';

interface ProductReviewsProps {
  productId: string;
  productSlug: string;
  productName: string;
  reviews: PublicReview[];
  reviewCount: number;
  averageRating: number;
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= value ? 'text-gold fill-gold' : 'text-border fill-border'} />
      ))}
    </span>
  );
}

/**
 * Server-rendered so approved reviews are in the page HTML (indexable) rather than
 * loaded after hydration. Only the write-a-review form is a client component.
 */
export function ProductReviews({ productId, productSlug, productName, reviews, reviewCount, averageRating }: ProductReviewsProps) {
  const average = averageRating;

  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-28 bg-background border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="reviews-heading" className="font-serif text-2xl sm:text-3xl text-heading">
              Client reviews
            </h2>
            <p className="text-xs text-text mt-1 font-sans">Verified reviews from customers of {productName}</p>
          </div>
          {reviewCount > 0 && (
            <div className="flex items-center gap-2">
              <Stars value={Math.round(average)} size={16} />
              <span className="text-sm text-heading font-semibold">{average.toFixed(1)}</span>
              <span className="text-xs text-text">({reviewCount})</span>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm text-text font-sans">No reviews yet. Be the first to share your experience.</p>
        ) : (
          <ul className="space-y-6">
            {reviews.map((review) => (
              <li key={review.id} className="border-b border-border/70 pb-6 last:border-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Stars value={review.rating} />
                  <h3 className="text-sm font-semibold text-heading font-sans">{review.title}</h3>
                </div>
                <p className="text-sm text-text leading-relaxed mt-2 font-sans whitespace-pre-line">{review.body}</p>
                <div className="flex flex-wrap items-center gap-x-3 mt-3 text-[11px] text-text font-sans">
                  <span className="font-semibold text-heading">{review.authorName}</span>
                  {review.isVerifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <BadgeCheck size={13} /> Verified purchase
                    </span>
                  )}
                  <time dateTime={review.createdAt}>
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                      : ''}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        )}

        <ReviewForm productId={productId} productSlug={productSlug} />
      </div>
    </section>
  );
}
