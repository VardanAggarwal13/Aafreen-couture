import { User } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">System Audit Logs</h1>
          <p className="text-xs text-white/40 mt-0.5">Immutable record of administrative actions, data edits, and security events</p>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Timestamp', 'User', 'Action', 'Details', 'IP Address'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {AUDIT_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-white/50 text-[11px] whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3 font-medium text-white/90 flex items-center gap-1.5 whitespace-nowrap">
                    <User size={13} className="text-brand-gold" /> {log.user}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-[9.5px] font-mono uppercase bg-white/5 text-brand-gold border border-white/10 rounded-xs">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/80 max-w-[320px] truncate">{log.details}</td>
                  <td className="px-4 py-3 font-mono text-white/40 text-[11px]">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
