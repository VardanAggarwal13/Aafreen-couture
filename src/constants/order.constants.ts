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

export const CANCELLABLE_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'processing'];

export const RETURNABLE_STATUSES: OrderStatus[] = ['delivered'];

export const SHIPPING_METHODS = {
  STANDARD: { id: 'standard', label: 'Standard Delivery', days: '3–5 Business Days', cost: 9900 },
  EXPRESS: { id: 'express', label: 'Express Delivery', days: '1–2 Business Days', cost: 19900 },
} as const;

export const FREE_SHIPPING_THRESHOLD = 500000; // ₹5,000 in paise
