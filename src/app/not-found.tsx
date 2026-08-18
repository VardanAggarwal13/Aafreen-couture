import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-serif text-brand-gold mb-4">404</p>
      <h1 className="text-2xl text-brand-black mb-3">Page not found</h1>
      <p className="text-brand-stone text-sm max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href={ROUTES.HOME}
          className="bg-brand-gold text-white px-6 py-2.5 text-sm font-medium hover:bg-brand-gold/90 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href={ROUTES.SHOP}
          className="border border-brand-black text-brand-black px-6 py-2.5 text-sm font-medium hover:bg-brand-black hover:text-white transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
