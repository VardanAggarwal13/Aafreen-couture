import type { Metadata } from 'next';
import { userRepository } from '@/server/repositories/user.repository';
import { AdminUsersClient } from '@/features/admin/components/AdminUsersClient';

export const metadata: Metadata = { title: 'Staff Roles & Permissions | Admin Atelier' };

export default async function AdminRolesPage() {
  const users = await userRepository.findMany({}, { limit: 300 });
  const serialized = JSON.parse(JSON.stringify(users));

  return <AdminUsersClient initialUsers={serialized} />;
}
