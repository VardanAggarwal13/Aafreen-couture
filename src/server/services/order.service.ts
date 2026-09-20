import mongoose from 'mongoose';
import { orderRepository } from '@/server/repositories/order.repository';
import { productRepository } from '@/server/repositories/product.repository';
import { emailService } from '@/server/services/email.service';
import { couponService } from '@/server/services/coupon.service';
import { NotFoundError, BusinessError } from '@/lib/api-errors';
import { generateOrderNumber } from '@/lib/utils';
import { siteConfig } from '@/config/site.config';
import { getOrderStatusLabel } from '@/constants/order.constants';
import type { IOrder, OrderStatus } from '@/models/Order';
import type { CreateOrderInput } from '@/validators/order.validators';

const SHIPPING_CHARGE = 0; // ₹0 for now as requested (complimentary shipping)

// Legal forward-only fulfillment transitions. `delivered → return_requested → returned → refunded`
// is the return path; every other terminal state (cancelled/refunded) has no way out.
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
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

// Online-payment orders may not advance past "confirmed" until Razorpay has actually captured
// the payment — the admin's authority to move an order forward is gated on the payment being paid.
const STATUSES_REQUIRING_PAYMENT: OrderStatus[] = [
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
];

export class OrderService {
  async createOrder(userId: string | undefined, input: CreateOrderInput): Promise<IOrder> {
    // Validate each product/variant and build order items
    const orderItems: IOrder['items'] = [];
    let subtotal = 0;

    for (const item of input.items) {
      const product = await productRepository.findById(item.productId);
      if (!product) throw new NotFoundError(`Product ${item.productId}`);
      if (!product.isActive) throw new BusinessError(`${product.name} is no longer available`);

      let price = product.basePrice;
      let image = product.images[0] ?? '';
      let size: string | undefined;
      let color: string | undefined;

      if (item.variantId && product.variants?.length) {
        let variant = product.variants.find(
          (v) => v._id?.toString() === item.variantId
        );
        if (!variant && (item as unknown as { size?: string }).size) {
          variant = product.variants.find(
            (v) => v.size === (item as unknown as { size?: string }).size
          );
        }
        if (!variant) {
          variant = product.variants[0];
        }

        if (variant) {
          if (!variant.isActive || variant.stock < item.quantity) {
            throw new BusinessError(`${product.name} — selected size/color is out of stock`);
          }
          price = variant.price;
          if (variant.images?.[0]) image = variant.images[0];
          size = variant.size;
          color = variant.color;
        }
      }

      const totalPrice = price * item.quantity;
      subtotal += totalPrice;

      orderItems.push({
        product: (mongoose.Types.ObjectId.isValid(product._id)
          ? new mongoose.Types.ObjectId(product._id)
          : (product._id as unknown as mongoose.Types.ObjectId)),
        variant: item.variantId && mongoose.Types.ObjectId.isValid(item.variantId)
          ? new mongoose.Types.ObjectId(item.variantId)
          : undefined,
        name: product.name,
        slug: product.slug,
        image,
        size,
        color,
        quantity: item.quantity,
        price,
        totalPrice,
      });
    }

    // Server-side coupon validation — never trust a client-computed discount. If the code has
    // gone invalid since the customer applied it in the cart (expired, exhausted, etc.), the
    // order still proceeds without silently failing — we drop the discount rather than block checkout.
    let discount = 0;
    let couponApplied: string | undefined;
    let freeShipping = false;
    if (input.couponCode) {
      try {
        const priced = await couponService.validateAndPrice(input.couponCode, subtotal, userId);
        discount = priced.discount;
        freeShipping = priced.freeShipping;
        couponApplied = priced.coupon.code;
      } catch {
        // Coupon no longer valid — proceed without it rather than blocking order placement.
      }
    }

    const shippingCharge = freeShipping || subtotal >= siteConfig.freeShippingThreshold ? 0 : SHIPPING_CHARGE;
    const total = Math.max(0, subtotal - discount + shippingCharge);
    const orderNumber = generateOrderNumber();

    const order = await orderRepository.create({
      orderNumber,
      user: userId || undefined,
      items: orderItems,
      shippingAddress: input.shippingAddress,
      subtotal,
      shippingCharge,
      discount,
      couponCode: couponApplied,
      total,
      paymentMethod: input.paymentMethod,
      paymentStatus: 'pending',
      status: 'pending',
      statusHistory: [{ status: 'pending', timestamp: new Date() }],
    });

    if (couponApplied) {
      couponService.recordUsage(couponApplied, userId).catch((err) => {
        console.error('[OrderService] Failed to record coupon usage:', err);
      });
    }

    return order;
  }

  /**
   * Admin-driven fulfillment status change. Validates the transition is legal for the order's
   * current status, and — for online-payment orders — that payment has actually been captured
   * before the order can move past "confirmed". Fires customer notification emails on the
   * shipped/delivered milestones.
   */
  async updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Promise<IOrder> {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order');

    if (order.status === newStatus) return order;

    const allowedNext = ALLOWED_TRANSITIONS[order.status] ?? [];
    if (!allowedNext.includes(newStatus)) {
      throw new BusinessError(
        `Cannot move order from "${getOrderStatusLabel(order.status)}" to "${getOrderStatusLabel(newStatus)}".`
      );
    }

    if (
      order.paymentMethod === 'razorpay' &&
      order.paymentStatus !== 'paid' &&
      STATUSES_REQUIRING_PAYMENT.includes(newStatus)
    ) {
      throw new BusinessError(
        `Cannot advance this order — payment has not been confirmed as paid yet. Reconcile or verify the payment first.`
      );
    }

    const updated = newStatus === 'delivered'
      ? await orderRepository.markDelivered(orderId, note)
      : await orderRepository.updateStatus(orderId, newStatus, note);
    if (!updated) throw new NotFoundError('Order');

    if (newStatus === 'shipped') {
      emailService.sendShippingUpdate(updated).catch((err) => {
        console.error('[OrderService] Error dispatching shipping update email:', err);
      });
    } else if (newStatus === 'delivered') {
      emailService.sendDeliveryConfirmation(updated).catch((err) => {
        console.error('[OrderService] Error dispatching delivery confirmation email:', err);
      });
    }

    return updated;
  }

  async getOrderById(orderId: string, userId: string, userEmail?: string): Promise<IOrder> {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order');
    const matchesUser = order.user && String(order.user) === userId;
    const matchesEmail =
      Boolean(userEmail && order.shippingAddress?.email?.toLowerCase() === userEmail.toLowerCase());
    if (!matchesUser && !matchesEmail) throw new NotFoundError('Order');
    return order;
  }

  async getUserOrders(userId: string, page = 1, userEmail?: string) {
    return orderRepository.findByUserId(userId, page, 10, userEmail);
  }

  async confirmCodOrder(orderId: string, userId?: string, userEmail?: string): Promise<IOrder> {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order');

    if (userId) {
      const matchesUser = order.user && String(order.user) === userId;
      const matchesEmail =
        Boolean(userEmail && order.shippingAddress?.email?.toLowerCase() === userEmail.toLowerCase());
      if (!matchesUser && !matchesEmail) throw new NotFoundError('Order');
    }

    // Idempotency: If already placed via COD, return immediately
    if (order.status === 'processing' && order.paymentMethod === 'cod') {
      return order;
    }

    // COD orders skip "confirmed" (nothing to confirm — no payment happened) and go straight to
    // "Under Processing" so the admin can review and fulfill from there.
    const updated = await orderRepository.updateStatus(
      orderId,
      'processing',
      'Order placed via Cash on Delivery — under processing'
    );

    if (!updated) throw new NotFoundError('Order');

    await orderRepository.updatePayment(orderId, {
      paymentStatus: 'pending',
    });

    // Real-time stock decrement for all purchased items
    try {
      for (const item of order.items) {
        const pId = item.product ? item.product.toString() : '';
        const vId = item.variant ? item.variant.toString() : undefined;
        if (pId) {
          await productRepository.decrementStock(pId, vId, item.quantity);
        }
      }
    } catch (stockErr) {
      console.error('[OrderService] Error updating product stock for COD order:', stockErr);
    }

    // Real-time email notification to customer & atelier
    emailService.sendOrderConfirmation(updated).catch((emailErr) => {
      console.error('[OrderService] Error dispatching COD confirmation email:', emailErr);
    });

    return updated;
  }
}

export const orderService = new OrderService();
