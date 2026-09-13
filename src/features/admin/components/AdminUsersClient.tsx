'use client';

import { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  X,
  Phone,
  Mail,
  Calendar,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';

export interface UserItem {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  emailVerified?: boolean;
  createdAt: string;
}

interface Props {
  initialUsers: UserItem[];
}

export function AdminUsersClient({ initialUsers }: Props) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'customer'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // New admin form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'admin',
  });
  const [submitting, setSubmitting] = useState(false);

  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalCustomers = users.filter((u) => u.role === 'customer').length;

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const s = search.toLowerCase();
      const matchName = u.name?.toLowerCase().includes(s);
      const matchEmail = u.email?.toLowerCase().includes(s);
      const matchPhone = u.phone?.toLowerCase().includes(s);
      if (!matchName && !matchEmail && !matchPhone) return false;
    }
    return true;
  });

  async function handleToggleRole(user: UserItem) {
    const targetRole = user.role === 'admin' ? 'customer' : 'admin';
    const actionLabel = targetRole === 'admin' ? 'promote to Administrator' : 'demote to Customer';

    if (!confirm(`Are you sure you want to ${actionLabel} for "${user.name}" (${user.email})?`)) {
      return;
    }

    setActionLoading(user._id);
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to update user role');

      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, role: targetRole } : u))
      );
      toast.success(`User "${user.name}" is now an ${targetRole === 'admin' ? 'Administrator' : 'Customer'}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update user role');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeleteUser(user: UserItem) {
    if (!confirm(`Permanently delete user "${user.name}" (${user.email})? This action cannot be undone.`)) {
      return;
    }

    setActionLoading(user._id);
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete user');

      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      toast.success(`User "${user.name}" deleted`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in name, email, and password');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to create admin');

      toast.success(json.message ?? 'Administrator successfully added');

      // Refresh list or append user
      if (json.data) {
        setUsers((prev) => {
          const exists = prev.some((u) => u.email.toLowerCase() === json.data.email.toLowerCase());
          if (exists) {
            return prev.map((u) =>
              u.email.toLowerCase() === json.data.email.toLowerCase()
                ? { ...u, role: 'admin' }
                : u
            );
          }
          return [json.data, ...prev];
        });
      }

      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', phone: '', role: 'admin' });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create admin account');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#2E221C] tracking-tight">
            Users &amp; Administrators
          </h1>
          <p className="text-xs text-[#8A6A55] mt-1 font-sans">
            Manage customer accounts, configure admin roles, and grant team access permissions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#C9A86A] hover:bg-[#B58E52] text-white text-xs font-semibold tracking-wider uppercase px-4 py-2.5 transition-colors shadow-xs rounded-xs cursor-pointer"
        >
          <Plus size={15} /> Add New Administrator
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#DDD2C5]/70 p-4 rounded-xs shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8A6A55] uppercase tracking-wider font-semibold">Total Accounts</span>
            <Users size={16} className="text-[#C9A86A]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#2E221C] mt-2">{users.length}</p>
          <p className="text-[11px] text-[#8A6A55]/80 mt-0.5">Registered in atelier database</p>
        </div>

        <div className="bg-white border border-[#C9A86A]/40 p-4 rounded-xs shadow-xs bg-gradient-to-br from-white to-[#FAF7F2]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#9E7B3A] uppercase tracking-wider font-semibold">Administrators</span>
            <ShieldCheck size={16} className="text-[#C9A86A]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#2E221C] mt-2">{totalAdmins}</p>
          <p className="text-[11px] text-[#9E7B3A] mt-0.5 font-medium">Full dashboard &amp; catalog privileges</p>
        </div>

        <div className="bg-white border border-[#DDD2C5]/70 p-4 rounded-xs shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8A6A55] uppercase tracking-wider font-semibold">Customers</span>
            <Users size={16} className="text-[#8A6A55]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#2E221C] mt-2">{totalCustomers}</p>
          <p className="text-[11px] text-[#8A6A55]/80 mt-0.5">Boutique retail clients</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xs border border-[#DDD2C5]/70 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A6A55]" />
          <input
            type="text"
            placeholder="Search by name, email, or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#FAF7F2] border border-[#DDD2C5] rounded-xs pl-8 pr-3 py-2 text-xs text-[#2E221C] placeholder:text-[#8A6A55]/60 outline-none focus:border-[#C9A86A] transition-colors"
          />
        </div>

        {/* Role Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 border border-[#DDD2C5] rounded-xs">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-xs font-medium transition-colors ${
              roleFilter === 'all'
                ? 'bg-white text-[#2E221C] shadow-xs font-semibold'
                : 'text-[#8A6A55] hover:text-[#2E221C]'
            }`}
          >
            All ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 text-xs rounded-xs font-medium transition-colors flex items-center gap-1.5 ${
              roleFilter === 'admin'
                ? 'bg-[#C9A86A] text-white shadow-xs font-semibold'
                : 'text-[#8A6A55] hover:text-[#2E221C]'
            }`}
          >
            <ShieldCheck size={12} /> Admins ({totalAdmins})
          </button>
          <button
            onClick={() => setRoleFilter('customer')}
            className={`px-3 py-1.5 text-xs rounded-xs font-medium transition-colors ${
              roleFilter === 'customer'
                ? 'bg-white text-[#2E221C] shadow-xs font-semibold'
                : 'text-[#8A6A55] hover:text-[#2E221C]'
            }`}
          >
            Customers ({totalCustomers})
          </button>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white border border-[#DDD2C5]/70 rounded-xs shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5] text-[#8A6A55] uppercase tracking-wider text-[10px] font-semibold">
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5 hidden md:table-cell">Joined</th>
                <th className="px-5 py-3.5 text-right">Access Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#8A6A55]/70">
                    No accounts match the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isAdmin = user.role === 'admin';
                  const initials = user.name
                    ? user.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase()
                    : 'U';

                  return (
                    <tr key={user._id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      {/* Name & Avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-serif font-bold text-xs shrink-0 ${
                              isAdmin
                                ? 'bg-[#C9A86A]/20 text-[#9E7B3A] ring-2 ring-[#C9A86A]/30'
                                : 'bg-[#EAE2D7] text-[#2E221C]'
                            }`}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-medium text-[#2E221C] text-sm leading-tight flex items-center gap-1.5">
                              {user.name}
                                <span title="Verified Account">
                                  <CheckCircle2 size={13} className="text-emerald-600" />
                                </span>
                            </p>
                            <p className="text-[11px] text-[#8A6A55] font-mono mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4 text-[#8A6A55]">
                        <div className="space-y-1">
                          <p className="flex items-center gap-1.5 text-xs text-[#2E221C]">
                            <Mail size={12} className="text-[#C9A86A]" /> {user.email}
                          </p>
                          <p className="flex items-center gap-1.5 text-[11px]">
                            <Phone size={12} className="text-[#8A6A55]" /> {user.phone || 'No phone recorded'}
                          </p>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1.5 bg-[#C9A86A]/15 text-[#9E7B3A] border border-[#C9A86A]/40 text-[10.5px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                            <ShieldCheck size={12} /> Administrator
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-[#EAE2D7]/60 text-[#8A6A55] border border-[#DDD2C5] text-[10.5px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full">
                            Customer
                          </span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="px-5 py-4 text-[#8A6A55] text-xs hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-[#8A6A55]" />
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleRole(user)}
                            disabled={actionLoading === user._id}
                            className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-xs border transition-colors cursor-pointer ${
                              isAdmin
                                ? 'border-[#DDD2C5] text-[#8A6A55] hover:border-red-400 hover:text-red-600 bg-white'
                                : 'border-[#C9A86A] bg-[#C9A86A]/10 text-[#9E7B3A] hover:bg-[#C9A86A] hover:text-white'
                            }`}
                          >
                            {isAdmin ? 'Revoke Admin' : 'Promote to Admin'}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user)}
                            disabled={actionLoading === user._id}
                            className="p-1.5 text-[#8A6A55]/60 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete User Account"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Administrator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#DDD2C5] rounded-xs shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#8A6A55] hover:text-[#2E221C] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="mb-5">
              <div className="w-10 h-10 rounded-full bg-[#C9A86A]/15 text-[#9E7B3A] flex items-center justify-center mb-2">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-lg font-serif font-semibold text-[#2E221C]">Add New Administrator</h2>
              <p className="text-xs text-[#8A6A55] mt-0.5">
                Create an admin login with full administrative rights to manage the atelier store.
              </p>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#2E221C] font-semibold uppercase tracking-wider text-[10px] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vardan Aggarwal"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3 py-2 text-[#2E221C] rounded-xs outline-none focus:border-[#C9A86A]"
                />
              </div>

              <div>
                <label className="block text-[#2E221C] font-semibold uppercase tracking-wider text-[10px] mb-1">
                  Admin Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@aafreencouture.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3 py-2 text-[#2E221C] rounded-xs outline-none focus:border-[#C9A86A]"
                />
              </div>

              <div>
                <label className="block text-[#2E221C] font-semibold uppercase tracking-wider text-[10px] mb-1">
                  Password (min 6 characters) *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3 py-2 text-[#2E221C] rounded-xs outline-none focus:border-[#C9A86A]"
                  />
                  <Lock size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A6A55]" />
                </div>
              </div>

              <div>
                <label className="block text-[#2E221C] font-semibold uppercase tracking-wider text-[10px] mb-1">
                  Phone Number (optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3 py-2 text-[#2E221C] rounded-xs outline-none focus:border-[#C9A86A]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-[#8A6A55] hover:text-[#2E221C] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#C9A86A] hover:bg-[#B58E52] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-xs transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {submitting ? 'Creating Administrator…' : 'Create Administrator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
