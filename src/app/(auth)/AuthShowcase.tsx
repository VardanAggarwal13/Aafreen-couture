import Image from 'next/image';
import { Check } from 'lucide-react';

const COPY = {
  login: {
    eyebrow: 'Welcome back',
    heading: 'Where artistry meets bridal grandeur',
  },
  register: {
    eyebrow: 'Join the atelier',
    heading: 'Begin your couture journey',
  },
} as const;

// Only benefits the store really offers (order tracking, saved addresses, stylist chat).
const BENEFITS = [
  'Track every order, from atelier to doorstep',
  'Faster checkout with saved addresses',
  'Chat with our stylists about your bridal look',
];

/**
 * Left-hand panel shared by the sign-in and register screens: the brand logo on the site's cream
 * surface, with a short welcome and the real benefits of having an account. Desktop only.
 */
export function AuthShowcase({ variant }: { variant: keyof typeof COPY }) {
  const copy = COPY[variant];

  return (
    <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center gap-5 xl:gap-6 border-r border-border bg-[#F5EFE6] p-8 xl:p-12 text-center">
      <Image
        src="/images/logo-header.webp"
        alt="Aafreen Couture By Pearl"
        width={480}
        height={228}
        priority
        className="h-auto w-60 xl:w-72"
      />

      <span aria-hidden="true" className="h-px w-14 bg-gold/70" />

      <div>
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-gold-ink">{copy.eyebrow}</p>
        <h2 className="mt-2 font-serif text-2xl xl:text-[2rem] leading-[1.15] text-heading">{copy.heading}</h2>
      </div>

      <ul className="mt-1 space-y-2.5 text-left">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5 text-sm leading-snug text-[#3D332A]">
            <Check size="0.9375rem" className="mt-0.5 shrink-0 text-gold-ink" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
