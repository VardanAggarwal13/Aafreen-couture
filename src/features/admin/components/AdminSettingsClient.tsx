'use client';

import { useState } from 'react';
import { Save, Store, CreditCard, Truck, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export function AdminSettingsClient() {
  const [activeTab, setActiveTab] = useState<'general' | 'payments' | 'shipping' | 'whatsapp'>('general');
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    storeName: 'Aafreen Couture',
    supportEmail: 'concierge@aafreencouture.com',
    supportPhone: '+91 98765 43210',
    currency: 'INR (₹)',
    taxRate: '12',
    freeShippingThreshold: '25000',
    flatShippingRate: '500',
    razorpayKeyId: 'rzp_live_aafreen_9921',
    razorpayKeySecret: '••••••••••••••••••••',
    enableCOD: true,
    enableRazorpay: true,
    whatsappNumber: '+919876543210',
    whatsappDefaultMessage: 'Hello Aafreen Couture, I would like to inquire about bridal bespoke consultations.',
  });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Simulate save
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success('Store configuration saved successfully');
  }

  const tabs = [
    { id: 'general', label: 'Store Profile', icon: Store },
    { id: 'payments', label: 'Payment Gateways', icon: CreditCard },
    { id: 'shipping', label: 'Logistics & Shipping', icon: Truck },
    { id: 'whatsapp', label: 'WhatsApp Concierge', icon: MessageSquare },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Store Settings</h1>
          <p className="text-xs text-white/40 mt-0.5">Manage brand credentials, checkout gateways, and shipping parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium rounded-xs transition-colors text-left ${
                  activeTab === t.id
                    ? 'bg-brand-gold text-white font-semibold'
                    : 'bg-[#1A1A1A] text-white/60 hover:text-white border border-white/5'
                }`}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="md:col-span-3">
          <form onSubmit={handleSave} className="bg-[#1A1A1A] border border-white/5 p-6 rounded-xs space-y-6">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white pb-3 border-b border-white/5">Store Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Store Name</label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                      className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none focus:border-brand-gold/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Default Currency</label>
                    <input
                      type="text"
                      disabled
                      value={settings.currency}
                      className="w-full bg-[#111] border border-white/5 px-3 py-2 text-white/40 outline-none cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Support Email</label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                      className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none focus:border-brand-gold/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Support Phone</label>
                    <input
                      type="text"
                      value={settings.supportPhone}
                      onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                      className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none focus:border-brand-gold/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white pb-3 border-b border-white/5">Payment Options</h2>
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3 bg-[#111] border border-white/5">
                    <div>
                      <p className="font-semibold text-white">Razorpay Online Gateway (Cards, UPI, Netbanking)</p>
                      <p className="text-white/40 text-[11px]">Accept instant Indian & International payments</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableRazorpay}
                      onChange={(e) => setSettings({ ...settings, enableRazorpay: e.target.checked })}
                      className="accent-brand-gold w-4 h-4"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Razorpay Key ID</label>
                      <input
                        type="text"
                        value={settings.razorpayKeyId}
                        onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                        className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white font-mono text-[11px] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Razorpay Secret</label>
                      <input
                        type="password"
                        value={settings.razorpayKeySecret}
                        onChange={(e) => setSettings({ ...settings, razorpayKeySecret: e.target.value })}
                        className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white font-mono text-[11px] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#111] border border-white/5">
                    <div>
                      <p className="font-semibold text-white">Cash on Delivery (COD)</p>
                      <p className="text-white/40 text-[11px]">Allow COD for orders below ₹50,000</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableCOD}
                      onChange={(e) => setSettings({ ...settings, enableCOD: e.target.checked })}
                      className="accent-brand-gold w-4 h-4"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white pb-3 border-b border-white/5">Shipping Rules</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Free Shipping Threshold (₹)</label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
                      className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Flat Shipping Rate (₹)</label>
                    <input
                      type="number"
                      value={settings.flatShippingRate}
                      onChange={(e) => setSettings({ ...settings, flatShippingRate: e.target.value })}
                      className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'whatsapp' && (
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-white pb-3 border-b border-white/5">WhatsApp Concierge Integration</h2>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">WhatsApp Business Number</label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      placeholder="+919876543210"
                      className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/50 mb-1 font-semibold uppercase tracking-wider text-[10px]">Default Pre-filled Message</label>
                    <textarea
                      rows={3}
                      value={settings.whatsappDefaultMessage}
                      onChange={(e) => setSettings({ ...settings, whatsappDefaultMessage: e.target.value })}
                      className="w-full bg-[#111] border border-white/10 px-3 py-2 text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-brand-gold text-white font-semibold uppercase tracking-wider px-6 py-2.5 hover:bg-brand-gold/90 text-xs rounded-xs transition-colors disabled:opacity-50"
              >
                {saving ? (
                  'Saving...'
                ) : (
                  <>
                    <Save size={14} /> Save Configuration
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
