import { Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';

const BADGES = [
  { icon: Truck, label: 'Worldwide Shipping', sub: 'On all orders' },
  { icon: ShieldCheck, label: 'Secure Payments', sub: '100% safe & secure' },
  { icon: RotateCcw, label: 'Easy Returns', sub: '7 days return policy' },
  { icon: Sparkles, label: 'Premium Quality', sub: 'Finest craftsmanship' },
];

export function TrustBadges() {
  return (
    <section className="border-b border-[#E8D8C8] bg-white py-6 sm:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E8D8C8] gap-y-4 sm:gap-y-0">
          {BADGES.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center justify-center gap-3 py-2 px-4">
              <Icon size={20} className="text-[#A67C52] shrink-0" strokeWidth={1.5} />
              <div>
                <p className="text-xs font-semibold text-[#221617] uppercase tracking-wider leading-tight">{label}</p>
                <p className="text-[10.5px] text-[#6E6A66] leading-tight mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
