'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationProgress() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // Complete loading when route changes
  useEffect(() => {
    clearTimers();
    if (loading) {
      setProgress(100);
      const finishTimer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 220);
      timersRef.current.push(finishTimer);
    }
  }, [pathname]);

  // Listen to internal link clicks to start progress bar instantly
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Ignore external links, hash-only anchors, new tabs, and downloads
      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        target.getAttribute('target') === '_blank' ||
        target.hasAttribute('download')
      ) {
        return;
      }

      // Check if clicking the exact current URL
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      // Clear any existing step timers
      clearTimers();

      // Start royal progress bar immediately
      setLoading(true);
      setProgress(25);

      const step1 = setTimeout(() => setProgress(65), 120);
      const step2 = setTimeout(() => setProgress(88), 350);
      timersRef.current.push(step1, step2);
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      clearTimers();
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[99999] h-[2.5px] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-gold via-[#dfc491] to-gold shadow-[0_0_10px_rgba(201,168,106,0.85)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transitionProperty: 'width, opacity',
        }}
      />
    </div>
  );
}
