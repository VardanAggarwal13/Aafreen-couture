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
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-wide">Product Reviews & Testimonials</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-serif">Moderate client feedback, craftsmanship ratings, and testimonial approvals</p>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 text-xs rounded-lg capitalize font-medium transition-all ${
                filter === tab
                  ? 'bg-[#2E221C] text-[#F8F5F1] shadow-sm'
                  : 'bg-white text-[#8A6A55] hover:text-[#2E221C] border border-[#DDD2C5]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#DDD2C5] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['Product', 'Client', 'Rating', 'Review Experience', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-semibold text-[#8A6A55] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {filtered.map((review) => (
                <tr key={review.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="px-5 py-4 font-serif font-medium text-[#2E221C] max-w-[200px] truncate text-sm">
                    {review.product}
                  </td>
                  <td className="px-5 py-4 text-[#2E221C] font-medium">
                    {review.author}
                  </td>
                  <td className="px-5 py-4 text-[#C9A86A] flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </td>
                  <td className="px-5 py-4 text-[#8A6A55] max-w-[300px] truncate italic">
                    &ldquo;{review.comment}&rdquo;
                  </td>
                  <td className="px-5 py-4 text-[#8A6A55]">
                    {review.date}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-0.5 text-[10px] rounded-full uppercase tracking-wider font-semibold ${
                      review.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : review.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {review.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(review.id, 'approved')}
                            className="p-1 text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                            title="Approve Review"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={() => updateStatus(review.id, 'rejected')}
                            className="p-1 text-rose-700 hover:bg-rose-50 rounded transition-colors"
                            title="Reject Review"
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-1 text-[#8A6A55] hover:text-red-600 rounded transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#8A6A55]">
                    No client reviews found in this filter category.
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
