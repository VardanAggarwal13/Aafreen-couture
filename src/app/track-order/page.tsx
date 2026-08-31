import type { Metadata } from 'next';
import { TrackOrderClient } from '@/features/track-order/components/TrackOrderClient';

export const metadata: Metadata = {
  title: 'Track Your Order | Aafreen Couture',
  description:
    'Track your luxury couture shipment in real-time. Enter your order number or AWB tracking number to view dispatch status.',
};

export default function TrackOrderPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#221617]">
      {/* Luxury Hero Banner */}
      <div className="bg-[#1A1011] text-[#FAF7F2] py-14 sm:py-20 border-b border-[#C49A5A]/30 relative overflow-hidden text-center">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #C49A5A 0px, #C49A5A 1px, transparent 1px, transparent 14px)',
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#2C1A1C] border border-[#C49A5A]/30 px-3.5 py-1 rounded-full text-[10.5px] text-[#C49A5A] uppercase tracking-[0.3em] font-semibold mb-4">
            <span>✦ Real-Time Shipment Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif uppercase tracking-wider text-white">
            Track Your Order
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-white/75 font-sans max-w-xl mx-auto leading-relaxed">
            Enter your order reference number (e.g., AC-10294) to view live courier transit milestones and estimated delivery date.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <TrackOrderClient />
      </div>
    </main>
  );
}
