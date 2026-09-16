'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Ticket, Trash2, Edit2, Eye, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/format';
import { extractFieldErrors, FIELD_ERROR_CLASS } from '@/utils/form-errors';

export interface CouponItem {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderValue: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  description?: string;
}

interface FormState {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderValue: number;
  maxDiscountAmount: number;
  usageLimit: number | '';
  perUserLimit: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  description: string;
}

const EMPTY_FORM: FormState = {
  code: '',
  type: 'percentage',
  value: 10,
  minOrderValue: 5000,
  maxDiscountAmount: 1000,
  usageLimit: 100,
  perUserLimit: 1,
  validFrom: new Date().toISOString().slice(0, 10),
  validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  isActive: true,
  description: '',
};

function isExpired(coupon: CouponItem): boolean {
  return new Date(coupon.validUntil) < new Date();
}

export function AdminCouponsClient({ coupons }: { coupons: CouponItem[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<CouponItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function openCreateModal() {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFieldErrors({});
    setIsModalOpen(true);
  }

  function openEditModal(coupon: CouponItem) {
    setFieldErrors({});
    setEditingId(coupon._id);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value / (coupon.type === 'fixed' ? 100 : 1),
      minOrderValue: coupon.minOrderValue / 100,
      maxDiscountAmount: coupon.maxDiscountAmount ? coupon.maxDiscountAmount / 100 : 0,
      usageLimit: coupon.usageLimit ?? '',
      perUserLimit: coupon.perUserLimit,
      validFrom: coupon.validFrom.slice(0, 10),
      validUntil: coupon.validUntil.slice(0, 10),
      isActive: coupon.isActive,
      description: coupon.description ?? '',
    });
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.code) {
      toast.error('Coupon code is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code: formData.code.toUpperCase(),
        type: formData.type,
        value: formData.type === 'fixed' ? Math.round(formData.value * 100) : formData.value,
        minOrderValue: Math.round(formData.minOrderValue * 100),
        maxDiscountAmount: formData.maxDiscountAmount ? Math.round(formData.maxDiscountAmount * 100) : undefined,
        usageLimit: formData.usageLimit === '' ? undefined : Number(formData.usageLimit),
        perUserLimit: formData.perUserLimit,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        isActive: formData.isActive,
        description: formData.description || undefined,
      };

      const url = editingId ? `/api/admin/coupons/${editingId}` : '/api/admin/coupons';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const errors = extractFieldErrors(json);
        if (errors.length > 0) {
          setFieldErrors(Object.fromEntries(errors.map((e) => [e.path, e.message])));
          toast.error(`Please fix the highlighted field${errors.length > 1 ? 's' : ''} below`);
          return;
        }
        throw new Error(json.error ?? 'Failed to save coupon');
      }

      toast.success(editingId ? `Coupon ${payload.code} updated` : `Coupon ${payload.code} created`);
      setIsModalOpen(false);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete coupon');
      toast.success('Coupon removed');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete coupon');
    } finally {
      setDeleting(null);
    }
  }

  async function toggleActive(coupon: CouponItem) {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Failed to update coupon status');
      toast.success(`Coupon ${coupon.isActive ? 'disabled' : 'enabled'}`);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update coupon status');
    }
  }

  function discountLabel(c: CouponItem): string {
    if (c.type === 'percentage') return `${c.value}% OFF`;
    if (c.type === 'fixed') return `${formatPrice(c.value)} OFF`;
    return 'FREE SHIPPING';
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Coupons & Loyalty Privileges</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-sans">Manage promotional gift vouchers and client reward campaigns</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-5 py-2 hover:bg-[#1A1410] transition-all rounded-lg shadow-sm cursor-pointer"
        >
          <Plus size={14} className="text-[#C9A86A]" /> Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['Code', 'Discount', 'Min Order', 'Redemptions', 'Valid Until', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold text-[#8A6A55] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {coupons.map((coupon) => {
                const expired = isExpired(coupon);
                return (
                  <tr key={coupon._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="px-5 py-2.5 font-mono font-semibold text-[#2E221C] text-sm">
                      <span className="inline-flex items-center gap-2">
                        <Ticket size={14} className="text-[#C9A86A]" /> {coupon.code}
                      </span>
                    </td>
                    <td className="px-5 py-2.5 font-medium text-[#2E221C]">{discountLabel(coupon)}</td>
                    <td className="px-5 py-2.5 text-[#8A6A55]">{formatPrice(coupon.minOrderValue)}</td>
                    <td className="px-5 py-2.5 text-[#8A6A55]">
                      {coupon.usageCount} / {coupon.usageLimit ?? '∞'}
                    </td>
                    <td className="px-5 py-2.5 text-[#8A6A55]">{new Date(coupon.validUntil).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-2.5">
                      <button
                        onClick={() => toggleActive(coupon)}
                        className={`px-2.5 py-0.5 text-[10px] rounded-full uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                          expired
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : coupon.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-[#FAF7F2] text-[#8A6A55] border border-[#DDD2C5] hover:bg-[#EAE2D7]'
                        }`}
                      >
                        {expired ? 'expired' : coupon.isActive ? 'active' : 'disabled'}
                      </button>
                    </td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setViewing(coupon)}
                          className="p-1 rounded text-[#8A6A55] hover:text-[#2E221C] transition-colors cursor-pointer"
                          title="View Coupon"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          onClick={() => openEditModal(coupon)}
                          className="p-1 rounded text-[#8A6A55] hover:text-[#2E221C] transition-colors cursor-pointer"
                          title="Edit Coupon"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          disabled={deleting === coupon._id}
                          className="p-1 rounded text-[#8A6A55] hover:text-red-600 transition-colors disabled:opacity-40 cursor-pointer"
                          title="Delete Coupon"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#8A6A55]">
                    No coupons created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-4 sm:p-7 rounded-2xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C5]">
              <h3 className="font-sans font-semibold text-[#2E221C] text-base">
                {editingId ? 'Edit Privilege Coupon' : 'Create New Privilege Coupon'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8A6A55] hover:text-[#2E221C] p-1 rounded-md cursor-pointer">
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
                  className={`w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] font-mono uppercase outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] rounded-lg transition-colors ${fieldErrors.code ? FIELD_ERROR_CLASS : ''}`}
                />
                {fieldErrors.code && <p className="text-xs text-red-600 mt-1">{fieldErrors.code}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Discount Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as FormState['type'] })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                {formData.type !== 'free_shipping' && (
                  <div>
                    <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">
                      Discount Value {formData.type === 'percentage' ? '(%)' : '(₹)'}
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                      className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Min Order (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] rounded-lg"
                  />
                </div>
                {formData.type === 'percentage' && (
                  <div>
                    <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Max Discount Cap (₹)</label>
                    <input
                      type="number"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                      className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Usage Limit (blank = unlimited)</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value === '' ? '' : Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Per-Customer Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.perUserLimit}
                    onChange={(e) => setFormData({ ...formData, perUserLimit: Number(e.target.value) })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Valid From</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Valid Until</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Description (internal note)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Diwali campaign for new brides"
                  className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] rounded-lg"
                />
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="accent-[#C9A86A] w-4 h-4"
                />
                <span className="text-[#2E221C] font-medium">Active</span>
              </label>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#DDD2C5]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-[#8A6A55] hover:text-[#2E221C] text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-[#2E221C] text-[#F8F5F1] font-semibold uppercase tracking-wider px-5 py-2 hover:bg-[#1A1410] text-xs rounded-lg shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Check size={13} className="text-[#C9A86A]" /> {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-4 sm:p-7 rounded-2xl shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C5]">
              <h3 className="font-sans font-semibold text-[#2E221C] text-base font-mono">{viewing.code}</h3>
              <button onClick={() => setViewing(null)} className="text-[#8A6A55] hover:text-[#2E221C] p-1 rounded-md cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 text-[#2E221C]">
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Discount:</span>
                <span className="font-semibold">{discountLabel(viewing)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Minimum Order:</span>
                <span className="font-medium">{formatPrice(viewing.minOrderValue)}</span>
              </div>
              {viewing.maxDiscountAmount ? (
                <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                  <span className="text-[#8A6A55]">Max Discount Cap:</span>
                  <span className="font-medium">{formatPrice(viewing.maxDiscountAmount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Redemptions:</span>
                <span className="font-medium">{viewing.usageCount} / {viewing.usageLimit ?? '∞'} (max {viewing.perUserLimit} per customer)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Valid:</span>
                <span className="font-medium">
                  {new Date(viewing.validFrom).toLocaleDateString('en-IN')} – {new Date(viewing.validUntil).toLocaleDateString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Status:</span>
                <span className={`font-semibold ${isExpired(viewing) ? 'text-amber-700' : viewing.isActive ? 'text-emerald-700' : 'text-[#8A6A55]'}`}>
                  {isExpired(viewing) ? 'Expired' : viewing.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>
              {viewing.description && (
                <div className="pt-1">
                  <span className="text-[#8A6A55] block mb-1">Note:</span>
                  <p className="bg-[#FAF7F2] p-3 rounded-lg border border-[#DDD2C5] text-xs text-[#2E221C]">{viewing.description}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end pt-4 border-t border-[#DDD2C5]">
              <button
                onClick={() => setViewing(null)}
                className="px-5 py-2 bg-[#2E221C] text-[#F8F5F1] hover:bg-[#1A1410] rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
