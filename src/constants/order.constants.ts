export const ORDER_STATUSES = {
  PENDING_PAYMENT: 'pending_payment',
  PAYMENT_FAILED: 'payment_failed',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  PACKING: 'packing',
  SHIPPED: 'shipped',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURN_REQUESTED: 'return_requested',
  RETURN_APPROVED: 'return_approved',
  RETURN_PICKED: 'return_picked',
  REFUNDED: 'refunded',
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: 'Pending Payment',
  payment_failed: 'Payment Failed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  packing: 'Packing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  return_requested: 'Return Requested',
  return_approved: 'Return Approved',
  return_picked: 'Return Picked Up',
  refunded: 'Refunded',
};

export const CANCELLABLE_STATUSES: OrderStatus[] = [
  'pending_payment',
  'confirmed',
  'processing',
];

export const RETURNABLE_STATUSES: OrderStatus[] = ['delivered'];

export const SHIPPING_METHODS = {
  STANDARD: { id: 'standard', label: 'Standard Delivery', days: '3–5 Business Days', cost: 9900 },
  EXPRESS: { id: 'express', label: 'Express Delivery', days: '1–2 Business Days', cost: 19900 },
} as const;

export const FREE_SHIPPING_THRESHOLD = 500000; // ₹5,000 in paise
