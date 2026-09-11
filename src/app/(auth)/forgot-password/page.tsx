'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '@/constants/routes';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    setLoading(true);
    // Simulate recovery email send
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Password reset instructions sent!');
    }, 800);
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md bg-surface border border-border p-8 sm:p-10 shadow-md rounded-xs">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl tracking-wide text-heading mb-2">
            Recover Access
          </h1>
          <p className="text-[10.5px] uppercase tracking-[0.25em] text-gold font-semibold">
            Atelier Password Recovery
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-background text-gold flex items-center justify-center mx-auto mb-4 border border-border">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="font-serif text-xl text-heading mb-2">Check Your Email</h2>
            <p className="text-xs text-text leading-relaxed mb-6 font-sans">
              We have sent password reset instructions to <strong className="text-heading">{email}</strong>.
            </p>
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold hover:text-heading transition-colors"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-xs text-text text-center leading-relaxed font-sans mb-4">
              Enter your registered email address and we will dispatch a secure link to reset your atelier password.
            </p>

            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-semibold uppercase tracking-wider text-heading mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 pl-10 text-xs border border-border bg-background/50 text-heading rounded-xs focus:outline-none focus:border-gold placeholder:text-text/40 transition-colors"
                />
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text/50" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-heading text-surface text-xs font-semibold uppercase tracking-[0.2em] hover:bg-gold transition-colors duration-300 rounded-xs disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {loading ? 'Sending Instructions…' : 'Send Recovery Link'}
            </button>

            <div className="text-center pt-3 border-t border-border/80">
              <Link
                href={ROUTES.LOGIN}
                className="inline-flex items-center gap-1.5 text-xs text-text hover:text-gold transition-colors font-sans"
              >
                <ArrowLeft size={13} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
