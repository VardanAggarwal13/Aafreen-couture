'use client';

import { useEffect, useState } from 'react';

const INTERACTION_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

/**
 * Becomes true after the visitor's first interaction, or after `fallbackMs`, whichever comes
 * first. Used to hold back third-party tags (analytics, pixels) until the page is usable, so
 * they never compete with hydration. Every visit still loads them.
 */
export function useDeferredReady(fallbackMs = 4000): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    const go = () => setReady(true);
    const timer = window.setTimeout(go, fallbackMs);
    INTERACTION_EVENTS.forEach((evt) => window.addEventListener(evt, go, { once: true, passive: true }));
    return () => {
      window.clearTimeout(timer);
      INTERACTION_EVENTS.forEach((evt) => window.removeEventListener(evt, go));
    };
  }, [ready, fallbackMs]);

  return ready;
}
