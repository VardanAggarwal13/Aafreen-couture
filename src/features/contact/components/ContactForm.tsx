'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, Loader2, MessageCircle } from 'lucide-react';
import { contactSchema, CONTACT_SUBJECTS, type ContactInput } from '@/validators/contact.schema';
import { siteConfig } from '@/config/site.config';

const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-heading mb-1.5';
const fieldClass =
  'w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-heading placeholder:text-text/50 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30';
const fieldOk = 'border-border focus:border-gold';
const fieldErr = 'border-red-400';
const errorText = 'mt-1 text-xs text-red-700';

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), defaultValues: { website: '' } });

  async function onSubmit(data: ContactInput) {
    setServerError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json: { success?: boolean; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        setServerError(json.error ?? 'We could not send your message. Please try again, or reach us on WhatsApp.');
        return;
      }
      setSent(true);
      reset();
    } catch {
      setServerError('We could not reach the server. Check your connection and try again, or reach us on WhatsApp.');
    }
  }

  if (sent) {
    return (
      <div role="status" className="py-12 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gold/15 text-gold-ink">
          <Check size="1.375rem" aria-hidden="true" />
        </div>
        <h3 className="mb-2 font-serif text-xl text-heading">Message sent</h3>
        <p className="text-sm text-text">We&apos;ll get back to you during business hours.</p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-6 border-b border-gold pb-0.5 text-sm text-gold-ink transition-colors hover:text-heading"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {serverError && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-800">
          <AlertCircle size="1.125rem" className="mt-0.5 shrink-0" aria-hidden="true" />
          <div className="space-y-1.5">
            <p>{serverError}</p>
            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-900 underline underline-offset-4"
            >
              <MessageCircle size="0.8125rem" aria-hidden="true" />
              Message us on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Honeypot: hidden from people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Full name <span className="text-gold-ink">*</span>
        </label>
        <input
          id="contact-name"
          autoComplete="name"
          placeholder="Priya Sharma"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'contact-name-error' : undefined}
          {...register('name')}
          className={`${fieldClass} ${errors.name ? fieldErr : fieldOk}`}
        />
        {errors.name && (
          <p id="contact-name-error" role="alert" className={errorText}>
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email <span className="text-gold-ink">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@email.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            {...register('email')}
            className={`${fieldClass} ${errors.email ? fieldErr : fieldOk}`}
          />
          {errors.email && (
            <p id="contact-email-error" role="alert" className={errorText}>
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone <span className="font-normal normal-case tracking-normal text-text">(optional)</span>
          </label>
          <input
            id="contact-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 95179 01117"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
            {...register('phone')}
            className={`${fieldClass} ${errors.phone ? fieldErr : fieldOk}`}
          />
          {errors.phone && (
            <p id="contact-phone-error" role="alert" className={errorText}>
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClass}>
          Subject <span className="text-gold-ink">*</span>
        </label>
        <select
          id="contact-subject"
          defaultValue=""
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
          {...register('subject')}
          className={`${fieldClass} ${errors.subject ? fieldErr : fieldOk}`}
        >
          <option value="" disabled>
            Select a subject
          </option>
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        {errors.subject && (
          <p id="contact-subject-error" role="alert" className={errorText}>
            {errors.subject.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message <span className="text-gold-ink">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Tell us how we can help..."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          {...register('message')}
          className={`${fieldClass} resize-none ${errors.message ? fieldErr : fieldOk}`}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className={errorText}>
            {errors.message.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold py-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-heading transition-colors hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 size="0.9375rem" className="animate-spin" aria-hidden="true" />
            <span>Sending…</span>
          </>
        ) : (
          <span>Send Message</span>
        )}
      </button>
    </form>
  );
}
