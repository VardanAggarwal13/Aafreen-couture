'use client';

import { useState } from 'react';
import { Plus, Ticket, Trash2, Edit2, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/format';

export interface CouponItem {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  validUntil: string;
  status: 'active' | 'expired' | 'disabled';
}

const INITIAL_COUPONS: CouponItem[] = [
  {
    id: 'c-01',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrder: 1500000,
    maxDiscount: 500000,
    usageLimit: 500,
    usedCount: 142,
    validUntil: '2026-12-31',
    status: 'active',
  },
  {
    id: 'c-02',
    code: 'BRIDAL2026',
    type: 'fixed',
    value: 1000000,
    minOrder: 8000000,
    maxDiscount: 1000000,
    usageLimit: 100,
    usedCount: 38,
    validUntil: '2026-11-30',
    status: 'active',
  },
  {
    id: 'c-03',
    code: 'FESTIVEGIFT',
    type: 'percentage',
    value: 15,
    minOrder: 3000000,
    maxDiscount: 750000,
    usageLimit: 200,
    usedCount: 200,
    validUntil: '2026-08-01',
    status: 'expired',
  },
];

export function AdminCouponsClient() {
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    minOrder: 5000,
    maxDiscount: 1000,
    usageLimit: 100,
    validUntil: '2026-12-31',
    status: 'active' as 'active' | 'expired' | 'disabled',
  });

  function openCreateModal() {
    setEditingId(null);
    setFormData({
      code: '',
      type: 'percentage',
      value: 10,
      minOrder: 5000,
      maxDiscount: 1000,
      usageLimit: 100,
      validUntil: '2026-12-31',
      status: 'active',
    });
    setIsModalOpen(true);
  }

  function openEditModal(coupon: CouponItem) {
    setEditingId(coupon.id);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder / 100,
      maxDiscount: coupon.maxDiscount / 100,
      usageLimit: coupon.usageLimit,
      validUntil: coupon.validUntil,
      status: coupon.status,
    });
    setIsModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.code) {
      toast.error('Coupon code is required');
      return;
    }

    if (editingId) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                code: formData.code.toUpperCase(),
                type: formData.type,
                value: formData.value,
                minOrder: formData.minOrder * 100,
                maxDiscount: formData.maxDiscount * 100,
                usageLimit: formData.usageLimit,
                validUntil: formData.validUntil,
                status: formData.status,
              }
            : c
        )
      );
      toast.success(`Coupon ${formData.code.toUpperCase()} updated successfully`);
    } else {
      const newCoupon: CouponItem = {
        id: `c-${Date.now().toString().slice(-4)}`,
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: formData.value,
        minOrder: formData.minOrder * 100,
        maxDiscount: formData.maxDiscount * 100,
        usageLimit: formData.usageLimit,
        usedCount: 0,
        validUntil: formData.validUntil,
        status: formData.status,
      };
      setCoupons((prev) => [newCoupon, ...prev]);
      toast.success(`Coupon ${formData.code.toUpperCase()} created successfully`);
    }
    setIsModalOpen(false);
  }

  function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success('Coupon removed');
  }

  function toggleStatus(id: string) {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: c.status === 'active' ? 'disabled' : 'active' } : c
      )
    );
    toast.success('Coupon status updated');
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-wide">Coupons & Loyalty Privileges</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-serif">Manage promotional gift vouchers and client reward campaigns</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-[#1A1410] transition-all rounded-lg shadow-sm"
        >
          <Plus size={14} className="text-[#C9A86A]" /> Create Coupon
        </button>
      </div>

      <div className="bg-white border border-[#DDD2C5] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['Code', 'Discount', 'Min Order', 'Redemptions', 'Valid Until', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-[10px] font-semibold text-[#8A6A55] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="px-5 py-4 font-mono font-semibold text-[#2E221C] text-sm">
                    <span className="inline-flex items-center gap-2">
                      <Ticket size={14} className="text-[#C9A86A]" /> {coupon.code}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-[#2E221C]">
                    {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `${formatPrice(coupon.value * 100)} OFF`}
                  </td>
                  <td className="px-5 py-4 text-[#8A6A55]">
                    {formatPrice(coupon.minOrder)}
                  </td>
                  <td className="px-5 py-4 text-[#8A6A55]">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </td>
                  <td className="px-5 py-4 text-[#8A6A55]">
                    {coupon.validUntil}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggleStatus(coupon.id)}
                      className={`px-2.5 py-0.5 text-[10px] rounded-full uppercase tracking-wider font-semibold transition-colors ${
                        coupon.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : coupon.status === 'expired'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-[#FAF7F2] text-[#8A6A55] border border-[#DDD2C5] hover:bg-[#EAE2D7]'
                      }`}
                    >
                      {coupon.status}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="p-1 rounded text-[#8A6A55] hover:text-[#2E221C] transition-colors"
                        title="Edit Coupon"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-1 rounded text-[#8A6A55] hover:text-red-600 transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#DDD2C5] w-full max-w-md p-6 sm:p-7 rounded-2xl shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD2C5]">
              <h3 className="font-serif font-semibold text-[#2E221C] text-base">
                {editingId ? 'Edit Privilege Coupon' : 'Create New Privilege Coupon'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8A6A55] hover:text-[#2E221C] p-1 rounded-md">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. SUMMER2026"
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] font-mono uppercase outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] rounded-lg transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Min Order (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Valid Until</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'expired' | 'disabled' })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2.5 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#DDD2C5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-[#8A6A55] hover:text-[#2E221C] text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-[#2E221C] text-[#F8F5F1] font-semibold uppercase tracking-wider px-5 py-2.5 hover:bg-[#1A1410] text-xs rounded-lg shadow-sm transition-all"
                >
                  <Check size={13} className="text-[#C9A86A]" /> {editingId ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
