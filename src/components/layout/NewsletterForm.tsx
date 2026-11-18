'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsSubscribed(true);
    toast.success('Thank you for subscribing!', {
      description: 'You have been added to the Aafreen Couture private preview list.',
    });
    setEmail('');
  }

  if (isSubscribed) {
    return <p className="text-sm font-medium tracking-wide text-gold">Thank you for subscribing to our private preview list.</p>;
  }

  return (
    <form onSubmit={handleSubscribe} className="mx-auto flex max-w-md flex-col gap-2.5 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Email address"
        autoComplete="email"
        required
        className="h-12 w-full rounded-xl sm:flex-1 border border-heading/20 bg-transparent px-4 text-base text-heading placeholder:text-text/70 transition-colors focus:border-gold focus:outline-none sm:text-sm"
      />
      <button
        type="submit"
        className="flex h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-heading px-7 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-surface transition-colors hover:bg-gold active:scale-[0.99]"
      >
        <span>Subscribe</span>
        <ArrowRight size="0.875rem" />
      </button>
    </form>
  );
}
