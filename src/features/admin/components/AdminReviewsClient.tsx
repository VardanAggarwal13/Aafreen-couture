'use client';

import { useState } from 'react';
import { Star, Check, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export interface ReviewItem {
  id: string;
  product: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  status: 'approved' | 'pending' | 'rejected';
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'r-01',
    product: 'Noor-e-Ishq Bridal Lehenga',
    author: 'Priya Sharma',
    rating: 5,
    comment: 'Absolutely royal craftsmanship! Received so many compliments on my wedding day.',
    date: '2026-08-12',
    status: 'approved',
  },
  {
    id: 'r-02',
    product: 'Mehrunissa Royal Velvet Anarkali',
    author: 'Ananya Gupta',
    rating: 5,
    comment: 'The emerald green velvet is so rich and the embroidery work is pure poetry.',
    date: '2026-08-10',
    status: 'approved',
  },
  {
    id: 'r-03',
    product: 'Sitara Jadau Kundan Polki Choker',
    author: 'Rhea Sen',
    rating: 4,
    comment: 'Exquisite jewelry piece. Packaging was very secure and luxurious.',
    date: '2026-08-08',
    status: 'pending',
  },
];

export function AdminReviewsClient() {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filtered = reviews.filter((r) => (filter === 'all' ? true : r.status === filter));

  function updateStatus(id: string, status: 'approved' | 'rejected') {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    toast.success(`Review ${status}`);
  }

  function handleDelete(id: string) {
    if (!confirm('Delete this review permanently?')) return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success('Review deleted');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Product Reviews & Ratings</h1>
          <p className="text-xs text-white/40 mt-0.5">Moderate customer feedback and rating approvals</p>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs rounded-xs capitalize font-medium transition-colors ${
                filter === tab
                  ? 'bg-brand-gold text-white'
                  : 'bg-[#1A1A1A] text-white/60 hover:text-white border border-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Product', 'Customer', 'Rating', 'Review Text', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((review) => (
                <tr key={review.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white max-w-[180px] truncate">
                    {review.product}
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {review.author}
                  </td>
                  <td className="px-4 py-3 text-brand-gold flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" />
                    ))}
                  </td>
                  <td className="px-4 py-3 text-white/70 max-w-[280px] truncate">
                    &ldquo;{review.comment}&rdquo;
                  </td>
                  <td className="px-4 py-3 text-white/50">
                    {review.date}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase font-medium ${
                      review.status === 'approved'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : review.status === 'pending'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {review.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(review.id, 'approved')}
                            className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded-xs transition-colors"
                            title="Approve"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => updateStatus(review.id, 'rejected')}
                            className="p-1 text-red-400 hover:bg-red-500/10 rounded-xs transition-colors"
                            title="Reject"
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-1 text-white/40 hover:text-red-400 rounded-xs transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-white/30">
                    No reviews in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
