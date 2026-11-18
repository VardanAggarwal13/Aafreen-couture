'use client';

import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useState } from 'react';

// Loaded after hydration so neither ships in the initial critical path.
const Toaster = dynamic(() => import('sonner').then((m) => m.Toaster), { ssr: false });
const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? dynamic(() => import('@tanstack/react-query-devtools').then((m) => m.ReactQueryDevtools), { ssr: false })
    : () => null;

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,         // 60 seconds - prevent excessive re-fetching on navigation/switches
            retry: 1,
            refetchOnWindowFocus: false, // Don't spam queries when switching windows/tabs
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* The storefront is light-only, so no theme provider is needed */}
      <TooltipProvider>
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: { fontFamily: 'var(--font-jakarta), sans-serif' },
          }}
        />
      </TooltipProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
