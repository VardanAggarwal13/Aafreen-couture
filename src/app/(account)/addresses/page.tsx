import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Addresses | Aafreen Couture' };

export default function AddressesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-serif text-brand-black">Address Book</h1>
        <p className="text-sm text-brand-stone mt-1">Manage your saved delivery addresses.</p>
      </div>

      {/* Empty state — address management requires client-side CRUD */}
      <div className="bg-white border border-brand-cream p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-brand-pearl flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-gold">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
        </div>
        <h3 className="text-base font-serif text-brand-black mb-2">No saved addresses</h3>
        <p className="text-sm text-brand-stone mb-6">
          Add a delivery address to make checkout faster.
        </p>
        <button className="inline-block bg-brand-gold text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-7 py-3 hover:bg-[#b8893f] transition-colors">
          + Add New Address
        </button>
      </div>
    </div>
  );
}
