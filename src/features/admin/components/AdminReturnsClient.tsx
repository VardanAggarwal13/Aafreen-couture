'use client';

import { useState } from 'react';
import { Check, X, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '@/utils/format';

export interface ReturnRequestItem {
  id: string;
  orderNumber: string;
  customer: string;
  product: string;
  amount: number;
  reason: string;
  status: 'under_review' | 'approved' | 'rejected' | 'refunded';
  date: string;
}

const INITIAL_RETURNS: ReturnRequestItem[] = [
  {
    id: 'ret-101',
    orderNumber: 'AFR-782194',
    customer: 'Meera Patel',
    product: 'Shahzadi Royal Silk Sharara Suit',
    amount: 5499900,
    reason: 'Size exchange requested (Need Size L instead of M)',
    status: 'under_review',
    date: '2026-08-14',
  },
  {
    id: 'ret-102',
    orderNumber: 'AFR-651209',
    customer: 'Tanvi Khanna',
    product: 'Begum Handcrafted Zardozi Potli Bag',
    amount: 1499900,
    reason: 'Ordered two colors, returning one',
    status: 'approved',
    date: '2026-08-11',
  },
];

export function AdminReturnsClient() {
  const [returns, setReturns] = useState<ReturnRequestItem[]>(INITIAL_RETURNS);
  const [selectedReturn, setSelectedReturn] = useState<ReturnRequestItem | null>(null);

  function updateStatus(id: string, status: 'approved' | 'rejected' | 'refunded') {
    setReturns((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    toast.success(`Return request marked as ${status.replace('_', ' ')}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Exchanges & Return Requests</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-sans">Manage client exchange requests, atelier fit alterations, and refund disbursements</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#DDD2C5]">
                {['Request ID', 'Order #', 'Customer', 'Product', 'Refund Value', 'Reason', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-2 text-[10px] font-semibold text-[#8A6A55] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D7]">
              {returns.map((ret) => (
                <tr key={ret.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="px-5 py-2.5 font-mono font-semibold text-[#2E221C]">{ret.id}</td>
                  <td className="px-5 py-2.5 font-mono font-medium text-[#8A6A55]">{ret.orderNumber}</td>
                  <td className="px-5 py-2.5 font-medium text-[#2E221C]">{ret.customer}</td>
                  <td className="px-5 py-2.5 font-sans text-[#2E221C] max-w-[200px] truncate">{ret.product}</td>
                  <td className="px-5 py-2.5 font-semibold text-[#2E221C]">{formatPrice(ret.amount)}</td>
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
                            onClick={() => updateStatus(ret.id, 'approved')}
                            className="p-1 text-blue-700 hover:bg-blue-50 rounded transition-colors"
                            title="Approve Return"
                          >
                            <Check size={15} />
                          </button>
                          <button
                            onClick={() => updateStatus(ret.id, 'rejected')}
                            className="p-1 text-rose-700 hover:bg-rose-50 rounded transition-colors"
                            title="Reject Return"
                          >
                            <X size={15} />
                          </button>
                        </>
                      )}
                      {ret.status === 'approved' && (
                        <button
                          onClick={() => updateStatus(ret.id, 'refunded')}
                          className="px-2 py-1 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-md transition-colors flex items-center gap-1 text-[11px] font-semibold"
                          title="Process Refund"
                        >
                          <RefreshCw size={12} /> Refund
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedReturn(ret)}
                        className="p-1 text-[#8A6A55] hover:text-[#2E221C] rounded transition-colors"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedReturn && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-4 sm:p-7 rounded-2xl shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C5]">
              <h3 className="font-sans font-semibold text-[#2E221C] text-base">Return Dossier {selectedReturn.id}</h3>
              <button onClick={() => setSelectedReturn(null)} className="text-[#8A6A55] hover:text-[#2E221C] p-1 rounded-md">
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
                <span className="font-medium">{selectedReturn.customer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Product:</span>
                <span className="font-serif font-medium">{selectedReturn.product}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Refund Amount:</span>
                <span className="font-semibold">{formatPrice(selectedReturn.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#EAE2D7]">
                <span className="text-[#8A6A55]">Requested On:</span>
                <span>{selectedReturn.date}</span>
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
                className="px-5 py-2 bg-[#2E221C] text-[#F8F5F1] hover:bg-[#1A1410] rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
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
