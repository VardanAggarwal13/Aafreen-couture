'use client';

import { useState, useEffect } from 'react';
import { Plus, MapPin, Trash2, Edit2, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';

export interface AddressItem {
  _id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export function AddressBookClient() {
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Delhi',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    try {
      const res = await fetch('/api/users/addresses');
      const data = await res.json();
      if (data.success) {
        setAddresses(data.data || []);
      }
    } catch {
      toast.error('Failed to load saved addresses');
    } finally {
      setLoading(false);
    }
  }

  function openAddModal() {
    setEditingId(null);
    setFormData({
      name: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: 'Delhi',
      pincode: '',
      isDefault: addresses.length === 0,
    });
    setShowModal(true);
  }

  function openEditModal(addr: AddressItem) {
    setEditingId(addr._id);
    setFormData({
      name: addr.name,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.line1 || !formData.city || !formData.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      toast.error('PIN code must be exactly 6 digits');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/users/addresses/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update address');
        toast.success('Address updated successfully');
      } else {
        const res = await fetch('/api/users/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to save address');
        toast.success('Address added to your address book');
      }
      setShowModal(false);
      loadAddresses();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving address');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to remove this delivery address?')) return;
    try {
      const res = await fetch(`/api/users/addresses/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Address removed');
      loadAddresses();
    } catch {
      toast.error('Failed to delete address');
    }
  }

  async function handleSetDefault(id: string) {
    try {
      const res = await fetch(`/api/users/addresses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDefault: true }),
      });
      if (!res.ok) throw new Error();
      toast.success('Default delivery address updated');
      loadAddresses();
    } catch {
      toast.error('Failed to set default address');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#221617]">Address Book</h1>
          <p className="text-xs text-[#6E6A66] mt-1 font-sans">
            Manage your saved delivery addresses for seamless checkout.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-[#221617] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-[#A67C52] transition-colors rounded-xs shadow-xs"
        >
          <Plus size={15} /> Add New Address
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#6E6A66] font-sans">
          Loading your addresses…
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white border border-[#E8D8C8] p-10 text-center rounded-xs shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#E8D8C8] text-[#A67C52] flex items-center justify-center mx-auto mb-4">
            <MapPin size={22} />
          </div>
          <h3 className="text-base font-serif text-[#221617] mb-2">No Saved Addresses</h3>
          <p className="text-xs text-[#6E6A66] mb-6 max-w-sm mx-auto font-sans">
            Add your primary residence or bridal delivery address to save time during checkout.
          </p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#A67C52] text-white text-xs font-semibold tracking-wider uppercase px-6 py-2.5 hover:bg-[#221617] transition-colors rounded-xs"
          >
            <Plus size={14} /> Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`bg-white border rounded-xs p-5 relative transition-all shadow-xs ${
                addr.isDefault
                  ? 'border-[#A67C52] ring-1 ring-[#A67C52]/20'
                  : 'border-[#E8D8C8] hover:border-[#A67C52]/50'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-sm font-semibold text-[#221617]">
                    {addr.name}
                  </h3>
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#FAF7F2] text-[#A67C52] border border-[#E8D8C8] rounded-xs">
                      <CheckCircle2 size={10} /> Default
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-[#6E6A66]">
                  <button
                    onClick={() => openEditModal(addr)}
                    className="p-1 hover:text-[#221617] transition-colors"
                    title="Edit address"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="p-1 hover:text-red-600 transition-colors"
                    title="Delete address"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="text-xs text-[#6E6A66] space-y-1 font-sans mb-4 leading-relaxed">
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>
                  {addr.city}, {addr.state} — <strong className="text-[#221617]">{addr.pincode}</strong>
                </p>
                <p>{addr.country}</p>
                <p className="pt-1 text-[#221617] font-medium">Phone: {addr.phone}</p>
              </div>

              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr._id)}
                  className="text-[11px] font-semibold text-[#A67C52] hover:text-[#221617] transition-colors border-t border-[#E8D8C8] pt-2 w-full text-left uppercase tracking-wider"
                >
                  Set as Default Address
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Address Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#E8D8C8] rounded-xs w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#E8D8C8] flex items-center justify-between bg-[#FAF7F2]">
              <h2 className="font-serif text-lg text-[#221617]">
                {editingId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-[#6E6A66] hover:text-[#221617] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-1.5">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-3 py-2 border border-[#E8D8C8] rounded-xs focus:outline-none focus:border-[#A67C52] bg-white text-[#221617]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-1.5">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 border border-[#E8D8C8] rounded-xs focus:outline-none focus:border-[#A67C52] bg-white text-[#221617]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-1.5">
                  Street Address / Flat / Building *
                </label>
                <input
                  type="text"
                  required
                  value={formData.line1}
                  onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                  placeholder="House / Flat No., Road, Landmark"
                  className="w-full px-3 py-2 border border-[#E8D8C8] rounded-xs focus:outline-none focus:border-[#A67C52] bg-white text-[#221617]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-1.5">
                  Apartment / Suite / Area (Optional)
                </label>
                <input
                  type="text"
                  value={formData.line2}
                  onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                  placeholder="Colony, Sector, or Landmark"
                  className="w-full px-3 py-2 border border-[#E8D8C8] rounded-xs focus:outline-none focus:border-[#A67C52] bg-white text-[#221617]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-1.5">
                    City / District *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3 py-2 border border-[#E8D8C8] rounded-xs focus:outline-none focus:border-[#A67C52] bg-white text-[#221617]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-1.5">
                    State *
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-2.5 py-2 border border-[#E8D8C8] rounded-xs focus:outline-none focus:border-[#A67C52] bg-white text-[#221617]"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-1.5">
                    PIN Code (6 digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 110001"
                    className="w-full px-3 py-2 border border-[#E8D8C8] rounded-xs focus:outline-none focus:border-[#A67C52] bg-white text-[#221617]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="rounded-xs border-[#E8D8C8] text-[#A67C52] focus:ring-[#A67C52]"
                />
                <label htmlFor="isDefault" className="text-xs text-[#221617] cursor-pointer">
                  Make this my default shipping address
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8D8C8]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[#E8D8C8] text-[#6E6A66] hover:text-[#221617] rounded-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#221617] text-white font-semibold uppercase tracking-wider hover:bg-[#A67C52] rounded-xs transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving…' : editingId ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
