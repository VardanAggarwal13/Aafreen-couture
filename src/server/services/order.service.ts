import mongoose from 'mongoose';
import { orderRepository } from '@/server/repositories/order.repository';
import { productRepository } from '@/server/repositories/product.repository';
import { emailService } from '@/server/services/email.service';
import { couponService } from '@/server/services/coupon.service';
import { notificationService } from '@/server/services/notification.service';
import type { NotificationType } from '@/constants/notification.constants';
import { NotFoundError, BusinessError } from '@/lib/api-errors';
import { generateOrderNumber } from '@/lib/utils';
import { siteConfig } from '@/config/site.config';
import { getOrderStatusLabel, ORDER_STATUS_TRANSITIONS, STATUSES_REQUIRING_PAYMENT } from '@/constants/order.constants';
import type { IOrder, OrderStatus } from '@/models/Order';
import type { CreateOrderInput } from '@/validators/order.validators';

/** Order status changes that produce a customer notification. */
const ORDER_STATUS_NOTIFICATIONS: Partial<Record<OrderStatus, NotificationType>> = {
  shipped: 'order_shipped',
  out_for_delivery: 'order_out_for_delivery',
  delivered: 'order_delivered',
  cancelled: 'order_cancelled',
};

const SHIPPING_CHARGE = 0; // ₹0 for now as requested (complimentary shipping)


export class OrderService {
  async createOrder(userId: string | undefined, input: CreateOrderInput): Promise<IOrder> {
    // Validate each product/variant and build order items
    const orderItems: IOrder['items'] = [];
    let subtotal = 0;

    // Look every product up at once (the cart size is capped by validation), then check them in order.
    const products = await Promise.all(input.items.map((item) => productRepository.findById(item.productId)));

    for (const [index, item] of input.items.entries()) {
      const product = products[index];
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
   * Permanently removes an order. Orders with money received (paid / partly refunded) are protected
   * and need an explicit confirmPaid flag, so a stray click cannot erase a financial record.
   */
  async deleteOrder(orderId: string, confirmPaid = false): Promise<{ orderNumber: string }> {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order not found');
    const hasPayment = order.paymentStatus === 'paid' || order.paymentStatus === 'partially_refunded';
    if (hasPayment && !confirmPaid) {
      throw new BusinessError('This order has a payment on record. Confirm explicitly to delete it.');
    }
    const deleted = await orderRepository.delete(orderId);
    if (!deleted) throw new NotFoundError('Order not found');
    return { orderNumber: order.orderNumber };
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

    const allowedNext = ORDER_STATUS_TRANSITIONS[order.status] ?? [];
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

    // Customer-facing notification for the milestones a customer cares about (awaited, but it never
    // throws: it is only a few indexed writes and must finish before a serverless function stops).
    const statusEvent = ORDER_STATUS_NOTIFICATIONS[newStatus];
    if (statusEvent) {
      await notificationService.notifyOrder(orderId, statusEvent, { orderNumber: updated.orderNumber });
    }

    return updated;
  }

  async getOrderById(orderId: string, userId: string, userEmail?: string): Promise<IOrder> {
    const order = await orderRepository.findById(orderId);
    if (!order) throw new NotFoundError('Order');
    const ownerId = await orderRepository.getOwnerId(orderId);
    const matchesUser = Boolean(ownerId && ownerId === userId);
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

    const ownerId = await orderRepository.getOwnerId(orderId);
    if (userId) {
      const matchesUser = Boolean(ownerId && ownerId === userId);
      const matchesEmail =
        Boolean(userEmail && order.shippingAddress?.email?.toLowerCase() === userEmail.toLowerCase());
      if (!matchesUser && !matchesEmail) throw new NotFoundError('Order');
    } else if (ownerId) {
      // An order that belongs to an account can only be confirmed by that signed-in account.
      throw new NotFoundError('Order');
    }

    // Only a Cash on Delivery order may be confirmed here. Online-payment orders move forward only
    // once Razorpay has confirmed the money, never through this shortcut.
    if (order.paymentMethod !== 'cod') {
      throw new BusinessError('This order requires online payment.');
    }

    // Idempotency: If already placed via COD, return immediately
    if (order.status === 'processing') {
      return order;
    }
    if (order.status !== 'pending') {
      throw new BusinessError('This order can no longer be confirmed.');
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
      await productRepository.decrementStockBulk(
        order.items.map((item) => ({
          productId: item.product ? item.product.toString() : '',
          variantId: item.variant ? item.variant.toString() : undefined,
          quantity: item.quantity,
        }))
      );
    } catch (stockErr) {
      console.error('[OrderService] Error updating product stock for COD order:', stockErr);
    }

    // Real-time email notification to customer & atelier
    emailService.sendOrderConfirmation(updated).catch((emailErr) => {
      console.error('[OrderService] Error dispatching COD confirmation email:', emailErr);
    });
    await notificationService.notifyOrder(orderId, 'order_placed', {
      orderNumber: updated.orderNumber,
      paymentMethod: 'cod',
    });

    return updated;
  }
}

export const orderService = new OrderService();
