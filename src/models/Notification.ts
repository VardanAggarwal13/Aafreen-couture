import { Schema, model, models, type Document, type Types } from 'mongoose';
import { NOTIFICATION_TYPES, type NotificationType } from '@/constants/notification.constants';

export interface INotification extends Document {
  /** Id of the account this notification belongs to. Every query is scoped by it. */
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  orderId?: Types.ObjectId;
  orderNumber?: string;
  /** Page the notification opens (e.g. the order's detail page). */
  link?: string;
  /** Null until the customer reads it. */
  readAt?: Date | null;
  /** The database deletes the notification automatically at this time (retention rule). */
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: String, required: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 500 },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    orderNumber: { type: String },
    link: { type: String },
    readAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// A customer's list, newest first, and the unread counter.
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ user: 1, readAt: 1 });
// One notification per customer, order and kind: repeated events (webhook retries) cannot duplicate it.
NotificationSchema.index(
  { user: 1, orderId: 1, type: 1 },
  { unique: true, partialFilterExpression: { orderId: { $exists: true } } }
);
// Automatic retention: MongoDB removes a document once its expiresAt time has passed.
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = models.Notification ?? model<INotification>('Notification', NotificationSchema);
export default Notification;
