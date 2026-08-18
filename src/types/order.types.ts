import type { OrderStatus } from '@/constants/order.constants';

export type { OrderStatus };

export type PaymentMethod = 'razorpay' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund';

export interface IOrderItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  size: string;
  color?: string;
  price: number;        // paise at time of order
  qty: number;
  subtotal: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface IOrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface IOrder {
  _id: string;
  orderNumber: string;
  userId: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  shippingMethod: 'standard' | 'express';
  shippingCost: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  status: OrderStatus;
  statusHistory: IOrderStatusHistory[];
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}
