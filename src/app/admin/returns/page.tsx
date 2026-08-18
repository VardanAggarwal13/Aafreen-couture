import { formatPrice } from '@/utils/format';

export const metadata = { title: 'Returns | Admin' };

const RETURNS = [
  {
    id: 'ret-101',
    orderNumber: 'AFR-782194',
    customer: 'Meera Patel',
    product: 'Shahzadi Royal Silk Sharara Suit',
    amount: 5499900,
    reason: 'Size exchange requested (Need Size L instead of M)',
    status: 'under_review',
    date: '2026-08-14',
  },
  {
    id: 'ret-102',
    orderNumber: 'AFR-651209',
    customer: 'Tanvi Khanna',
    product: 'Begum Handcrafted Zardozi Potli Bag',
    amount: 1499900,
    reason: 'Ordered two colors, returning one',
    status: 'approved',
    date: '2026-08-11',
  },
];

export default function AdminReturnsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Returns & Exchanges</h1>
          <p className="text-xs text-white/40 mt-0.5">Manage customer return requests, fit alterations, and refunds</p>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Request ID', 'Order #', 'Customer', 'Product', 'Refund Value', 'Reason', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {RETURNS.map((ret) => (
                <tr key={ret.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-brand-gold">{ret.id}</td>
                  <td className="px-4 py-3 font-medium text-white/90">{ret.orderNumber}</td>
                  <td className="px-4 py-3 text-white/80">{ret.customer}</td>
                  <td className="px-4 py-3 text-white/70 max-w-[180px] truncate">{ret.product}</td>
                  <td className="px-4 py-3 font-medium text-white">{formatPrice(ret.amount)}</td>
                  <td className="px-4 py-3 text-white/60 max-w-[200px] truncate">{ret.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full uppercase font-medium ${
                      ret.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {ret.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button className="text-white/50 hover:text-white transition-colors text-[11px]">
                      View Details
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
