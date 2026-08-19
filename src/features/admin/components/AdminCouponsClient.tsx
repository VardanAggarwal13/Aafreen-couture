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
      toast.success(`Coupon ${formData.code.toUpperCase()} updated`);
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
      toast.success(`Coupon ${formData.code.toUpperCase()} created`);
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Coupons & Discounts</h1>
          <p className="text-xs text-white/40 mt-0.5">Manage promo codes and customer reward campaigns</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-brand-gold text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 hover:bg-brand-gold/90 transition-colors rounded-xs"
        >
          <Plus size={14} /> Create Coupon
        </button>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Code', 'Discount', 'Min Order', 'Usage', 'Valid Until', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono font-semibold text-brand-gold flex items-center gap-2">
                    <Ticket size={14} /> {coupon.code}
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `${formatPrice(coupon.value * 100)} OFF`}
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {formatPrice(coupon.minOrder)}
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {coupon.usedCount} / {coupon.usageLimit}
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {coupon.validUntil}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(coupon.id)}
                      className={`px-2.5 py-0.5 text-[10px] rounded-full uppercase font-medium transition-colors ${
                        coupon.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          : coupon.status === 'expired'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      }`}
                    >
                      {coupon.status}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="text-white/40 hover:text-brand-gold transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="text-white/40 hover:text-red-400 transition-colors"
                        title="Delete"
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
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-white/10 w-full max-w-md p-6 rounded-xs shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="font-semibold text-white text-sm">
                {editingId ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/40 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. SUMMER2026"
                  className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white font-mono uppercase outline-none focus:border-brand-gold/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none focus:border-brand-gold/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Min Order (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none focus:border-brand-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none focus:border-brand-gold/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Valid Until</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none focus:border-brand-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'expired' | 'disabled' })}
                    className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-white/50 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-brand-gold text-white font-semibold uppercase tracking-wider px-5 py-2 hover:bg-brand-gold/90 text-xs rounded-xs"
                >
                  <Check size={13} /> {editingId ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
