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
    supportPhone: '+91 95179 01117',
    currency: 'INR (₹)',
    taxRate: '12',
    freeShippingThreshold: '0',
    flatShippingRate: '0',
    razorpayKeyId: 'rzp_live_aafreen_9921',
    razorpayKeySecret: '••••••••••••••••••••',
    enableCOD: true,
    enableRazorpay: true,
    whatsappNumber: '+91 95179 01117',
    whatsappDefaultMessage: 'Hello Aafreen Couture, I would like to inquire about bridal bespoke consultations.',
  });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[#2E221C] tracking-tight">Store Configurations & Gateways</h1>
          <p className="text-sm text-[#8A6A55] mt-1 font-sans">Manage atelier credentials, checkout payment gateways, and logistics parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Navigation Tabs */}
        <div className="space-y-1.5">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all text-left ${
                  activeTab === t.id
                    ? 'bg-[#2E221C] text-[#F8F5F1] shadow-sm'
                    : 'bg-white text-[#8A6A55] hover:text-[#2E221C] border border-[#DDD2C5]'
                }`}
              >
                <Icon size={16} className={activeTab === t.id ? 'text-[#C9A86A]' : 'text-[#8A6A55]'} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="md:col-span-3">
          <form onSubmit={handleSave} className="bg-white p-4 sm:p-4 rounded-xl shadow-sm space-y-4">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <h2 className="text-base font-sans font-semibold text-[#2E221C] pb-2 border-b border-[#DDD2C5]">Store Identity</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Store Brand Name</label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Base Currency</label>
                    <input
                      type="text"
                      disabled
                      value={settings.currency}
                      className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#8A6A55]/60 rounded-lg outline-none cursor-not-allowed font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Support & Concierge Email</label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Atelier Support Phone</label>
                    <input
                      type="text"
                      value={settings.supportPhone}
                      onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A] focus:ring-1 focus:ring-[#C9A86A] transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-4">
                <h2 className="text-base font-sans font-semibold text-[#2E221C] pb-2 border-b border-[#DDD2C5]">Payment Gateways</h2>
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-4 bg-[#FAF7F2] border border-[#DDD2C5] rounded-xl">
                    <div>
                      <p className="font-semibold text-[#2E221C] text-sm">Razorpay Online Gateway (Cards, UPI, Netbanking)</p>
                      <p className="text-[#8A6A55] text-xs mt-0.5">Accept instant domestic & international card payments</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableRazorpay}
                      onChange={(e) => setSettings({ ...settings, enableRazorpay: e.target.checked })}
                      className="accent-[#C9A86A] w-4 h-4 rounded border-[#DDD2C5]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Razorpay Key ID</label>
                      <input
                        type="text"
                        value={settings.razorpayKeyId}
                        onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] font-mono text-xs rounded-lg outline-none focus:border-[#C9A86A]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Razorpay Secret</label>
                      <input
                        type="password"
                        value={settings.razorpayKeySecret}
                        onChange={(e) => setSettings({ ...settings, razorpayKeySecret: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] font-mono text-xs rounded-lg outline-none focus:border-[#C9A86A]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-[#FAF7F2] border border-[#DDD2C5] rounded-xl">
                    <div>
                      <p className="font-semibold text-[#2E221C] text-sm">Cash on Delivery (COD)</p>
                      <p className="text-[#8A6A55] text-xs mt-0.5">Allow doorstep handover payment for domestic orders</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.enableCOD}
                      onChange={(e) => setSettings({ ...settings, enableCOD: e.target.checked })}
                      className="accent-[#C9A86A] w-4 h-4 rounded border-[#DDD2C5]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <h2 className="text-base font-sans font-semibold text-[#2E221C] pb-2 border-b border-[#DDD2C5]">Logistics & Shipping Rules</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Free Shipping Threshold (₹)</label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Flat Standard Shipping Fee (₹)</label>
                    <input
                      type="number"
                      value={settings.flatShippingRate}
                      onChange={(e) => setSettings({ ...settings, flatShippingRate: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'whatsapp' && (
              <div className="space-y-4">
                <h2 className="text-base font-sans font-semibold text-[#2E221C] pb-2 border-b border-[#DDD2C5]">WhatsApp Concierge Integration</h2>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">WhatsApp Official Line Number</label>
                    <input
                      type="text"
                      value={settings.whatsappNumber}
                      onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                      placeholder="+91 95179 01117"
                      className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8A6A55] mb-1.5 font-semibold uppercase tracking-wider text-[10px]">Default Concierge Greeting Message</label>
                    <textarea
                      rows={3}
                      value={settings.whatsappDefaultMessage}
                      onChange={(e) => setSettings({ ...settings, whatsappDefaultMessage: e.target.value })}
                      className="w-full bg-[#FAF7F2] border border-[#DDD2C5] px-3.5 py-2 text-[#2E221C] rounded-lg outline-none focus:border-[#C9A86A]"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-[#DDD2C5]">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-[#2E221C] text-[#F8F5F1] font-semibold uppercase tracking-wider px-6 py-2 hover:bg-[#1A1410] text-xs rounded-lg transition-all shadow-sm disabled:opacity-50"
              >
                {saving ? (
                  'Saving Configuration…'
                ) : (
                  <>
                    <Save size={14} className="text-[#C9A86A]" /> Save Store Configuration
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
