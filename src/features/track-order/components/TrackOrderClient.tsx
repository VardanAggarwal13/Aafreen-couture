'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, PackageCheck, Truck, Clock, CheckCircle2, AlertCircle, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site.config';

interface TimelineStep {
  status: string;
  location: string;
  date: string;
  completed: boolean;
  current?: boolean;
}

export function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'not-found'>('idle');

  const [trackingData, setTrackingData] = useState<{
    orderId: string;
    courier: string;
    awb: string;
    estDelivery: string;
    destination: string;
    timeline: TimelineStep[];
  } | null>(null);

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    const query = orderNumber.trim();
    if (!query) return;

    setStatus('loading');
    await new Promise((r) => setTimeout(r, 900));

    // Demo tracker response: accepts any non-empty input or gives structured result
    setTrackingData({
      orderId: query.toUpperCase().startsWith('AC-') ? query.toUpperCase() : `AC-${query.toUpperCase()}`,
      courier: 'Blue Dart Air Express (Insured)',
      awb: 'BD894720194IN',
      estDelivery: 'Within 2–3 Business Days',
      destination: 'Customer Verified Address, India',
      timeline: [
        { status: 'Order Confirmed & Payment Verified', location: 'Aafreen Couture Online', date: 'Day 1', completed: true },
        { status: 'Handcrafted & Quality Inspected', location: 'Atelier Workshop', date: 'Day 2', completed: true },
        { status: 'Dispatched via Insured Air Courier', location: 'Origin Hub', date: 'Day 3', completed: true, current: true },
        { status: 'Out for Doorstep Delivery', location: 'Destination Hub', date: 'Expected Soon', completed: false },
        { status: 'Delivered', location: 'Customer Doorstep', date: 'Pending', completed: false },
      ],
    });
    setStatus('found');
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Tracking Form Card */}
      <div className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs space-y-6">
        <div>
          <h2 className="font-serif text-lg text-[#1A1011] uppercase tracking-wide">
            Enter Shipment Details
          </h2>
          <p className="text-xs text-[#6E6A66] mt-1">
            Track using your order number (e.g., AC-10294) sent in your confirmation receipt.
          </p>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#1A1011] mb-1.5 uppercase tracking-wider">
              Order Number <span className="text-[#C49A5A]">*</span>
            </label>
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full bg-[#FAF7F2]/50 border border-[#E8D8C8] px-4 py-3 text-xs sm:text-sm rounded-xs focus:outline-none focus:border-[#C49A5A] transition-colors"
              placeholder="e.g. AC-10294 or AC-2026-00123"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#1A1011] mb-1.5 uppercase tracking-wider">
              Email Address or Phone (Optional)
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF7F2]/50 border border-[#E8D8C8] px-4 py-3 text-xs sm:text-sm rounded-xs focus:outline-none focus:border-[#C49A5A] transition-colors"
              placeholder="Registered email or phone number"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading' || !orderNumber.trim()}
            className="w-full flex items-center justify-center gap-2 bg-[#221617] text-[#C49A5A] hover:bg-[#C49A5A] hover:text-[#1A1011] text-[11px] font-semibold tracking-[0.22em] uppercase py-3.5 transition-colors rounded-xs disabled:opacity-60"
          >
            <Search size={14} />
            <span>{status === 'loading' ? 'Fetching Live Status…' : 'Track Order'}</span>
          </button>
        </form>
      </div>

      {/* Live Result Timeline */}
      {status === 'found' && trackingData && (
        <div className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-sm shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C8]">
            <div>
              <span className="text-[10.5px] uppercase tracking-[0.3em] font-semibold text-[#A67C52] block">
                Order Status
              </span>
              <h3 className="font-serif text-xl text-[#1A1011] uppercase tracking-wide mt-0.5">
                {trackingData.orderId}
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#FAF7F2] border border-[#C49A5A]/30 px-3.5 py-1.5 rounded-full text-xs text-[#221617]">
              <Truck size={13} className="text-[#C49A5A]" />
              <span className="font-semibold text-[11px]">In Transit</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#FAF7F2] p-3.5 rounded-xs border border-[#E8D8C8]">
              <span className="text-[#7D756C] block mb-0.5">Courier Network &amp; AWB:</span>
              <span className="font-semibold text-[#1A1011]">{trackingData.courier} · {trackingData.awb}</span>
            </div>
            <div className="bg-[#FAF7F2] p-3.5 rounded-xs border border-[#E8D8C8]">
              <span className="text-[#7D756C] block mb-0.5">Estimated Delivery:</span>
              <span className="font-semibold text-[#1A1011]">{trackingData.estDelivery}</span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4 pt-2">
            <p className="font-serif text-xs uppercase tracking-wider text-[#A67C52]">
              Milestone Progress
            </p>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E8D8C8]">
              {trackingData.timeline.map((step, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      step.completed
                        ? 'bg-[#221617] text-[#C49A5A]'
                        : 'bg-[#FAF7F2] border border-[#E8D8C8] text-[#7D756C]'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 size={12} /> : '○'}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold ${step.current ? 'text-[#C49A5A]' : 'text-[#1A1011]'}`}>
                      {step.status}
                    </p>
                    <p className="text-[11px] text-[#7D756C]">
                      {step.location} · {step.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Need Help Box */}
      <div className="bg-[#221617] text-white p-6 rounded-sm border border-[#C49A5A]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans">
        <div>
          <p className="font-serif text-sm uppercase tracking-wide text-[#C49A5A] mb-1">
            Need Live Dispatch Assistance?
          </p>
          <p className="text-white/70 text-[11px]">
            Our dispatch desk is on standby to provide direct courier coordinates.
          </p>
        </div>
        <a
          href={`https://wa.me/${siteConfig.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#C49A5A] text-[#1A1011] hover:bg-white text-[10.5px] font-semibold uppercase tracking-[0.15em] px-5 py-2.5 rounded-xs transition-colors whitespace-nowrap flex items-center gap-1.5 shrink-0"
        >
          <MessageCircle size={13} />
          <span>WhatsApp Logistics</span>
        </a>
      </div>
    </div>
  );
}
