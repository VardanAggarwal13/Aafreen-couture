import { User, ShieldCheck } from 'lucide-react';

export const metadata = { title: 'Audit Logs | Admin' };

const AUDIT_LOGS = [
  {
    id: 'log-01',
    user: 'Vardan Aggarwal',
    action: 'PRODUCT_UPDATE',
    details: 'Updated inventory for Noor-e-Ishq Bridal Lehenga (Size M +5)',
    ip: '103.21.14.88',
    timestamp: '2026-08-18 20:30:14',
  },
  {
    id: 'log-02',
    user: 'Pearl Kapoor',
    action: 'COUPON_CREATE',
    details: 'Created coupon code BRIDAL2026 (₹10,000 off orders over ₹80,000)',
    ip: '103.21.14.88',
    timestamp: '2026-08-18 19:15:42',
  },
  {
    id: 'log-03',
    user: 'System Admin',
    action: 'ORDER_STATUS_CHANGE',
    details: 'Updated Order #AFR-901248 status to SHIPPED',
    ip: '127.0.0.1',
    timestamp: '2026-08-18 18:02:11',
  },
  {
    id: 'log-04',
    user: 'Sanya Malhotra',
    action: 'BANNER_PUBLISH',
    details: 'Published new homepage spotlight banner for Signature Co-Ord Sets',
    ip: '103.45.22.10',
    timestamp: '2026-08-18 16:40:05',
  },
];

export default function AdminAuditLogsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-wide">Security & Audit Records</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-serif">Immutable register of administrative updates, role promotions, and security events</p>
        </div>
      </div>

      <div className="bg-white border border-[#DDD2C5] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['Timestamp', 'User', 'Action', 'Event Details', 'IP Address'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-semibold text-[#8A6A55] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="px-5 py-4 font-mono text-[#8A6A55] text-xs whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-5 py-4 font-medium text-[#2E221C] flex items-center gap-2 whitespace-nowrap">
                    <div className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#DDD2C5] flex items-center justify-center">
                      <User size={12} className="text-[#C9A86A]" />
                    </div>
                    {log.user}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 text-[10px] font-mono font-semibold uppercase bg-[#FAF7F2] text-[#2E221C] border border-[#DDD2C5] rounded-md inline-flex items-center gap-1">
                      <ShieldCheck size={11} className="text-[#C9A86A]" /> {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[#8A6A55] max-w-[340px] truncate font-medium">{log.details}</td>
                  <td className="px-5 py-4 font-mono text-[#8A6A55] text-xs">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
