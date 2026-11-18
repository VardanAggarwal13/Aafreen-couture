import Image from 'next/image';
import { PackageCheck, Heart, MessageCircle, MapPin, type LucideIcon } from 'lucide-react';

interface Benefit {
  icon: LucideIcon;
  title: string;
  detail: string;
}

interface ShowcaseCopy {
  eyebrow: string;
  heading: string;
  intro: string;
  benefitsLabel: string;
  benefits: Benefit[];
}

// Only benefits the store really offers: order history in the account, wishlist, saved addresses,
// and styling help over WhatsApp.
const COPY: Record<'login' | 'register', ShowcaseCopy> = {
  login: {
    eyebrow: 'Welcome back',
    heading: 'Continue your couture journey',
    intro:
      'Every Aafreen piece is hand-embroidered in our Amritsar atelier. Sign in to see your orders, saved pieces and delivery details.',
    benefitsLabel: 'Inside your account',
    benefits: [
      { icon: PackageCheck, title: 'Your orders, all in one place', detail: 'See every order you have placed and its latest status.' },
      { icon: Heart, title: 'Your wishlist, saved', detail: 'The lehengas, suits and jewellery you loved are waiting.' },
      { icon: MessageCircle, title: 'Personal styling on WhatsApp', detail: 'Ask about sizing, fabrics, fittings and your wedding date.' },
    ],
  },
  register: {
    eyebrow: 'Join the atelier',
    heading: 'Begin your couture journey',
    intro:
      'Create your account for a calmer way to shop heirloom bridal and festive wear, from the first piece you save to the day it arrives.',
    benefitsLabel: 'What you get',
    benefits: [
      { icon: Heart, title: 'Save the pieces you love', detail: 'Build a wishlist for every ceremony, from mehendi on.' },
      { icon: MapPin, title: 'Faster, easier checkout', detail: 'Save your delivery addresses once and reuse them on every order.' },
      { icon: PackageCheck, title: 'Your orders, all in one place', detail: 'See every order you have placed and its latest status.' },
    ],
  },
};

// Facts the store already states on its About and Returns pages.
const ASSURANCES = [
  { value: '200+', label: 'hours of hand embroidery' },
  { value: '50+', label: 'countries shipped worldwide' },
  { value: '7-day', label: 'size exchange on eligible pieces' },
];

/**
 * Left-hand panel shared by the sign-in and register screens. Text only: the brand logo, a welcome,
 * the real benefits of an account and a strip of facts about the atelier. Sizes scale with the
 * screen height so it stays balanced on tall monitors and short laptop windows. Desktop only.
 */
export function AuthShowcase({ variant }: { variant: keyof typeof COPY }) {
  const copy = COPY[variant];

  return (
    // Spacing system: --major separates the four groups, --minor spaces things inside a group.
    <div className="hidden lg:flex lg:col-span-5 flex-col items-center justify-center gap-[var(--major)] [--major:clamp(1.25rem,4.2vh,2.75rem)] [--minor:clamp(0.4rem,1.3vh,0.875rem)] border-r border-border bg-[#F5EFE6] px-8 xl:px-14 py-[clamp(1rem,4vh,3rem)] text-center">
      {/* Group 1: brand */}
      <div className="flex flex-col items-center gap-[calc(var(--minor)*1.5)]">
        <Image
          src="/images/logo-header.webp"
          alt="Aafreen Couture By Pearl"
          width={480}
          height={228}
          priority
          className="h-auto w-[clamp(7.5rem,19vh,14rem)] shrink-0"
        />
        <span aria-hidden="true" className="h-px w-12 bg-gold/70" />
      </div>

      {/* Group 2: welcome message */}
      <div className="flex w-full max-w-md flex-col items-center gap-[var(--minor)]">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.3em] text-gold-ink">{copy.eyebrow}</p>
        <h2 className="font-serif text-[clamp(1.5rem,3.8vh,2.25rem)] leading-[1.15] text-balance text-heading">{copy.heading}</h2>
        <p className="max-w-[26rem] text-balance text-[0.9375rem] leading-relaxed text-text [@media(max-height:46rem)]:text-[0.8125rem] [@media(max-height:46rem)]:leading-snug [@media(max-height:30rem)]:hidden">
          {copy.intro}
        </p>
      </div>

      {/* Group 3: benefits */}
      <div className="flex flex-col items-center gap-[var(--minor)]">
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-gold-ink [@media(max-height:30rem)]:hidden">
          {copy.benefitsLabel}
        </p>
        <ul className="flex flex-col gap-[calc(var(--minor)*1.1)] text-left">
          {copy.benefits.map(({ icon: Icon, title, detail }) => (
            <li key={title} className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/45 bg-gold/10 text-gold-ink [@media(max-height:46rem)]:h-8 [@media(max-height:46rem)]:w-8">
                <Icon size="1.125rem" strokeWidth={1.6} />
              </span>
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-semibold leading-snug text-heading">{title}</p>
                <p className="mt-0.5 text-sm leading-snug text-text [@media(max-height:46rem)]:text-xs [@media(max-height:28rem)]:hidden">{detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Group 4: facts about the atelier (tall screens only) */}
      <dl className="grid w-full max-w-md grid-cols-3 gap-4 border-t border-gold/30 pt-[var(--major)] -mt-[calc(var(--major)*0.25)] [@media(max-height:46rem)]:hidden">
        {ASSURANCES.map(({ value, label }) => (
          <div key={value} className="flex flex-col items-center gap-1.5">
            <dt className="font-serif text-2xl leading-none text-heading">{value}</dt>
            <dd className="max-w-[8.5rem] text-balance text-xs leading-snug text-text">{label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
