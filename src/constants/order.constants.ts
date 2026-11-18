import type { OrderStatus } from '@/models/Order';

export type { OrderStatus };

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending Verification',
  confirmed: 'Confirmed',
  processing: 'Under Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  return_requested: 'Return Requested',
  returned: 'Returned',
  refunded: 'Refunded',
};

export function getOrderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status as OrderStatus] ?? status.replace(/_/g, ' ');
}

/**
 * Legal forward-only fulfilment transitions. The return path is delivered, return_requested,
 * returned, refunded; cancelled and refunded are final. Shared by the server (to enforce) and the
 * admin screen (to only offer valid choices), so the two can never disagree.
 */
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'processing', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
  delivered: ['return_requested'],
  cancelled: [],
  return_requested: ['returned', 'delivered'],
  returned: ['refunded'],
  refunded: [],
};

/** Online-payment orders cannot reach these until Razorpay has captured the payment. */
export const STATUSES_REQUIRING_PAYMENT: OrderStatus[] = ['processing', 'shipped', 'out_for_delivery', 'delivered'];

export interface StatusChoices {
  /** Statuses the admin may move this order to right now. */
  allowed: OrderStatus[];
  /** Statuses that are legal next steps but blocked until the payment is confirmed. */
  blockedByPayment: OrderStatus[];
}

export function getStatusChoices(current: string, paymentMethod: string, paymentStatus: string): StatusChoices {
  const next = ORDER_STATUS_TRANSITIONS[current as OrderStatus] ?? [];
  const paymentPending = paymentMethod === 'razorpay' && paymentStatus !== 'paid';
  return {
    allowed: next.filter((s) => !(paymentPending && STATUSES_REQUIRING_PAYMENT.includes(s))),
    blockedByPayment: next.filter((s) => paymentPending && STATUSES_REQUIRING_PAYMENT.includes(s)),
  };
}

export const CANCELLABLE_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing'];

export const RETURNABLE_STATUSES: OrderStatus[] = ['delivered'];

export const SHIPPING_METHODS = {
  STANDARD: { id: 'standard', label: 'Standard Delivery', days: '3–5 Business Days', cost: 9900 },
  EXPRESS: { id: 'express', label: 'Express Delivery', days: '1–2 Business Days', cost: 19900 },
} as const;

export const FREE_SHIPPING_THRESHOLD = 500000; // ₹5,000 in paise
