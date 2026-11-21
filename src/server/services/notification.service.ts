import { notificationRepository } from '@/server/repositories/notification.repository';
import { orderRepository } from '@/server/repositories/order.repository';
import { NOTIFICATION_PAGE_SIZE, NOTIFICATION_RETENTION_DAYS, type NotificationType } from '@/constants/notification.constants';
import { ROUTES } from '@/constants/routes';

interface OrderContext {
  orderNumber: string;
  paymentMethod?: string;
  /** Extra detail for the message (for example the reason a payment failed). */
  detail?: string;
}

function compose(type: NotificationType, ctx: OrderContext): { title: string; message: string } {
  const ref = ctx.orderNumber;
  switch (type) {
    case 'order_placed':
      return ctx.paymentMethod === 'cod'
        ? { title: 'Order placed', message: `Your Cash on Delivery order ${ref} has been placed and is now being processed.` }
        : { title: 'Payment received, order confirmed', message: `We have received your payment and confirmed order ${ref}. Our atelier will begin preparing it.` };
    case 'payment_failed':
      return {
        title: 'Payment was not completed',
        message: `The payment for order ${ref} did not go through${ctx.detail ? ` (${ctx.detail})` : ''}. You can try again or choose Cash on Delivery.`,
      };
    case 'order_shipped':
      return { title: 'Your order has shipped', message: `Order ${ref} has been dispatched with our insured courier partner.` };
    case 'order_out_for_delivery':
      return { title: 'Out for delivery', message: `Order ${ref} is out for delivery and should reach you soon.` };
    case 'order_delivered':
      return { title: 'Order delivered', message: `Order ${ref} has been delivered. We hope you love your Aafreen Couture ensemble.` };
    case 'order_cancelled':
      return { title: 'Order cancelled', message: `Order ${ref} has been cancelled. If you have questions, please contact us.` };
  }
}

export class NotificationService {
  /**
   * Records an order event for the account that owns the order. Guest orders have no account to
   * notify, so they are skipped. A failure here must never break the order flow, so errors are
   * logged and swallowed.
   */
  async notifyOrder(orderId: string, type: NotificationType, ctx: OrderContext): Promise<void> {
    try {
      const ownerId = await orderRepository.getOwnerId(orderId);
      if (!ownerId) return;
      const { title, message } = compose(type, ctx);
      const expiresAt = new Date(Date.now() + NOTIFICATION_RETENTION_DAYS * 24 * 60 * 60 * 1000);
      await notificationRepository.createOnce({
        user: ownerId,
        type,
        title,
        message,
        orderId,
        orderNumber: ctx.orderNumber,
        link: `${ROUTES.ORDERS}/${orderId}`,
        expiresAt,
      });
    } catch (error) {
      console.error('[NotificationService] Could not record notification:', type, orderId, error);
    }
  }

  async list(userId: string, page = 1, limit = NOTIFICATION_PAGE_SIZE) {
    const safePage = Math.max(1, Math.floor(page) || 1);
    const safeLimit = Math.min(50, Math.max(1, Math.floor(limit) || NOTIFICATION_PAGE_SIZE));
    const [{ items, total }, unread] = await Promise.all([
      notificationRepository.findByUser(userId, safePage, safeLimit),
      notificationRepository.countUnread(userId),
    ]);
    return {
      items,
      unread,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.max(1, Math.ceil(total / safeLimit)),
        hasNextPage: safePage * safeLimit < total,
      },
    };
  }

  unreadCount(userId: string): Promise<number> {
    return notificationRepository.countUnread(userId).catch(() => 0);
  }

  setRead(userId: string, id: string, read: boolean): Promise<boolean> {
    return notificationRepository.setRead(userId, id, read);
  }

  markAllRead(userId: string): Promise<number> {
    return notificationRepository.markAllRead(userId);
  }

  remove(userId: string, id: string): Promise<boolean> {
    return notificationRepository.remove(userId, id);
  }

  removeAll(userId: string): Promise<number> {
    return notificationRepository.removeAll(userId);
  }
}

export const notificationService = new NotificationService();
