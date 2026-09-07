import mongoose, { Schema, model, models, type Document } from 'mongoose';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'returned'
  | 'refunded';

export type PaymentMethod = 'razorpay' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';

export interface IOrderItem {
  product: mongoose.Types.ObjectId | string;
  variant?: mongoose.Types.ObjectId | string;
  name: string;
  slug: string;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
  price: number;       // paise — price at time of purchase
  totalPrice: number;  // paise
}

export interface IShippingAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  email?: string;
}

export interface IStatusHistoryEntry {
  status: OrderStatus;
  timestamp: Date;
  note?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  user?: mongoose.Types.ObjectId | string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;          // paise
  shippingCharge: number;    // paise
  discount: number;          // paise
  total: number;             // paise
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  status: OrderStatus;
  statusHistory: IStatusHistoryEntry[];
  trackingNumber?: string;
  trackingUrl?: string;
  deliveredAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: Schema.Types.Mixed, required: true },
  variant: { type: Schema.Types.Mixed },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  image: { type: String, required: true },
  size: { type: String },
  color: { type: String },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
});

const ShippingAddressSchema = new Schema<IShippingAddress>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  email: { type: String },
});

const StatusHistorySchema = new Schema<IStatusHistoryEntry>({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String },
});

const ORDER_STATUSES: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped',
  'out_for_delivery', 'delivered', 'cancelled',
  'return_requested', 'returned', 'refunded',
];

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.Mixed, ref: 'User', required: false },
    items: [OrderItemSchema],
    shippingAddress: { type: ShippingAddressSchema, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shippingCharge: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    couponCode: { type: String, uppercase: true },
    paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: { type: String, enum: ORDER_STATUSES, default: 'pending' },
    statusHistory: [StatusHistorySchema],
    trackingNumber: { type: String },
    trackingUrl: { type: String },
    deliveredAt: { type: Date },
    notes: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ razorpayOrderId: 1 });

const Order = models.Order ?? model<IOrder>('Order', OrderSchema);
export default Order;
