import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Notification from '@/models/Notification';
import { isDuplicateKeyError } from '@/lib/api-errors';
import type { INotification } from '@/models/Notification';
import type { NotificationType } from '@/constants/notification.constants';

export interface NotificationRecord {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  orderNumber?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NewNotification {
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  orderId?: string;
  orderNumber?: string;
  link?: string;
  expiresAt: Date;
}

type NotificationLean = Pick<INotification, 'type' | 'title' | 'message' | 'orderNumber' | 'link' | 'readAt' | 'createdAt'> & {
  _id: mongoose.Types.ObjectId;
};

function toRecord(doc: NotificationLean): NotificationRecord {
  return {
    _id: String(doc._id),
    type: doc.type,
    title: doc.title,
    message: doc.message,
    orderNumber: doc.orderNumber,
    link: doc.link,
    isRead: Boolean(doc.readAt),
    createdAt: new Date(doc.createdAt).toISOString(),
  };
}

/**
 * Every method takes the owner's user id and puts it in the database filter, so one customer can
 * never read, change or delete another customer's notifications, whatever id is passed in.
 * Expired rows are also filtered out here, because MongoDB's automatic cleanup runs only about once
 * a minute.
 */
export class NotificationRepository {
  private live(userId: string) {
    return { user: userId, expiresAt: { $gt: new Date() } };
  }

  /** Creates the notification unless this customer already has one of the same kind for this order. */
  async createOnce(data: NewNotification): Promise<void> {
    await connectDB();
    const { orderId, ...rest } = data;
    try {
      if (orderId && mongoose.isValidObjectId(orderId)) {
        const orderObjectId = new mongoose.Types.ObjectId(orderId);
        await Notification.updateOne(
          { user: data.user, orderId: orderObjectId, type: data.type },
          { $setOnInsert: { ...rest, orderId: orderObjectId, readAt: null } },
          { upsert: true }
        );
      } else {
        await Notification.create({ ...rest, readAt: null });
      }
    } catch (error) {
      if (!isDuplicateKeyError(error)) throw error; // a concurrent duplicate is fine
    }
  }

  async findByUser(userId: string, page: number, limit: number): Promise<{ items: NotificationRecord[]; total: number }> {
    await connectDB();
    const filter = this.live(userId);
    const [docs, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<NotificationLean[]>(),
      Notification.countDocuments(filter),
    ]);
    return { items: docs.map(toRecord), total };
  }

  async countUnread(userId: string): Promise<number> {
    await connectDB();
    return Notification.countDocuments({ ...this.live(userId), readAt: null });
  }

  /** Marks one notification read/unread. Returns false if it does not exist or is not this user's. */
  async setRead(userId: string, id: string, read: boolean): Promise<boolean> {
    if (!mongoose.isValidObjectId(id)) return false;
    await connectDB();
    const result = await Notification.updateOne(
      { _id: id, user: userId },
      { $set: { readAt: read ? new Date() : null } }
    );
    return result.matchedCount > 0;
  }

  async markAllRead(userId: string): Promise<number> {
    await connectDB();
    const result = await Notification.updateMany({ ...this.live(userId), readAt: null }, { $set: { readAt: new Date() } });
    return result.modifiedCount;
  }

  /** Deletes one notification. Returns false if it does not exist or is not this user's. */
  async remove(userId: string, id: string): Promise<boolean> {
    if (!mongoose.isValidObjectId(id)) return false;
    await connectDB();
    const result = await Notification.deleteOne({ _id: id, user: userId });
    return result.deletedCount > 0;
  }

  async removeAll(userId: string): Promise<number> {
    await connectDB();
    const result = await Notification.deleteMany({ user: userId });
    return result.deletedCount;
  }
}

export const notificationRepository = new NotificationRepository();
