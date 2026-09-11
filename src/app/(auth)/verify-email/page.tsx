import type { Metadata } from 'next';
import Link from 'next/link';
import { MailCheck, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Verify Email | Aafreen Couture',
};

export default function VerifyEmailPage() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md bg-surface border border-border p-8 sm:p-10 text-center shadow-md rounded-xs">
        <div className="w-14 h-14 rounded-full bg-background text-gold flex items-center justify-center mx-auto mb-5 border border-border">
          <MailCheck size={26} />
        </div>

        <h1 className="font-serif text-2xl text-heading uppercase tracking-wider mb-2">
          Verify Your Email
        </h1>

        <p className="text-xs text-text leading-relaxed font-sans mb-6">
          We have sent a verification link to your registered email address. Please open the link to activate your account and access your couture salon.
        </p>

        <div className="space-y-3">
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-heading text-surface text-xs font-semibold uppercase tracking-[0.2em] hover:bg-gold transition-colors duration-300 rounded-xs shadow-xs"
          >
            Go to Sign In <ArrowRight size={14} />
          </Link>

          <Link
            href={ROUTES.CONTACT}
            className="inline-block text-xs text-text hover:text-gold transition-colors font-sans"
          >
            Didn&apos;t receive the email? Contact Concierge
          </Link>
        </div>
      </div>
    </div>
  );
}
