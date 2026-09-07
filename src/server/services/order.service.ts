import mongoose from 'mongoose';
import { orderRepository } from '@/server/repositories/order.repository';
import { productRepository } from '@/server/repositories/product.repository';
import { NotFoundError, BusinessError } from '@/lib/api-errors';
import { generateOrderNumber } from '@/lib/utils';
import { siteConfig } from '@/config/site.config';
import type { IOrder } from '@/models/Order';
import type { CreateOrderInput } from '@/validators/order.validators';

const SHIPPING_CHARGE = 25000; // ₹250 in paise

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
        const variant = product.variants.find(
          (v) => v._id?.toString() === item.variantId
        );
        if (!variant) throw new NotFoundError(`Variant ${item.variantId}`);
        if (!variant.isActive || variant.stock < item.quantity) {
          throw new BusinessError(`${product.name} — selected size/color is out of stock`);
        }
        price = variant.price;
        if (variant.images[0]) image = variant.images[0];
        size = variant.size;
        color = variant.color;
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

    const shippingCharge = subtotal >= siteConfig.freeShippingThreshold ? 0 : SHIPPING_CHARGE;
    const total = subtotal + shippingCharge;
    const orderNumber = generateOrderNumber();

    const order = await orderRepository.create({
      orderNumber,
      user: userId || undefined,
      items: orderItems,
      shippingAddress: input.shippingAddress,
      subtotal,
      shippingCharge,
      discount: 0,
      total,
      paymentMethod: input.paymentMethod,
      paymentStatus: 'pending',
      status: 'pending',
      statusHistory: [{ status: 'pending', timestamp: new Date() }],
    });

    return order;
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
}

export const orderService = new OrderService();
