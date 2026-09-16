import { Schema, model, models, type Document } from 'mongoose';

export interface IAuditLog extends Document {
  userName: string;
  userEmail: string;
  action: string;
  details: string;
  ip: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: String, required: true },
    ip: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

AuditLogSchema.index({ createdAt: -1 });

const AuditLog = models.AuditLog ?? model<IAuditLog>('AuditLog', AuditLogSchema);
export default AuditLog;
