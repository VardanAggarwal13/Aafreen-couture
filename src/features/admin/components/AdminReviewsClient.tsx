'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Check, X, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

export interface ReviewItem {
  _id: string;
  productName: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  isApproved: boolean;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export function AdminReviewsClient({ reviews }: { reviews: ReviewItem[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [viewing, setViewing] = useState<ReviewItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = reviews.filter((r) => {
    if (filter === 'pending') return !r.isApproved;
    if (filter === 'approved') return r.isApproved;
    return true;
  });

  async function updateApproval(id: string, isApproved: boolean) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Failed to update review');
      toast.success(isApproved ? 'Review approved' : 'Review unapproved');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update review');
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this review permanently?')) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete review');
      toast.success('Review deleted');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete review');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Product Reviews & Testimonials</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-sans">Moderate client feedback, craftsmanship ratings, and testimonial approvals</p>
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'pending', 'approved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 text-xs rounded-lg capitalize font-medium transition-all cursor-pointer ${
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['Product', 'Client', 'Rating', 'Review', 'Date', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold text-[#8A6A55] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {filtered.map((review) => (
                <tr key={review._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="px-5 py-2.5 font-sans font-medium text-[#2E221C] max-w-[200px] truncate text-sm">
                    {review.productName}
                  </td>
                  <td className="px-5 py-2.5 text-[#2E221C] font-medium">
                    {review.authorName}
                    {review.isVerifiedPurchase && (
                      <span className="ml-1.5 text-[9px] text-emerald-700 font-semibold uppercase">Verified</span>
                    )}
                  </td>
                  <td className="px-5 py-2.5 text-[#C9A86A] flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </td>
                  <td className="px-5 py-2.5 text-[#8A6A55] max-w-[300px] truncate italic">
                    &ldquo;{review.title}&rdquo;
                  </td>
                  <td className="px-5 py-2.5 text-[#8A6A55]">
                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="px-5 py-2.5">
                    <span className={`px-2.5 py-0.5 text-[10px] rounded-full uppercase tracking-wider font-semibold ${
                      review.isApproved
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {review.isApproved ? 'approved' : 'pending'}
                    </span>
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewing(review)}
                        className="p-1 text-[#8A6A55] hover:text-[#2E221C] rounded transition-colors cursor-pointer"
                        title="View Review"
                      >
                        <Eye size={14} />
                      </button>
                      {!review.isApproved ? (
                        <button
                          onClick={() => updateApproval(review._id, true)}
                          disabled={busyId === review._id}
                          className="p-1 text-emerald-700 hover:bg-emerald-50 rounded transition-colors disabled:opacity-40 cursor-pointer"
                          title="Approve Review"
                        >
                          <Check size={15} />
                        </button>
                      ) : (
                        <button
                          onClick={() => updateApproval(review._id, false)}
                          disabled={busyId === review._id}
                          className="p-1 text-rose-700 hover:bg-rose-50 rounded transition-colors disabled:opacity-40 cursor-pointer"
                          title="Unapprove Review"
                        >
                          <X size={15} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review._id)}
                        disabled={busyId === review._id}
                        className="p-1 text-[#8A6A55] hover:text-red-600 rounded transition-colors disabled:opacity-40 cursor-pointer"
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

      {viewing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-4 sm:p-7 rounded-2xl shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C5]">
              <h3 className="font-sans font-semibold text-[#2E221C] text-base">{viewing.title}</h3>
              <button onClick={() => setViewing(null)} className="text-[#8A6A55] hover:text-[#2E221C] p-1 rounded-md cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 text-[#2E221C]">
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Product:</span>
                <span className="font-medium">{viewing.productName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Client:</span>
                <span className="font-medium">{viewing.authorName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Rating:</span>
                <span className="flex items-center gap-0.5 text-[#C9A86A]">
                  {Array.from({ length: viewing.rating }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </span>
              </div>
              <div className="pt-1">
                <span className="text-[#8A6A55] block mb-1">Review:</span>
                <p className="bg-[#FAF7F2] p-3 rounded-lg border border-[#DDD2C5] text-xs text-[#2E221C] italic">
                  &ldquo;{viewing.body}&rdquo;
                </p>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-[#DDD2C5]">
              <button
                onClick={() => setViewing(null)}
                className="px-5 py-2 bg-[#2E221C] text-[#F8F5F1] hover:bg-[#1A1410] rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
