'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Eye, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/format';
import { extractFieldErrors, FIELD_ERROR_CLASS } from '@/utils/form-errors';

export interface ReturnRequestItem {
  _id: string;
  orderNumber: string;
  customerName: string;
  productName: string;
  quantity: number;
  refundAmount: number;
  reason: string;
  status: 'under_review' | 'approved' | 'rejected' | 'refunded';
  adminNote?: string;
  createdAt: string;
}

const EMPTY_FORM = {
  orderNumber: '',
  productName: '',
  quantity: 1,
  refundAmount: 0,
  reason: '',
};

export function AdminReturnsClient({ returns }: { returns: ReturnRequestItem[] }) {
  const router = useRouter();
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequestItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function updateStatus(id: string, status: 'approved' | 'rejected' | 'refunded') {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/returns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Failed to update return');
      toast.success(`Return request marked as ${status.replace(/_/g, ' ')}`);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to update return');
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this return request permanently?')) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/returns/${id}`, { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? 'Failed to delete return');
      toast.success('Return request deleted');
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete return');
    } finally {
      setBusyId(null);
    }
  }

  async function handleLogReturn(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setSaving(true);
    try {
      const payload = {
        orderNumber: formData.orderNumber.trim(),
        productName: formData.productName.trim(),
        quantity: Number(formData.quantity),
        refundAmount: Math.round(Number(formData.refundAmount) * 100),
        reason: formData.reason.trim(),
      };
      const res = await fetch('/api/admin/returns', {
        method: 'POST',
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
        throw new Error(json.error ?? 'Failed to log return request');
      }
      toast.success('Return request logged');
      setIsModalOpen(false);
      setFormData(EMPTY_FORM);
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to log return request');
    } finally {
      setSaving(false);
    }
  }

  const fieldClass = (field: string) =>
    `w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] rounded-lg transition-colors ${
      fieldErrors[field] ? FIELD_ERROR_CLASS : ''
    }`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Exchanges & Return Requests</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-sans">Manage client exchange requests, atelier fit alterations, and refund disbursements</p>
        </div>
        <button
          onClick={() => { setFormData(EMPTY_FORM); setFieldErrors({}); setIsModalOpen(true); }}
          className="flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] text-xs font-semibold uppercase tracking-wider px-5 py-2 hover:bg-[#1A1410] transition-all rounded-lg shadow-sm cursor-pointer"
        >
          <Plus size={14} className="text-[#C9A86A]" /> Log Return Request
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['Order #', 'Customer', 'Product', 'Refund Value', 'Reason', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold text-[#8A6A55] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {returns.map((ret) => (
                <tr key={ret._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="px-5 py-2.5 font-mono font-medium text-[#8A6A55]">{ret.orderNumber}</td>
                  <td className="px-5 py-2.5 font-medium text-[#2E221C]">{ret.customerName}</td>
                  <td className="px-5 py-2.5 font-sans text-[#2E221C] max-w-[200px] truncate">{ret.productName}</td>
                  <td className="px-5 py-2.5 font-semibold text-[#2E221C]">{formatPrice(ret.refundAmount)}</td>
                  <td className="px-5 py-2.5 text-[#8A6A55] max-w-[220px] truncate">{ret.reason}</td>
                  <td className="px-5 py-2.5">
                    <span className={`px-2.5 py-0.5 text-[10px] rounded-full uppercase tracking-wider font-semibold ${
                      ret.status === 'approved'
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : ret.status === 'refunded'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : ret.status === 'rejected'
                        ? 'bg-rose-50 text-rose-800 border border-rose-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {ret.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2">
                      {ret.status === 'under_review' && (
                        <>
                          <button
                            onClick={() => updateStatus(ret._id, 'approved')}
                            disabled={busyId === ret._id}
                            className="p-1 text-blue-700 hover:bg-blue-50 rounded transition-colors disabled:opacity-40 cursor-pointer"
                            title="Approve Return"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={() => updateStatus(ret._id, 'rejected')}
                            disabled={busyId === ret._id}
                            className="p-1 text-rose-700 hover:bg-rose-50 rounded transition-colors disabled:opacity-40 cursor-pointer"
                            title="Reject Return"
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}
                      {ret.status === 'approved' && (
                        <button
                          onClick={() => updateStatus(ret._id, 'refunded')}
                          disabled={busyId === ret._id}
                          className="px-2 py-1 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-md transition-colors flex items-center gap-1 text-[11px] font-semibold disabled:opacity-40 cursor-pointer"
                          title="Process Refund"
                        >
                          <RefreshCw size={12} /> Refund
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedReturn(ret)}
                        className="p-1 text-[#8A6A55] hover:text-[#2E221C] rounded transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(ret._id)}
                        disabled={busyId === ret._id}
                        className="p-1 text-[#8A6A55] hover:text-red-600 rounded transition-colors disabled:opacity-40 cursor-pointer"
                        title="Delete Return"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {returns.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-[#8A6A55]">
                    No return requests logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Return Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-4 sm:p-7 rounded-2xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C5]">
              <h3 className="font-sans font-semibold text-[#2E221C] text-base">Log Return Request</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8A6A55] hover:text-[#2E221C] p-1 rounded-md cursor-pointer">
                <X size={16} />
              </button>
            </div>
            <p className="text-[11px] text-[#8A6A55]">
              Use this to record a return/exchange a customer requested by phone or email against an existing order.
            </p>

            <form onSubmit={handleLogReturn} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Order Number *</label>
                <input
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  placeholder="e.g. AFR-782194"
                  className={`${fieldClass('orderNumber')} font-mono`}
                />
                {fieldErrors.orderNumber && <p className="text-xs text-red-600 mt-1">{fieldErrors.orderNumber}</p>}
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Product Name *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g. Shahzadi Royal Silk Sharara Suit"
                  className={fieldClass('productName')}
                />
                {fieldErrors.productName && <p className="text-xs text-red-600 mt-1">{fieldErrors.productName}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className={fieldClass('quantity')}
                  />
                  {fieldErrors.quantity && <p className="text-xs text-red-600 mt-1">{fieldErrors.quantity}</p>}
                </div>
                <div>
                  <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Refund Amount (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.refundAmount}
                    onChange={(e) => setFormData({ ...formData, refundAmount: Number(e.target.value) })}
                    className={fieldClass('refundAmount')}
                  />
                  {fieldErrors.refundAmount && <p className="text-xs text-red-600 mt-1">{fieldErrors.refundAmount}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Reason *</label>
                <textarea
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="e.g. Size exchange requested (Need Size L instead of M)"
                  className={fieldClass('reason')}
                />
                {fieldErrors.reason && <p className="text-xs text-red-600 mt-1">{fieldErrors.reason}</p>}
              </div>

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
                  {saving ? 'Logging…' : 'Log Return'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-4 sm:p-7 rounded-2xl shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C5]">
              <h3 className="font-sans font-semibold text-[#2E221C] text-base">Return Dossier</h3>
              <button onClick={() => setSelectedReturn(null)} className="text-[#8A6A55] hover:text-[#2E221C] p-1 rounded-md cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-[#2E221C]">
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Order Number:</span>
                <span className="font-mono font-medium">{selectedReturn.orderNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Customer Name:</span>
                <span className="font-medium">{selectedReturn.customerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Product:</span>
                <span className="font-serif font-medium">{selectedReturn.productName} (x{selectedReturn.quantity})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Refund Amount:</span>
                <span className="font-semibold">{formatPrice(selectedReturn.refundAmount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Requested On:</span>
                <span>{new Date(selectedReturn.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Current Status:</span>
                <span className="capitalize font-semibold text-[#C9A86A]">{selectedReturn.status.replace(/_/g, ' ')}</span>
              </div>
              <div className="pt-1">
                <span className="text-[#8A6A55] block mb-1">Reason Stated by Client:</span>
                <p className="bg-[#FAF7F2] p-3 rounded-lg border border-[#DDD2C5] text-xs text-[#2E221C] italic">
                  &ldquo;{selectedReturn.reason}&rdquo;
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#DDD2C5]">
              <button
                onClick={() => setSelectedReturn(null)}
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
