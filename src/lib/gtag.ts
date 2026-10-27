export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-D54EC0W1KS';

type GtagEventParams = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// Track pageviews
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function' && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = (action: string, params: GtagEventParams = {}) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', action, params);
  }
};

// Track standard e-commerce events
export const trackViewItem = (item: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  event('view_item', {
    currency: 'INR',
    value: item.price,
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        item_category: item.category,
      },
    ],
  });
};

export const trackAddToCart = (item: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  category?: string;
}) => {
  event('add_to_cart', {
    currency: 'INR',
    value: item.price * (item.quantity || 1),
    items: [
      {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        item_category: item.category,
      },
    ],
  });
};

export const trackBeginCheckout = (value: number, itemsCount: number) => {
  event('begin_checkout', {
    currency: 'INR',
    value,
    items_count: itemsCount,
  });
};

export const trackPurchase = (order: {
  transactionId: string;
  value: number;
  tax?: number;
  shipping?: number;
  currency?: string;
  items?: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) => {
  event('purchase', {
    transaction_id: order.transactionId,
    value: order.value,
    tax: order.tax || 0,
    shipping: order.shipping || 0,
    currency: order.currency || 'INR',
    items: order.items?.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      price: item.price,
      quantity: item.quantity,
    })),
  });
};
