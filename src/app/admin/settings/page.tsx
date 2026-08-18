import { Save, Store, CreditCard, Truck, Bell, Shield } from 'lucide-react';

export const metadata = { title: 'Settings | Admin' };

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-xl font-semibold text-white">Store Settings</h1>
        <p className="text-xs text-white/40 mt-0.5">Configure store profile, currencies, payment gateways, and notifications</p>
      </div>

      {/* General Settings */}
      <div className="bg-[#1A1A1A] border border-white/5 p-6 rounded-sm space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
          <Store size={16} className="text-brand-gold" /> General Atelier Info
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-white/50 mb-1">Store Name</label>
            <input type="text" defaultValue="Aafreen Couture" className="w-full bg-[#111] border border-white/10 rounded-xs px-3 py-2 text-white outline-none focus:border-brand-gold/50" />
          </div>
          <div>
            <label className="block text-white/50 mb-1">Support Email</label>
            <input type="email" defaultValue="concierge@aafreencouture.com" className="w-full bg-[#111] border border-white/10 rounded-xs px-3 py-2 text-white outline-none focus:border-brand-gold/50" />
          </div>
          <div>
            <label className="block text-white/50 mb-1">WhatsApp Concierge</label>
            <input type="text" defaultValue="+91 98765 43210" className="w-full bg-[#111] border border-white/10 rounded-xs px-3 py-2 text-white outline-none focus:border-brand-gold/50" />
          </div>
          <div>
            <label className="block text-white/50 mb-1">Default Currency</label>
            <input type="text" defaultValue="INR (₹)" disabled className="w-full bg-[#111]/50 border border-white/5 rounded-xs px-3 py-2 text-white/40 outline-none cursor-not-allowed" />
          </div>
        </div>
      </div>

      {/* Payment Gateway */}
      <div className="bg-[#1A1A1A] border border-white/5 p-6 rounded-sm space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
          <CreditCard size={16} className="text-brand-gold" /> Payment Gateways
        </h2>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-[#111] rounded-xs border border-white/5">
            <div>
              <p className="font-semibold text-white">Razorpay (Cards, UPI, Netbanking, EMI)</p>
              <p className="text-[11px] text-white/40">Primary payment gateway for INR transactions</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 rounded-full font-medium uppercase">Active</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#111] rounded-xs border border-white/5">
            <div>
              <p className="font-semibold text-white">Cash on Delivery (COD)</p>
              <p className="text-[11px] text-white/40">Available on domestic orders under ₹50,000</p>
            </div>
            <span className="px-2 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 rounded-full font-medium uppercase">Active</span>
          </div>
        </div>
      </div>

      {/* Shipping & Delivery */}
      <div className="bg-[#1A1A1A] border border-white/5 p-6 rounded-sm space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/5 pb-3">
          <Truck size={16} className="text-brand-gold" /> Shipping & Logistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-white/50 mb-1">Free Shipping Threshold</label>
            <input type="text" defaultValue="₹4,999" className="w-full bg-[#111] border border-white/10 rounded-xs px-3 py-2 text-white outline-none focus:border-brand-gold/50" />
          </div>
          <div>
            <label className="block text-white/50 mb-1">Standard Domestic Shipping Fee</label>
            <input type="text" defaultValue="₹149" className="w-full bg-[#111] border border-white/10 rounded-xs px-3 py-2 text-white outline-none focus:border-brand-gold/50" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-brand-gold text-white text-xs font-semibold uppercase tracking-wider px-6 py-3 hover:bg-brand-gold/90 transition-colors rounded-xs">
          <Save size={14} /> Save Changes
        </button>
      </div>
    </div>
  );
}
