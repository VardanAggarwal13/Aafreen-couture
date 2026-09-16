import { User, ShieldCheck } from 'lucide-react';
import { auditLogRepository } from '@/server/repositories/audit-log.repository';

export const metadata = { title: 'Audit Logs | Admin' };

export default async function AdminAuditLogsPage() {
  const logs = await auditLogRepository.findRecent(200);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Security & Audit Records</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-sans">Immutable register of administrative updates, role promotions, and security events</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['Timestamp', 'User', 'Action', 'Event Details', 'IP Address'].map((h) => (
                  <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold text-[#8A6A55] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {logs.map((log) => (
                <tr key={String(log._id)} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="px-5 py-2.5 font-mono text-[#8A6A55] text-xs whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </td>
                  <td className="px-5 py-2.5 font-medium text-[#2E221C] whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#DDD2C5] flex items-center justify-center shrink-0">
                        <User size={12} className="text-[#C9A86A]" />
                      </div>
                      <div className="flex flex-col">
                        <span>{log.userName}</span>
                        <span className="text-[10px] text-[#8A6A55] font-normal">{log.userEmail}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <span className="px-2.5 py-1 text-[10px] font-mono font-semibold uppercase bg-[#FAF7F2] text-[#2E221C] border border-[#DDD2C5] rounded-md inline-flex items-center gap-1">
                      <ShieldCheck size={11} className="text-[#C9A86A]" /> {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-[#8A6A55] max-w-[340px] truncate font-medium">{log.details}</td>
                  <td className="px-5 py-2.5 font-mono text-[#8A6A55] text-xs">{log.ip}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#8A6A55]">
                    No administrative actions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
