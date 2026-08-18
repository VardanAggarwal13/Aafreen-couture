import type { Metadata } from 'next';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = { title: 'My Returns | Aafreen Couture' };

export default function ReturnsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-brand-black">Returns & Refunds</h1>
        <p className="text-sm text-brand-stone mt-1">Track your return requests and refund status.</p>
      </div>

      {/* Empty state */}
      <div className="bg-white border border-brand-cream p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-brand-pearl flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-gold">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </div>
        <h3 className="text-base font-serif text-brand-black mb-2">No return requests</h3>
        <p className="text-sm text-brand-stone mb-6">
          You haven&apos;t initiated any returns yet.
        </p>
        <Link
          href={ROUTES.ORDERS}
          className="inline-block text-sm font-medium text-brand-gold hover:text-brand-black transition-colors border-b border-brand-gold pb-0.5"
        >
          View Orders
        </Link>
      </div>

      {/* Return policy note */}
      <div className="mt-6 p-4 bg-brand-cream/40 border border-brand-cream text-sm text-brand-stone leading-relaxed">
        <strong className="text-brand-black">Return Policy:</strong> Items can be returned within 7 days of delivery. Custom-made and stitched items are not eligible for returns.{' '}
        <Link href="/shipping-policy" className="text-brand-gold hover:underline">
          Read full policy →
        </Link>
      </div>
    </div>
  );
}
