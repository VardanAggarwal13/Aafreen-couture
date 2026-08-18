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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
      <div className="w-full max-w-md bg-white border border-[#E8D8C8] p-8 sm:p-10 shadow-xs rounded-xs">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href={ROUTES.HOME} className="inline-block font-serif text-2xl tracking-[0.2em] text-[#221617] uppercase mb-3">
            Aafreen
          </Link>
          <p className="text-[10.5px] uppercase tracking-[0.3em] text-[#A67C52] font-semibold">
            Password Recovery
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#A67C52] flex items-center justify-center mx-auto mb-4 border border-[#E8D8C8]">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="font-serif text-xl text-[#221617] mb-2">Check Your Email</h2>
            <p className="text-xs text-[#6E6A66] leading-relaxed mb-6 font-sans">
              We have sent password reset instructions to <strong className="text-[#221617]">{email}</strong>.
            </p>
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#A67C52] hover:text-[#221617] transition-colors"
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-xs text-[#6E6A66] text-center leading-relaxed font-sans mb-4">
              Enter your registered email address and we will send you instructions to reset your password.
            </p>

            <div>
              <label htmlFor="email" className="block text-[11px] font-semibold uppercase tracking-wider text-[#221617] mb-1.5">
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
                  className="w-full px-3.5 py-2.5 pl-10 text-xs border border-[#E8D8C8] bg-[#FAF7F2]/50 text-[#221617] rounded-xs focus:outline-none focus:border-[#A67C52]"
                />
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6E6A66]" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#221617] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#A67C52] transition-colors rounded-xs disabled:opacity-50"
            >
              {loading ? 'Sending Instructions…' : 'Send Reset Link'}
            </button>

            <div className="text-center pt-3 border-t border-[#E8D8C8]/60">
              <Link
                href={ROUTES.LOGIN}
                className="inline-flex items-center gap-1.5 text-xs text-[#6E6A66] hover:text-[#A67C52] transition-colors font-sans"
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
