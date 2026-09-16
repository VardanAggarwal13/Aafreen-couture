import mongoose, { Schema, model, models, type Document } from 'mongoose';

export type ReturnStatus = 'under_review' | 'approved' | 'rejected' | 'refunded';

export interface IReturn extends Document {
  order: mongoose.Types.ObjectId;
  orderNumber: string;
  customerName: string;
  productName: string;
  quantity: number;
  reason: string;
  refundAmount: number; // paise
  status: ReturnStatus;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReturnSchema = new Schema<IReturn>(
  {
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    orderNumber: { type: String, required: true },
    customerName: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    reason: { type: String, required: true, trim: true },
    refundAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['under_review', 'approved', 'rejected', 'refunded'], default: 'under_review' },
    adminNote: { type: String },
  },
  { timestamps: true }
);

ReturnSchema.index({ order: 1 });
ReturnSchema.index({ status: 1 });

const Return = models.Return ?? model<IReturn>('Return', ReturnSchema);
export default Return;
