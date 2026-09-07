import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import OrderModel from '@/models/Order';
import type { IOrder, OrderStatus } from '@/models/Order';

// Resilient memory backup store for orders placed when MongoDB connection is establishing or offline
declare global {
  var __orderBackupStore: IOrder[] | undefined;
}

function getBackupStore(): IOrder[] {
  if (!global.__orderBackupStore) {
    global.__orderBackupStore = [];
  }
  return global.__orderBackupStore;
}

export class OrderRepository {
  async create(data: Partial<IOrder>): Promise<IOrder> {
    try {
      await connectDB();
      const order = await OrderModel.create(data);
      const obj = order.toObject() as IOrder;
      getBackupStore().unshift(obj);
      return obj;
    } catch (err) {
      console.warn('[OrderRepository] MongoDB unavailable, saving to resilient in-memory store:', err);
      const fallbackOrder: IOrder = {
        _id: 'bkp-' + Date.now(),
        orderNumber: data.orderNumber || `AC-${Date.now().toString().slice(-6)}`,
        user: data.user,
        items: data.items || [],
        shippingAddress: data.shippingAddress!,
        subtotal: data.subtotal || 0,
        shippingCharge: data.shippingCharge || 0,
        discount: data.discount || 0,
        total: data.total || 0,
        paymentMethod: data.paymentMethod || 'cod',
        paymentStatus: data.paymentStatus || 'pending',
        status: data.status || 'pending',
        statusHistory: data.statusHistory || [{ status: 'pending', timestamp: new Date() }],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as IOrder;

      getBackupStore().unshift(fallbackOrder);
      return fallbackOrder;
    }
  }

  async findById(id: string): Promise<IOrder | null> {
    const cleanId = id.replace(/^#/, '').trim();
    try {
      await connectDB();
      const query = mongoose.Types.ObjectId.isValid(cleanId)
        ? { _id: cleanId }
        : { orderNumber: cleanId };
      const doc = await OrderModel.findOne(query).populate('user', 'name email').lean<IOrder>();
      if (doc) return doc;
    } catch {
      // Fallback
    }
    const found = getBackupStore().find(
      (o) => String(o._id) === cleanId || o.orderNumber.toLowerCase() === cleanId.toLowerCase()
    );
    return found || null;
  }

  async findByOrderNumber(orderNumber: string): Promise<IOrder | null> {
    return this.findById(orderNumber);
  }

  async findByRazorpayOrderId(razorpayOrderId: string): Promise<IOrder | null> {
    try {
      await connectDB();
      return OrderModel.findOne({ razorpayOrderId }).lean<IOrder>();
    } catch {
      const found = getBackupStore().find((o) => o.razorpayOrderId === razorpayOrderId);
      return found || null;
    }
  }

  async findByUserId(
    userId: string,
    page = 1,
    limit = 10,
    userEmail?: string
  ): Promise<{ items: IOrder[]; total: number }> {
    try {
      await connectDB();
      const skip = (page - 1) * limit;

      const userConditions: Record<string, unknown>[] = [{ user: userId }];
      if (mongoose.Types.ObjectId.isValid(userId)) {
        userConditions.push({ user: new mongoose.Types.ObjectId(userId) });
      }
      if (userEmail && userEmail.trim()) {
        userConditions.push({
          'shippingAddress.email': { $regex: new RegExp(`^${userEmail.trim()}$`, 'i') },
        });
      }

      const query = { $or: userConditions };

      const [items, total] = await Promise.all([
        OrderModel.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean<IOrder[]>(),
        OrderModel.countDocuments(query),
      ]);
      return { items, total };
    } catch {
      const emailLower = userEmail?.toLowerCase();
      const filtered = getBackupStore().filter(
        (o) =>
          String(o.user) === userId ||
          (emailLower && o.shippingAddress?.email?.toLowerCase() === emailLower)
      );
      const skip = (page - 1) * limit;
      return {
        items: filtered.slice(skip, skip + limit),
        total: filtered.length,
      };
    }
  }

  async updateStatus(id: string, status: OrderStatus, note?: string): Promise<IOrder | null> {
    const cleanId = id.replace(/^#/, '').trim();
    try {
      await connectDB();
      const query = mongoose.Types.ObjectId.isValid(cleanId)
        ? { _id: cleanId }
        : { orderNumber: cleanId };
      const doc = await OrderModel.findOneAndUpdate(
        query,
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
      if (doc) return doc;
    } catch {
      // Fallback
    }

    const found = getBackupStore().find(
      (o) => String(o._id) === cleanId || o.orderNumber.toLowerCase() === cleanId.toLowerCase()
    );
    if (found) {
      found.status = status;
      found.statusHistory = found.statusHistory || [];
      found.statusHistory.push({ status, timestamp: new Date(), note: note ?? '' });
      return found;
    }
    return null;
  }

  async updatePayment(
    id: string,
    data: {
      paymentStatus: IOrder['paymentStatus'];
      razorpayPaymentId?: string;
      razorpaySignature?: string;
    }
  ): Promise<IOrder | null> {
    try {
      await connectDB();
      return OrderModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<IOrder>();
    } catch {
      const found = getBackupStore().find((o) => String(o._id) === id);
      if (found) {
        found.paymentStatus = data.paymentStatus;
        if (data.razorpayPaymentId) found.razorpayPaymentId = data.razorpayPaymentId;
        if (data.razorpaySignature) found.razorpaySignature = data.razorpaySignature;
        return found;
      }
      return null;
    }
  }

  async findByIdAndPatchRzpOrderId(id: string, razorpayOrderId: string): Promise<void> {
    try {
      await connectDB();
      await OrderModel.findByIdAndUpdate(id, { $set: { razorpayOrderId } });
    } catch {
      const found = getBackupStore().find((o) => String(o._id) === id);
      if (found) {
        found.razorpayOrderId = razorpayOrderId;
      }
    }
  }

  async findAll(filters: {
    status?: OrderStatus;
    page?: number;
    limit?: number;
  }): Promise<{ items: IOrder[]; total: number }> {
    try {
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
    } catch {
      const store = getBackupStore();
      const filtered = filters.status ? store.filter((o) => o.status === filters.status) : store;
      const page = filters.page ?? 1;
      const limit = filters.limit ?? 20;
      const skip = (page - 1) * limit;
      return {
        items: filtered.slice(skip, skip + limit),
        total: filtered.length,
      };
    }
  }
}

export const orderRepository = new OrderRepository();
