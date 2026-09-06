import { Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';

const BADGES = [
  { icon: Truck, label: 'Worldwide Shipping', sub: 'On all orders' },
  { icon: ShieldCheck, label: 'Secure Payments', sub: '100% safe & secure' },
  { icon: RotateCcw, label: 'Easy Returns', sub: '7 days return policy' },
  { icon: Sparkles, label: 'Premium Quality', sub: 'Finest craftsmanship' },
];

export function TrustBadges() {
  return (
    <section className="border-b border-[#E8D8C8] bg-white py-4 sm:py-5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-0 lg:divide-x lg:divide-[#E8D8C8]">
          {BADGES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 py-1 px-2 sm:px-4">
              <Icon size={18} className="text-[#A67C52] shrink-0" strokeWidth={1.5} />
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-semibold text-[#221617] uppercase tracking-wider leading-tight truncate">{label}</p>
                <p className="text-[10px] sm:text-[10.5px] text-[#6E6A66] leading-tight mt-0.5 truncate">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
