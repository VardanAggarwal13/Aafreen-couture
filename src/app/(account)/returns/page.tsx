import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = { title: 'My Returns | Aafreen Couture' };

export default async function ReturnsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login?redirect=%2Freturns');

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-serif text-heading">Returns & Exchanges</h1>
        <p className="text-xs sm:text-sm text-text mt-1">Track your couture return requests and refund statuses</p>
      </div>

      {/* Empty state */}
      <div className="bg-surface border border-border p-10 text-center rounded-xs shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
        </div>
        <h3 className="text-base font-serif text-heading mb-1.5">No return requests</h3>
        <p className="text-xs sm:text-sm text-text mb-6">
          You haven&apos;t initiated any returns or exchanges yet.
        </p>
        <Link
          href={ROUTES.ORDERS}
          className="inline-block text-xs font-semibold uppercase tracking-wider text-surface bg-heading hover:bg-gold px-5 py-2.5 rounded-xs transition-colors"
        >
          View My Orders
        </Link>
      </div>

      {/* Return policy note */}
      <div className="p-4 bg-background border border-border text-xs sm:text-sm text-text leading-relaxed rounded-xs">
        <strong className="text-heading font-medium">Couture Policy:</strong> Standard handcrafted items may be returned within 7 days of delivery. Custom-made bespoke bridal lehengas and stitched garments are non-refundable.{' '}
        <Link href="/shipping-policy" className="text-gold hover:underline font-medium">
          Read full policy →
        </Link>
      </div>
    </div>
  );
}
