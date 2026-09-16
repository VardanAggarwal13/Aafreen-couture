import { returnRepository } from '@/server/repositories/return.repository';
import { orderRepository } from '@/server/repositories/order.repository';
import { NotFoundError } from '@/lib/api-errors';
import type { IReturn } from '@/models/Return';
import type { CreateReturnInput } from '@/validators/return.validators';

export class ReturnService {
  async logReturn(input: CreateReturnInput): Promise<IReturn> {
    const order = await orderRepository.findByOrderNumber(input.orderNumber);
    if (!order) throw new NotFoundError(`Order ${input.orderNumber}`);

    return returnRepository.create({
      order: order._id as unknown as IReturn['order'],
      orderNumber: order.orderNumber,
      customerName: order.shippingAddress?.name ?? 'Unknown Customer',
      productName: input.productName,
      quantity: input.quantity,
      reason: input.reason,
      refundAmount: input.refundAmount,
      status: 'under_review',
    });
  }
}

export const returnService = new ReturnService();
