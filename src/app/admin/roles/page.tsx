import { Plus, UserCheck } from 'lucide-react';

export const metadata = { title: 'Roles & Permissions | Admin' };

const STAFF_MEMBERS = [
  {
    id: 'usr-01',
    name: 'Pearl Kapoor',
    email: 'pearl@aafreencouture.com',
    role: 'Super Admin',
    permissions: 'Full System Access',
    status: 'active',
  },
  {
    id: 'usr-02',
    name: 'Vardan Aggarwal',
    email: 'admin@aafreen-couture.com',
    role: 'Admin',
    permissions: 'Products, Orders, Customers, Analytics',
    status: 'active',
  },
  {
    id: 'usr-03',
    name: 'Sanya Malhotra',
    email: 'sanya@aafreencouture.com',
    role: 'Catalog Manager',
    permissions: 'Products, Categories, Collections, Inventory',
    status: 'active',
  },
];

export default function AdminRolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Staff Roles & Permissions</h1>
          <p className="text-xs text-white/40 mt-0.5">Control administrative access levels and team roles</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-gold text-white text-xs font-medium px-4 py-2.5 hover:bg-brand-gold/90 transition-colors rounded-xs">
          <Plus size={14} /> Add Staff Member
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Staff Member', 'Email', 'Assigned Role', 'Permissions', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {STAFF_MEMBERS.map((member) => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-semibold text-white flex items-center gap-2">
                    <UserCheck size={14} className="text-brand-gold" /> {member.name}
                  </td>
                  <td className="px-4 py-3 text-white/80">{member.email}</td>
                  <td className="px-4 py-3 text-brand-gold font-medium">{member.role}</td>
                  <td className="px-4 py-3 text-white/60">{member.permissions}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 rounded-full font-medium uppercase">
                      {member.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-white/40 hover:text-white transition-colors text-[11px]">
                      Edit Role
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
