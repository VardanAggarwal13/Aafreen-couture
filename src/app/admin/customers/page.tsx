import type { Metadata } from 'next';
import { userRepository } from '@/server/repositories/user.repository';
import { AdminUsersClient } from '@/features/admin/components/AdminUsersClient';

export const metadata: Metadata = { title: 'Users & Admins | Admin Atelier' };

export default async function AdminCustomersPage() {
  const users = await userRepository.findMany({}, { limit: 100 });
  const serialized = JSON.parse(JSON.stringify(users));

  return <AdminUsersClient initialUsers={serialized} />;
}
