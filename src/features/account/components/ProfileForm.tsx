'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { User } from '@/lib/auth';

const ProfileSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number').optional().or(z.literal('')),
});
type ProfileInput = z.infer<typeof ProfileSchema>;

interface ProfileFormProps { user: User }

export function ProfileForm({ user }: ProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: { name: user.name ?? '', phone: (user as Record<string, unknown>).phone as string ?? '' },
  });

  async function onSubmit(data: ProfileInput) {
    setSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success('Profile updated');
    } catch {
      toast.error('Could not update profile');
    } finally {
      setSaving(false);
    }
  }

  const fieldCls = 'w-full border border-brand-cream px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors';
  const labelCls = 'block text-sm font-medium text-brand-black mb-1.5';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-brand-cream rounded-sm p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Full Name</label>
          <input {...register('name')} className={fieldCls} placeholder="Your full name" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Email Address</label>
          <input value={user.email} disabled className={`${fieldCls} bg-brand-pearl text-brand-stone cursor-not-allowed`} />
          <p className="text-xs text-brand-stone mt-1">Email cannot be changed</p>
        </div>
        <div>
          <label className={labelCls}>Phone Number <span className="text-brand-stone font-normal">(optional)</span></label>
          <input {...register('phone')} type="tel" className={fieldCls} placeholder="10-digit mobile" />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-gold text-white px-6 py-2.5 text-sm font-medium hover:bg-brand-gold/90 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
