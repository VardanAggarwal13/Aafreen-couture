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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Returns & Exchanges</h1>
          <p className="text-xs text-white/40 mt-0.5">Manage customer return requests, fit alterations, and refunds</p>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {['Request ID', 'Order #', 'Customer', 'Product', 'Refund Value', 'Reason', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {returns.map((ret) => (
                <tr key={ret.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-brand-gold">{ret.id}</td>
                  <td className="px-4 py-3 font-medium text-white/90">{ret.orderNumber}</td>
                  <td className="px-4 py-3 text-white/80">{ret.customer}</td>
                  <td className="px-4 py-3 text-white/70 max-w-[180px] truncate">{ret.product}</td>
                  <td className="px-4 py-3 font-medium text-white">{formatPrice(ret.amount)}</td>
                  <td className="px-4 py-3 text-white/60 max-w-[200px] truncate">{ret.reason}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 text-[10px] rounded-full uppercase font-medium ${
                      ret.status === 'approved'
                        ? 'bg-blue-500/10 text-blue-400'
                        : ret.status === 'refunded'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : ret.status === 'rejected'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {ret.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {ret.status === 'under_review' && (
                        <>
                          <button
                            onClick={() => updateStatus(ret.id, 'approved')}
                            className="p-1 text-blue-400 hover:bg-blue-500/10 rounded-xs transition-colors"
                            title="Approve Return"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => updateStatus(ret.id, 'rejected')}
                            className="p-1 text-red-400 hover:bg-red-500/10 rounded-xs transition-colors"
                            title="Reject Return"
                          >
                            <X size={14} />
                          </button>
                        </>
                      )}
                      {ret.status === 'approved' && (
                        <button
                          onClick={() => updateStatus(ret.id, 'refunded')}
                          className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded-xs transition-colors flex items-center gap-1 text-[11px]"
                          title="Process Refund"
                        >
                          <RefreshCw size={12} /> Refund
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedReturn(ret)}
                        className="p-1 text-white/40 hover:text-white rounded-xs transition-colors"
                        title="View Details"
                      >
                        <Eye size={13} />
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
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] border border-white/10 w-full max-w-md p-6 rounded-xs shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="font-semibold text-white text-sm">Return Request {selectedReturn.id}</h3>
              <button onClick={() => setSelectedReturn(null)} className="text-white/40 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5 text-white/80">
              <p><strong className="text-white/50">Order Number:</strong> {selectedReturn.orderNumber}</p>
              <p><strong className="text-white/50">Customer Name:</strong> {selectedReturn.customer}</p>
              <p><strong className="text-white/50">Item:</strong> {selectedReturn.product}</p>
              <p><strong className="text-white/50">Refund Amount:</strong> {formatPrice(selectedReturn.amount)}</p>
              <p><strong className="text-white/50">Reason Given:</strong> {selectedReturn.reason}</p>
              <p><strong className="text-white/50">Requested On:</strong> {selectedReturn.date}</p>
              <p><strong className="text-white/50">Current Status:</strong> <span className="capitalize text-brand-gold">{selectedReturn.status.replace('_', ' ')}</span></p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button
                onClick={() => setSelectedReturn(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xs"
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
