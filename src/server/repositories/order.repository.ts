import { connectDB } from '@/lib/db';
import OrderModel from '@/models/Order';
import type { IOrder, OrderStatus } from '@/models/Order';

export class OrderRepository {
  async create(data: Partial<IOrder>): Promise<IOrder> {
    await connectDB();
    const order = await OrderModel.create(data);
    return order.toObject() as IOrder;
  }

  async findById(id: string): Promise<IOrder | null> {
    await connectDB();
    return OrderModel.findById(id).populate('user', 'name email').lean<IOrder>();
  }

  async findByOrderNumber(orderNumber: string): Promise<IOrder | null> {
    await connectDB();
    return OrderModel.findOne({ orderNumber }).lean<IOrder>();
  }

  async findByRazorpayOrderId(razorpayOrderId: string): Promise<IOrder | null> {
    await connectDB();
    return OrderModel.findOne({ razorpayOrderId }).lean<IOrder>();
  }

  async findByUserId(userId: string, page = 1, limit = 10): Promise<{ items: IOrder[]; total: number }> {
    await connectDB();
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      OrderModel.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IOrder[]>(),
      OrderModel.countDocuments({ user: userId }),
    ]);
    return { items, total };
  }

  async updateStatus(id: string, status: OrderStatus, note?: string): Promise<IOrder | null> {
    await connectDB();
    return OrderModel.findByIdAndUpdate(
      id,
      {
        status,
        $push: {
          statusHistory: {
            status,
            timestamp: new Date(),
            note: note ?? '',
          },
        },
      },
      { new: true }
    ).lean<IOrder>();
  }

  async updatePayment(
    id: string,
    data: {
      paymentStatus: IOrder['paymentStatus'];
      razorpayPaymentId?: string;
      razorpaySignature?: string;
    }
  ): Promise<IOrder | null> {
    await connectDB();
    return OrderModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IOrder>();
  }

  async findByIdAndPatchRzpOrderId(id: string, razorpayOrderId: string): Promise<void> {
    await connectDB();
    await OrderModel.findByIdAndUpdate(id, { $set: { razorpayOrderId } });
  }

  async findAll(filters: {
    status?: OrderStatus;
    page?: number;
    limit?: number;
  }): Promise<{ items: IOrder[]; total: number }> {
    await connectDB();
    const query: Record<string, unknown> = {};
    if (filters.status) query.status = filters.status;

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      OrderModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name email')
        .lean<IOrder[]>(),
      OrderModel.countDocuments(query),
    ]);
    return { items, total };
  }
}

export const orderRepository = new OrderRepository();
