import type { Metadata } from 'next';
import Link from 'next/link';
import { MailCheck, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Verify Email | Aafreen Couture',
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
      <div className="w-full max-w-md bg-white border border-[#E8D8C8] p-8 sm:p-10 text-center shadow-xs rounded-xs">
        <div className="w-14 h-14 rounded-full bg-[#FAF7F2] text-[#A67C52] flex items-center justify-center mx-auto mb-5 border border-[#E8D8C8]">
          <MailCheck size={28} />
        </div>

        <h1 className="font-serif text-2xl text-[#221617] uppercase tracking-wider mb-2">
          Verify Your Email
        </h1>

        <p className="text-xs text-[#6E6A66] leading-relaxed font-sans mb-6">
          We have sent a verification link to your registered email address. Please click the link to activate your account and start your couture journey.
        </p>

        <div className="space-y-3">
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center justify-center gap-2 w-full py-3 bg-[#221617] text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#A67C52] transition-colors rounded-xs"
          >
            Go to Sign In <ArrowRight size={14} />
          </Link>

          <Link
            href={ROUTES.CONTACT}
            className="inline-block text-xs text-[#6E6A66] hover:text-[#A67C52] transition-colors font-sans"
          >
            Didn&apos;t receive the email? Contact Concierge
          </Link>
        </div>
      </div>
    </div>
  );
}
