'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { useDeferredReady } from '@/hooks/use-deferred-ready';
import * as gtag from '@/lib/gtag';

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);
  const ready = useDeferredReady();

  useEffect(() => {
    // Initial pageview is handled by the inline init script.
    // Subsequent client-side route changes trigger pageview tracking.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const search = searchParams?.toString();
    const url = pathname + (search ? `?${search}` : '');
    gtag.pageview(url);
  }, [pathname, searchParams]);

  // Third-party tags wait for the first interaction (or a short timeout) so they never delay hydration
  if (!gtag.GA_MEASUREMENT_ID || !ready) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-tag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
