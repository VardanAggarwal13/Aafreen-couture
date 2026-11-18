import Link from 'next/link';
import type { Metadata } from 'next';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center bg-background px-4 text-center">
      <p className="mb-3 font-serif text-6xl text-gold-ink sm:text-7xl">404</p>
      <h1 className="mb-3 font-serif text-2xl text-heading sm:text-3xl">Page not found</h1>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-text">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href={ROUTES.HOME} className={buttonVariants({ variant: 'couture-gold', size: 'couture' })}>
          Go Home
        </Link>
        <Link href={ROUTES.SHOP} className={buttonVariants({ variant: 'couture-outline', size: 'couture' })}>
          Browse the Shop
        </Link>
      </div>
    </div>
  );
}
