'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import type { User } from '@/lib/auth';

const ProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number').optional().or(z.literal('')),
});
type ProfileInput = z.infer<typeof ProfileSchema>;

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [saving, setSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileInput>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name ?? '',
      phone: ((user as Record<string, unknown>).phone as string) ?? '',
    },
  });

  // Load latest profile details from API
  useEffect(() => {
    fetch('/api/users/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          reset({
            name: data.data.name || user.name || '',
            phone: data.data.phone || '',
          });
        }
      })
      .catch(() => {});
  }, [reset, user.name]);

  async function onSubmit(data: ProfileInput) {
    setSaving(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success('Atelier profile updated successfully');
    } catch {
      toast.error('Could not update profile details');
    } finally {
      setSaving(false);
    }
  }

  const fieldCls =
    'w-full border border-border px-3.5 py-2.5 text-xs text-heading placeholder:text-text/40 focus:outline-none focus:border-gold transition-colors bg-background/50 rounded-xs';
  const labelCls = 'block text-[11px] font-semibold uppercase tracking-wider text-heading mb-1.5';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-surface border border-border rounded-xs p-6 sm:p-7 space-y-6 shadow-2xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input {...register('name')} className={fieldCls} placeholder="Your full name" />
          {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelCls}>Email Address</label>
          <input
            value={user.email}
            disabled
            className={`${fieldCls} bg-background/70 text-text/70 cursor-not-allowed`}
          />
          <p className="text-[10px] text-text/70 mt-1">Verified account address</p>
        </div>

        <div>
          <label className={labelCls}>
            Phone Number <span className="text-text font-normal lowercase">(for delivery updates)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text font-medium border-r border-border pr-2">
              +91
            </span>
            <input
              {...register('phone')}
              type="tel"
              maxLength={10}
              className={`${fieldCls} pl-14`}
              placeholder="9876543210"
            />
          </div>
          {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="pt-2 border-t border-border/60 flex items-center justify-between">
        <p className="text-[11px] text-text">
          Changes will apply across all future couture orders and receipts.
        </p>
        <button
          type="submit"
          disabled={saving || !isDirty}
          className="bg-heading text-surface px-6 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-gold transition-colors duration-200 disabled:opacity-40 rounded-xs cursor-pointer flex items-center gap-1.5"
        >
          {saving ? (
            <span>Saving…</span>
          ) : (
            <>
              <Check size={13} />
              <span>Save Profile</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
