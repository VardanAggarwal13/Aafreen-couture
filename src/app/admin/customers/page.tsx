import type { Metadata } from 'next';
import { Info } from 'lucide-react';
import { userRepository } from '@/server/repositories/user.repository';
import { AdminUsersClient } from '@/features/admin/components/AdminUsersClient';

export const metadata: Metadata = { title: 'Users & Admins | Admin Atelier' };

/** Accounts loaded into the page (search and paging then happen instantly in the browser). */
const LOADED_USERS = 1000;

export default async function AdminCustomersPage() {
  const [users, totalUsers] = await Promise.all([
    userRepository.findMany({}, { limit: LOADED_USERS }),
    userRepository.count(),
  ]);
  const serialized = JSON.parse(JSON.stringify(users));

  return (
    <div className="space-y-4">
      {totalUsers > users.length && (
        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <Info size="0.9375rem" className="mt-0.5 shrink-0" />
          <p>
            Showing the newest {users.length} of {totalUsers} accounts. Older accounts are not listed here yet; tell the
            developer if you need server-side search for this many users.
          </p>
        </div>
      )}
      <AdminUsersClient initialUsers={serialized} />
    </div>
  );
}
