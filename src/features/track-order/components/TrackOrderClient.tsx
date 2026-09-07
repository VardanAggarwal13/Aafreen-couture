'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Truck,
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  MapPin,
  Package,
  AlertCircle,
  HelpCircle,
  Phone,
} from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { toast } from 'sonner';

interface TimelineStep {
  status: string;
  location: string;
  date: string;
  completed: boolean;
  current?: boolean;
}

interface OrderItem {
  name: string;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
  price: number;
}

interface TrackingData {
  orderId: string;
  courier: string;
  awb: string;
  estDelivery: string;
  destination: string;
  dispatchDate: string;
  paymentMethod: string;
  paymentStatus: string;
  total: number;
  timeline: TimelineStep[];
  items: OrderItem[];
  isDemo?: boolean;
}

export function TrackOrderClient() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'not-found'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedAwb, setCopiedAwb] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);

  const fetchTracking = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (res.ok && data.success && data.data) {
        const order = data.data;
        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });

        // Derive milestones based on order.status
        const currentStatus = (order.status || 'pending').toLowerCase();

        const isDelivered = currentStatus === 'delivered';
        const isShipped = isDelivered || currentStatus === 'shipped';
        const isProcessing = isShipped || currentStatus === 'processing';
        const isConfirmed = isProcessing || currentStatus === 'confirmed' || currentStatus === 'pending';

        const destination =
          order.shippingCity && order.shippingState
            ? `${order.shippingCity}, ${order.shippingState}, India`
            : 'Customer Address, India';

        const timeline: TimelineStep[] = [
          {
            status: 'Order Confirmed & Sizing Verified',
            location: 'Aafreen Couture Online Atelier',
            date: `${orderDate} · Confirmed`,
            completed: isConfirmed,
            current: currentStatus === 'pending' || currentStatus === 'confirmed',
          },
          {
            status: 'Handcrafted Karigari & Master Tailoring',
            location: 'Artisan Embroidery Workshop',
            date: isProcessing ? 'Completed · Passed 48-Pt Inspection' : 'In Preparation',
            completed: isProcessing,
            current: currentStatus === 'processing',
          },
          {
            status: 'Packed in Heirloom Box & Dispatched via Air',
            location: 'Central Dispatch Hub (New Delhi)',
            date: isShipped ? 'In Transit with Insured Courier' : 'Scheduled upon finishing',
            completed: isShipped,
            current: currentStatus === 'shipped',
          },
          {
            status: 'Out for Doorstep Handover',
            location: order.shippingCity ? `${order.shippingCity} Delivery Station` : 'Destination Delivery Hub',
            date: isDelivered ? 'Delivered' : 'Expected upon arrival in city',
            completed: isDelivered,
            current: false,
          },
          {
            status: 'Delivered to Customer Doorstep',
            location: destination,
            date: isDelivered ? 'Handed over successfully' : 'Pending final handover',
            completed: isDelivered,
          },
        ];

        setTrackingData({
          orderId: order.orderNumber,
          courier: order.trackingNumber ? 'Blue Dart Express (Air Cargo)' : 'Blue Dart / DHL Express (High-Value Insured)',
          awb: order.trackingNumber || 'BD-PENDING-ASSIGNMENT',
          dispatchDate: orderDate,
          estDelivery: 'Within 5–7 business days',
          destination,
          paymentMethod: order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod?.toUpperCase() || 'Online Prepaid',
          paymentStatus: order.paymentStatus || 'pending',
          total: order.total,
          timeline,
          items: order.items || [],
          isDemo: false,
        });
        setStatus('found');
      } else {
        // Not found in database
        setErrorMessage(data.message || `No order record found for reference ${trimmed}`);
        setStatus('not-found');
      }
    } catch {
      setErrorMessage('Unable to look up order at this moment. Please connect with our concierge.');
      setStatus('not-found');
    }
  }, []);

  // Handle URL query parameters on initial page load
  useEffect(() => {
    const orderParam = searchParams.get('orderNumber') || searchParams.get('orderId');
    if (orderParam) {
      setOrderNumber(orderParam);
      fetchTracking(orderParam);
    }
  }, [searchParams, fetchTracking]);

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    fetchTracking(orderNumber);
  }

  function handleLoadDemo() {
    setOrderNumber('AC-SAMPLE-2026');
    setTrackingData({
      orderId: 'AC-SAMPLE-2026',
      courier: 'Blue Dart Air Express (High-Value Insured)',
      awb: 'BD894720194IN',
      dispatchDate: 'September 04, 2026',
      estDelivery: 'September 09 – September 11, 2026',
      destination: 'Customer Verified Address, India',
      paymentMethod: 'Cash on Delivery (COD)',
      paymentStatus: 'pending',
      total: 85000,
      timeline: [
        {
          status: 'Order Confirmed & Measurements Verified',
          location: 'Aafreen Couture Online Atelier',
          date: 'Day 1 · Completed',
          completed: true,
        },
        {
          status: 'Handcrafted Karigari & Double Quality Check',
          location: 'Master Artisan Workshop',
          date: 'Day 2–3 · Passed 48-Point QC',
          completed: true,
        },
        {
          status: 'Packed in Heirloom Box & Dispatched via Air',
          location: 'Central Dispatch Hub (New Delhi)',
          date: 'Day 4 · In Transit',
          completed: true,
          current: true,
        },
        {
          status: 'Out for Secured White-Glove Handover',
          location: 'Local Delivery Station',
          date: 'Expected Next Business Day',
          completed: false,
        },
        {
          status: 'Delivered to Customer Doorstep',
          location: 'Delivery Address',
          date: 'Pending Handover',
          completed: false,
        },
      ],
      items: [
        {
          name: 'Handcrafted Crimson Zardozi Bridal Lehenga',
          quantity: 1,
          size: 'Bespoke Made-to-Measure',
          price: 85000,
        },
      ],
      isDemo: true,
    });
    setStatus('found');
  }

  const handleCopyAwb = () => {
    if (!trackingData?.awb) return;
    navigator.clipboard.writeText(trackingData.awb);
    setCopiedAwb(true);
    toast.success('AWB copied to clipboard');
    setTimeout(() => setCopiedAwb(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Tracking Form Card */}
      <div className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-[0_4px_16px_rgba(34,22,23,0.03)] space-y-6">
        <div className="border-b border-[#E8D8C8] pb-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#A67C52] block mb-1">
            Order Lookup
          </span>
          <h2 className="font-serif text-xl sm:text-2xl text-[#221617] uppercase tracking-wide">
            Enter Shipment Details
          </h2>
          <p className="text-xs sm:text-[13px] text-[#5C554E] mt-1.5 leading-relaxed">
            Enter your order reference code (e.g., <code className="bg-[#FAF7F2] px-1.5 py-0.5 rounded text-[#221617] font-mono font-semibold">AC-10294</code>) from your order confirmation or WhatsApp receipt.
          </p>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#221617] mb-1.5 uppercase tracking-wider">
              Order Number <span className="text-[#C49A5A]">*</span>
            </label>
            <div className="relative">
              <input
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="w-full bg-[#FAF7F2]/50 border border-[#E8D8C8] pl-4 pr-10 py-3 text-xs sm:text-sm rounded-xs text-[#221617] placeholder:text-[#8C7E72]/60 focus:outline-none focus:border-[#C49A5A] focus:bg-white transition-all shadow-2xs"
                placeholder="e.g. AC-10294"
                required
              />
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A67C52] opacity-70 pointer-events-none" size={16} />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#221617] mb-1.5 uppercase tracking-wider">
              Registered Phone or Email <span className="text-[#8C7E72] font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#FAF7F2]/50 border border-[#E8D8C8] px-4 py-3 text-xs sm:text-sm rounded-xs text-[#221617] placeholder:text-[#8C7E72]/60 focus:outline-none focus:border-[#C49A5A] focus:bg-white transition-all shadow-2xs"
              placeholder="+91 95179 01117 or support@aafreencouture.com"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="submit"
              disabled={status === 'loading' || !orderNumber.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-[#221617] text-[#C49A5A] hover:bg-[#3D2628] hover:text-[#FAF7F2] text-[11px] font-semibold tracking-[0.22em] uppercase py-3.5 sm:py-4 transition-all duration-200 rounded-xs shadow-md disabled:opacity-60 select-none cursor-pointer"
            >
              <Search size={14} />
              <span>{status === 'loading' ? 'Locating Couture Shipment…' : 'Track Shipment Status'}</span>
            </button>

            <button
              type="button"
              onClick={handleLoadDemo}
              className="px-4 py-3.5 border border-[#E8D8C8] bg-[#FAF7F2] hover:bg-[#F3ECE0] text-[#5C554E] hover:text-[#221617] text-[10.5px] uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
            >
              View Sample Timeline
            </button>
          </div>
        </form>
      </div>

      {/* Not Found State */}
      {status === 'not-found' && (
        <div className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-[0_4px_20px_rgba(34,22,23,0.05)] space-y-5 animate-fadeIn">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <AlertCircle size={20} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A67C52] block">
                Atelier Lookup Status
              </span>
              <h3 className="font-serif text-lg text-[#221617] uppercase tracking-wide">
                No Record Found for #{orderNumber}
              </h3>
              <p className="text-xs text-[#6E6A66] leading-relaxed">
                {errorMessage ||
                  'We could not locate this order reference in our active tracking database. If you placed your order recently via WhatsApp or in-boutique, it may take 12–24 hours to appear in the online tracker.'}
              </p>
            </div>
          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-xs border border-[#E8D8C8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-semibold text-[#221617]">Need assistance locating your booking?</p>
              <p className="text-[#6E6A66] text-[11px] mt-0.5">
                Our concierge team can immediately verify your order from payment or phone records.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                  `Hello Aafreen Couture, I am looking for the tracking status of my order #${orderNumber}. Could you please check?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#221617] text-[#C49A5A] hover:bg-[#3D2628] rounded-xs text-[10.5px] uppercase font-semibold tracking-wider transition-colors"
              >
                <MessageCircle size={13} />
                <span>WhatsApp Concierge</span>
              </a>
              <a
                href={`tel:${siteConfig.phone}`}
                className="p-2 border border-[#E8D8C8] bg-white hover:bg-[#FAF7F2] rounded-xs text-[#221617] transition-colors"
                title="Call Support"
              >
                <Phone size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Live Result Stepper Card */}
      {status === 'found' && trackingData && (
        <div className="bg-white border border-[#E8D8C8] p-6 sm:p-8 rounded-xs shadow-[0_4px_20px_rgba(34,22,23,0.05)] space-y-6 animate-fadeIn">
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E8D8C8]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10.5px] uppercase tracking-[0.25em] font-semibold text-[#A67C52]">
                  {trackingData.isDemo ? 'Demo Shipment Simulation' : 'Live Shipment Track'}
                </span>
                {trackingData.isDemo && (
                  <span className="bg-amber-100 text-amber-800 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded tracking-wider">
                    Demo Sample
                  </span>
                )}
              </div>
              <h3 className="font-serif text-2xl text-[#221617] uppercase tracking-wide">
                {trackingData.orderId}
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#FAF7F2] border border-[#C49A5A]/40 px-4 py-1.5 rounded-full text-xs text-[#221617] self-start sm:self-auto shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <Truck size={14} className="text-[#C49A5A]" />
              <span className="font-semibold text-[11px] uppercase tracking-wider">
                {trackingData.paymentMethod}
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="bg-[#FAF7F2] p-4 rounded-xs border border-[#E8D8C8] flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-[#7D756C] uppercase tracking-wider font-semibold block mb-1">
                  Airway Bill (AWB) &amp; Carrier:
                </span>
                <p className="font-semibold text-[#221617] text-sm">
                  {trackingData.courier}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#E8D8C8]/60">
                <span className="font-mono text-[#A67C52] font-semibold">{trackingData.awb}</span>
                {trackingData.awb && !trackingData.awb.includes('PENDING') && (
                  <button
                    onClick={handleCopyAwb}
                    className="inline-flex items-center gap-1 text-[10.5px] text-[#5C554E] hover:text-[#221617] transition-colors cursor-pointer"
                  >
                    {copiedAwb ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                    <span>{copiedAwb ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-xs border border-[#E8D8C8] flex flex-col justify-between">
              <div>
                <span className="text-[11px] text-[#7D756C] uppercase tracking-wider font-semibold block mb-1">
                  Destination &amp; Delivery Window:
                </span>
                <p className="font-semibold text-[#221617] text-sm">
                  {trackingData.destination}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#5C554E] pt-2 border-t border-[#E8D8C8]/60">
                <Clock size={12} className="text-[#A67C52]" />
                <span>{trackingData.estDelivery}</span>
              </div>
            </div>
          </div>

          {/* Ordered Ensembles Preview if available */}
          {trackingData.items && trackingData.items.length > 0 && (
            <div className="bg-[#FAF7F2] border border-[#E8D8C8] p-4 rounded-xs space-y-3">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#A67C52] block">
                Ensemble Details ({trackingData.items.length} {trackingData.items.length === 1 ? 'Piece' : 'Pieces'})
              </span>
              <div className="divide-y divide-[#E8D8C8]/60">
                {trackingData.items.map((item, idx) => (
                  <div key={idx} className="pt-2.5 pb-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <div className="w-12 h-14 relative rounded-xs overflow-hidden border border-[#E8D8C8] shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-14 bg-white border border-[#E8D8C8] flex items-center justify-center text-[#A67C52] shrink-0">
                          <Package size={16} />
                        </div>
                      )}
                      <div>
                        <p className="font-serif text-[#221617] font-semibold text-xs leading-snug line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#7D756C] mt-0.5">
                          Qty: {item.quantity} {item.size ? `· Size: ${item.size}` : ''} {item.color ? `· ${item.color}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[#221617] font-mono text-xs">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Milestone Stepper */}
          <div className="space-y-4 pt-2">
            <h4 className="font-serif text-xs uppercase tracking-[0.2em] text-[#A67C52] flex items-center gap-2">
              <span>✦</span>
              <span>Milestone Progression</span>
            </h4>

            <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E8D8C8]">
              {trackingData.timeline.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Circle indicator */}
                  <div
                    className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                      step.current
                        ? 'bg-[#221617] text-[#C49A5A] ring-4 ring-[#C49A5A]/20 shadow-xs'
                        : step.completed
                        ? 'bg-[#221617] text-[#C49A5A]'
                        : 'bg-[#FAF7F2] border border-[#E8D8C8] text-[#8C7E72]'
                    }`}
                  >
                    {step.completed ? <CheckCircle2 size={13} /> : '○'}
                  </div>

                  {/* Text details */}
                  <div className="pl-1">
                    <p
                      className={`text-xs sm:text-[13px] font-semibold ${
                        step.current ? 'text-[#A67C52]' : step.completed ? 'text-[#221617]' : 'text-[#7D756C]'
                      }`}
                    >
                      {step.status}
                    </p>
                    <p className="text-[11px] text-[#7D756C] mt-0.5 flex items-center gap-1.5 font-sans">
                      <MapPin size={11} className="text-[#A67C52] shrink-0" />
                      <span>{step.location}</span>
                      <span>·</span>
                      <span>{step.date}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alteration Notice & Direct Concierge */}
          <div className="bg-[#FAF7F2] border border-[#E8D8C8] p-4 rounded-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#221617]">
              <ShieldCheck size={16} className="text-[#A67C52] shrink-0" />
              <span>Complimentary fit alterations available within 10 days of delivery.</span>
            </div>
            <a
              href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                `Hi Aafreen Couture, I would like an update on my order #${trackingData.orderId}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A67C52] hover:text-[#221617] font-semibold text-[11px] uppercase tracking-wider underline whitespace-nowrap"
            >
              Ask Logistics Desk →
            </a>
          </div>
        </div>
      )}

      {/* Immediate Assistance Banner */}
      <div className="bg-[#221617] text-white p-6 rounded-xs border border-[#C49A5A]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div>
          <p className="font-serif text-sm uppercase tracking-wider text-[#C49A5A] mb-1">
            Need Immediate Dispatch Coordination?
          </p>
          <p className="text-white/70 text-[11px] leading-relaxed">
            Our priority logistics desk is on call Monday – Saturday (10:30 AM – 7:30 PM IST) at {siteConfig.phone} for live updates.
          </p>
        </div>
        <a
          href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
            'Hello Aafreen Couture, I need assistance with an order delivery.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#C49A5A] text-[#1A1011] hover:bg-[#FAF7F2] text-[10.5px] font-semibold uppercase tracking-[0.16em] px-5 py-2.5 rounded-xs transition-all shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <MessageCircle size={13} />
          <span>WhatsApp Concierge</span>
        </a>
      </div>
    </div>
  );
}
