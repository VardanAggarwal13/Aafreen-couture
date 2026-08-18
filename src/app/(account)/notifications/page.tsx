import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Notifications | Aafreen Couture' };

export default function NotificationsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-brand-black">Notifications</h1>
        <p className="text-sm text-brand-stone mt-1">Updates about your orders and account.</p>
      </div>

      <div className="space-y-3">
        {/* Empty state */}
        <div className="bg-white border border-brand-cream p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-brand-pearl flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-gold">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <h3 className="text-base font-serif text-brand-black mb-2">No notifications yet</h3>
          <p className="text-sm text-brand-stone">
            Order updates and account alerts will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
