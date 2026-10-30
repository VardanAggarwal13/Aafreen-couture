'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  productId: string;
  productSlug: string;
}

type Eligibility =
  | { state: 'loading' }
  | { state: 'signed_out' }
  | { state: 'not_purchased' }
  | { state: 'already_reviewed' }
  | { state: 'eligible' }
  | { state: 'submitted' };

export function ReviewForm({ productId, productSlug }: ReviewFormProps) {
  const [eligibility, setEligibility] = useState<Eligibility>({ state: 'loading' });
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/reviews/eligibility?productId=${encodeURIComponent(productId)}`, { credentials: 'same-origin' })
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        const data = json?.data;
        if (!data?.signedIn) setEligibility({ state: 'signed_out' });
        else if (data.eligible) setEligibility({ state: 'eligible' });
        else if (data.reason === 'already_reviewed') setEligibility({ state: 'already_reviewed' });
        else setEligibility({ state: 'not_purchased' });
      })
      .catch(() => {
        if (!cancelled) setEligibility({ state: 'not_purchased' });
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating < 1) {
      toast.error('Please choose a star rating');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ productId, rating, title, body }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json?.error || 'Could not submit your review');
      }
      setEligibility({ state: 'submitted' });
      toast.success('Thank you! Your review will appear once it has been approved.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not submit your review');
    } finally {
      setSubmitting(false);
    }
  }

  if (eligibility.state === 'loading') return null;

  const note = 'text-xs text-text leading-relaxed font-sans';

  if (eligibility.state === 'signed_out') {
    return (
      <p className={note}>
        Bought this piece from us?{' '}
        <Link
          href={`/login?redirect=${encodeURIComponent(`/product/${productSlug}`)}`}
          className="text-gold font-semibold underline underline-offset-2"
        >
          Sign in
        </Link>{' '}
        to share your review.
      </p>
    );
  }
  if (eligibility.state === 'not_purchased') {
    return <p className={note}>Reviews can be written by customers whose order for this piece has been delivered.</p>;
  }
  if (eligibility.state === 'already_reviewed') {
    return <p className={note}>You have already reviewed this piece. Thank you!</p>;
  }
  if (eligibility.state === 'submitted') {
    return <p className={cn(note, 'text-heading font-medium')}>Thank you! Your review will appear once it has been approved.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-surface border border-border rounded-xl p-5 sm:p-6">
      <div>
        <h3 className="font-serif text-xl text-heading">Share your experience</h3>
        <p className={note}>Your order was delivered, so your review will carry a Verified Purchase badge.</p>
      </div>

      <div>
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-heading mb-1.5">Your rating</span>
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} star${n > 1 ? 's' : ''}`}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(n)}
              className="p-0.5 cursor-pointer"
            >
              <Star
                size={24}
                className={n <= (hover || rating) ? 'text-gold fill-gold' : 'text-border fill-border'}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="review-title" className="block text-[11px] font-semibold uppercase tracking-wider text-heading mb-1.5">
          Headline
        </label>
        <input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          minLength={3}
          maxLength={100}
          required
          placeholder="e.g. Beautiful embroidery, perfect fit"
          className="w-full px-3.5 py-2.5 text-sm border border-border bg-background/50 text-heading rounded-lg focus:outline-none focus:border-gold"
        />
      </div>

      <div>
        <label htmlFor="review-body" className="block text-[11px] font-semibold uppercase tracking-wider text-heading mb-1.5">
          Your review
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          minLength={10}
          maxLength={2000}
          required
          rows={5}
          placeholder="Tell other brides about the fabric, fit, craftsmanship and delivery."
          className="w-full px-3.5 py-2.5 text-sm border border-border bg-background/50 text-heading rounded-lg focus:outline-none focus:border-gold resize-y"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-3 bg-heading text-surface text-xs font-semibold uppercase tracking-[0.2em] hover:bg-gold transition-colors rounded-lg disabled:opacity-50 cursor-pointer"
      >
        {submitting ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  );
}
