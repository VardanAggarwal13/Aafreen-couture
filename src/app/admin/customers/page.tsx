import type { Metadata } from 'next';
import Link from 'next/link';
import { userRepository } from '@/server/repositories/user.repository';

export const metadata: Metadata = { title: 'Customers | Admin' };

export default async function AdminCustomersPage() {
  const users = await userRepository.findMany({ role: 'customer' }, { limit: 50 });
  const serialized = JSON.parse(JSON.stringify(users));

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-serif text-white">Customers</h1>
          <p className="text-sm text-white/50 mt-0.5">{serialized.length} registered</p>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
              <th className="text-left px-6 py-3.5 font-medium">Name</th>
              <th className="text-left px-6 py-3.5 font-medium">Email</th>
              <th className="text-left px-6 py-3.5 font-medium hidden sm:table-cell">Phone</th>
              <th className="text-left px-6 py-3.5 font-medium hidden lg:table-cell">Joined</th>
              <th className="text-right px-6 py-3.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {serialized.map((user: Record<string, unknown>) => (
              <tr key={user._id as string} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{user.name as string}</td>
                <td className="px-6 py-4 text-white/60">{user.email as string}</td>
                <td className="px-6 py-4 text-white/60 hidden sm:table-cell">{(user.phone as string) || '—'}</td>
                <td className="px-6 py-4 text-white/60 hidden lg:table-cell">
                  {new Date(user.createdAt as string).toLocaleDateString('en-IN')}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/customers/${user._id}`} className="text-xs text-brand-gold hover:underline">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {serialized.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-white/30 text-sm">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
