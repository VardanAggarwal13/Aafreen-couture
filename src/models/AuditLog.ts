import { Schema, model, models, type Document } from 'mongoose';
import {
  AUDIT_LOG_RETENTION_SECONDS,
  AUDIT_LOG_TTL_INDEX_NAME,
} from '@/constants/audit.constants';

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

// Retention: MongoDB itself deletes each record AUDIT_LOG_RETENTION_DAYS after createdAt. This single
// index also serves the newest-first listing. (The audit-log repository re-checks it at runtime.)
AuditLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: AUDIT_LOG_RETENTION_SECONDS, name: AUDIT_LOG_TTL_INDEX_NAME }
);

const AuditLog = models.AuditLog ?? model<IAuditLog>('AuditLog', AuditLogSchema);
export default AuditLog;
