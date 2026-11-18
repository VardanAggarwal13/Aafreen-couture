'use client';

import { useEffect } from 'react';

/**
 * Last-resort screen for errors thrown by the root layout itself (where error.tsx cannot run).
 * It replaces the whole document, so it carries its own <html>/<body> and plain inline styles
 * in the site palette instead of relying on the app's stylesheet.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="en-IN">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          background: '#F8F5F1',
          color: '#2E221C',
          fontFamily: 'Georgia, "Times New Roman", serif',
          textAlign: 'center',
        }}
      >
        <div role="alert" style={{ maxWidth: '26rem' }}>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.6875rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#6E4F14' }}>
            Aafreen Couture
          </p>
          <h1 style={{ margin: '0 0 0.75rem', fontSize: '1.875rem', fontWeight: 500 }}>Something went wrong</h1>
          <p style={{ margin: '0 0 1.75rem', fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', lineHeight: 1.6, color: '#7A5C47' }}>
            We hit an unexpected problem. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              cursor: 'pointer',
              border: 'none',
              borderRadius: '0.5rem',
              background: '#C9A86A',
              color: '#2E221C',
              padding: '0.75rem 1.5rem',
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}
          >
            Try Again
          </button>
          {error.digest && (
            <p style={{ margin: '1.5rem 0 0', fontFamily: 'system-ui, sans-serif', fontSize: '0.6875rem', color: '#7A5C47' }}>
              Reference: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
