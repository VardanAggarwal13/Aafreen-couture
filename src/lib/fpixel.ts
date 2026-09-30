export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1107855914977537';

type FbqArgs = unknown[];
type EventOptions = Record<string, string | number | boolean | null | undefined | unknown>;

declare global {
  interface Window {
    fbq?: (...args: FbqArgs) => void;
    _fbq?: unknown;
  }
}

// Track standard pageviews
export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

// Track standard or custom events (e.g. ViewContent, AddToCart, Purchase, etc.)
export const event = (name: string, options: EventOptions = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options);
  }
};

// Track custom non-standard events
export const customEvent = (name: string, options: EventOptions = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', name, options);
  }
};
