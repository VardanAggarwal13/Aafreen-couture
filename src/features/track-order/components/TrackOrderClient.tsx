'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

export function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'not-found'>('idle');

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 1000));
    setStatus('not-found');
  }

  return (
    <div className="bg-white border border-brand-cream p-8">
      <form onSubmit={handleTrack} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-brand-black mb-1.5 uppercase tracking-wider">
            Order Number <span className="text-brand-gold">*</span>
          </label>
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="w-full border border-brand-cream bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
            placeholder="e.g. AC-2025-00123"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-brand-black mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-brand-cream bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
            placeholder="you@email.com"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || !orderNumber.trim()}
          className="w-full flex items-center justify-center gap-2 bg-brand-gold text-white text-[11px] font-semibold tracking-[0.22em] uppercase py-3.5 hover:bg-[#b8893f] transition-colors disabled:opacity-60"
        >
          <Search size={14} />
          {status === 'loading' ? 'Tracking…' : 'Track Order'}
        </button>
      </form>

      {status === 'not-found' && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 text-sm text-red-700">
          <strong>Order not found.</strong> Please check the order number and email address, or{' '}
          <Link href="/contact" className="underline">contact support</Link>.
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-brand-cream text-xs text-brand-stone text-center">
        Your order number is in your confirmation email.{' '}
        <Link href="/contact" className="text-brand-gold hover:underline">
          Need help?
        </Link>
      </div>
    </div>
  );
}
