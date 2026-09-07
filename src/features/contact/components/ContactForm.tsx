'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Please write at least 10 characters'),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    await new Promise((r) => setTimeout(r, 800));
    console.log('Contact form:', data);
    setSent(true);
    reset();
  }

  if (sent) {
    return (
      <div className="py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-brand-gold/15 flex items-center justify-center mx-auto mb-4">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-gold">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-serif text-xl text-brand-black mb-2">Message Sent!</h3>
        <p className="text-sm text-brand-stone">We&apos;ll get back to you within 4–6 hours.</p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 text-sm text-brand-gold hover:text-brand-black transition-colors border-b border-brand-gold pb-0.5"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-brand-black mb-1.5 uppercase tracking-wider">
          Full Name <span className="text-brand-gold">*</span>
        </label>
        <input
          {...register('name')}
          className="w-full border border-brand-cream bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
          placeholder="Priya Sharma"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-brand-black mb-1.5 uppercase tracking-wider">
            Email <span className="text-brand-gold">*</span>
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full border border-brand-cream bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
            placeholder="you@email.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-brand-black mb-1.5 uppercase tracking-wider">
            Phone
          </label>
          <input
            {...register('phone')}
            type="tel"
            className="w-full border border-brand-cream bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
            placeholder="+91 95179 01117"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-black mb-1.5 uppercase tracking-wider">
          Subject <span className="text-brand-gold">*</span>
        </label>
        <select
          {...register('subject')}
          className="w-full border border-brand-cream bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
        >
          <option value="">Select a subject</option>
          <option>Order Enquiry</option>
          <option>Customisation Request</option>
          <option>Return / Refund</option>
          <option>Shipping Query</option>
          <option>General Question</option>
        </select>
        {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-brand-black mb-1.5 uppercase tracking-wider">
          Message <span className="text-brand-gold">*</span>
        </label>
        <textarea
          {...register('message')}
          rows={5}
          className="w-full border border-brand-cream bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none"
          placeholder="Tell us how we can help..."
        />
        {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-gold text-white text-[11px] font-semibold tracking-[0.22em] uppercase py-3.5 hover:bg-[#b8893f] transition-colors disabled:opacity-60"
      >
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
