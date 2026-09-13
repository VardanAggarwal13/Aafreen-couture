export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  handler?: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
  };
}

export interface RazorpayPaymentFailedResponse {
  error?: {
    code?: string;
    description?: string;
    reason?: string;
    source?: string;
    step?: string;
  };
}

export interface RazorpayInstance {
  open(): void;
  on<T = unknown>(event: string, handler: (response: T) => void): void;
  close?(): void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions | unknown) => RazorpayInstance;
  }
}
