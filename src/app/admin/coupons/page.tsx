import { Plus, Ticket, CheckCircle, Clock } from 'lucide-react';
import { formatPrice } from '@/utils/format';

export const metadata = { title: 'Coupons | Admin' };

const COUPONS = [
  {
    id: 'c-01',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrder: 1500000,
    maxDiscount: 500000,
    usageLimit: 500,
    usedCount: 142,
    validUntil: '2026-12-31',
    status: 'active',
  },
  {
    id: 'c-02',
    code: 'BRIDAL2026',
    type: 'fixed',
    value: 1000000,
    minOrder: 8000000,
    maxDiscount: 1000000,
    usageLimit: 100,
    usedCount: 38,
    validUntil: '2026-11-30',
    status: 'active',
  },
  {
    id: 'c-03',
    code: 'FESTIVEGIFT',
    type: 'percentage',
    value: 15,
    minOrder: 3000000,
    maxDiscount: 750000,
    usageLimit: 200,
    usedCount: 200,
    validUntil: '2026-08-01',
    status: 'expired',
  },
];

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Coupons & Discounts</h1>
          <p className="text-xs text-white/40 mt-0.5">Manage promo codes and customer reward campaigns</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-gold text-white text-xs font-medium px-4 py-2.5 hover:bg-brand-gold/90 transition-colors rounded-xs">
          <Plus size={14} /> Create Coupon
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Code', 'Discount', 'Min Order', 'Usage', 'Valid Until', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {COUPONS.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-brand-gold flex items-center gap-2">
                    <Ticket size={14} /> {coupon.code}
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `${formatPrice(coupon.value)} OFF`}
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {formatPrice(coupon.minOrder)}
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {coupon.validUntil}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase font-medium ${
                      coupon.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {coupon.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-white/40 hover:text-white transition-colors text-[11px]">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
