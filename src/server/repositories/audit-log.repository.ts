import { connectDB } from '@/lib/db';
import AuditLog from '@/models/AuditLog';
import type { IAuditLog } from '@/models/AuditLog';

export class AuditLogRepository {
  async create(data: Pick<IAuditLog, 'userName' | 'userEmail' | 'action' | 'details' | 'ip'>): Promise<void> {
    await connectDB();
    await AuditLog.create(data);
  }

  async findRecent(limit = 100): Promise<IAuditLog[]> {
    await connectDB();
    return AuditLog.find({}).sort({ createdAt: -1 }).limit(limit).lean<IAuditLog[]>();
  }
}

export const auditLogRepository = new AuditLogRepository();
