import { connectDB } from '@/lib/db';
import AuditLog from '@/models/AuditLog';
import type { IAuditLog } from '@/models/AuditLog';
import {
  AUDIT_LOG_RETENTION_DAYS,
  AUDIT_LOG_RETENTION_SECONDS,
  AUDIT_LOG_TTL_INDEX_NAME,
} from '@/constants/audit.constants';

let retentionReady: Promise<void> | null = null;

type IndexCapableCollection = {
  collectionName: string;
  conn: { db?: { command: (cmd: Record<string, unknown>) => Promise<unknown> } };
  createIndex: (keys: Record<string, 1 | -1>, options: Record<string, unknown>) => Promise<unknown>;
};

/** Creates the TTL index on the collection, or updates its retention in place if it already exists with another value. */
export async function applyRetentionIndex(collection: IndexCapableCollection): Promise<void> {
  try {
    await collection.createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: AUDIT_LOG_RETENTION_SECONDS, name: AUDIT_LOG_TTL_INDEX_NAME }
    );
  } catch (error) {
    const code = (error as { code?: number }).code;
    if (code === 85 || code === 86) {
      // Same index, different retention: change it in place.
      await collection.conn.db!.command({
        collMod: collection.collectionName,
        index: { name: AUDIT_LOG_TTL_INDEX_NAME, expireAfterSeconds: AUDIT_LOG_RETENTION_SECONDS },
      });
    } else {
      throw error;
    }
  }
}

/**
 * Makes sure the automatic-deletion index exists with the configured retention. It is normally already
 * there; this is the safety net for a fresh database (without it nothing would ever expire) and for a
 * changed AUDIT_LOG_RETENTION_DAYS (an existing TTL index is updated in place). Runs once per process
 * and never throws: a failure is logged and retried on the next call.
 */
function ensureRetention(): Promise<void> {
  if (!retentionReady) {
    retentionReady = (async () => {
      await connectDB();
      await applyRetentionIndex(AuditLog.collection as unknown as IndexCapableCollection);
    })().catch((error) => {
      console.error('[AuditLog] Could not verify the retention index:', error);
      retentionReady = null; // try again next time
    });
  }
  return retentionReady;
}

/** Records older than this are due for deletion (and are hidden even before the database removes them). */
function cutoff(): Date {
  return new Date(Date.now() - AUDIT_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000);
}

export class AuditLogRepository {
  async create(data: Pick<IAuditLog, 'userName' | 'userEmail' | 'action' | 'details' | 'ip'>): Promise<void> {
    await connectDB();
    await ensureRetention();
    await AuditLog.create(data);
  }

  /** Newest first, within the retention window only. */
  async findRecent(limit = 100): Promise<IAuditLog[]> {
    await connectDB();
    await ensureRetention();
    return AuditLog.find({ createdAt: { $gte: cutoff() } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean<IAuditLog[]>();
  }

  /** One page of the newest-first listing, within the retention window only. */
  async findPage(page: number, limit: number): Promise<IAuditLog[]> {
    await connectDB();
    await ensureRetention();
    return AuditLog.find({ createdAt: { $gte: cutoff() } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean<IAuditLog[]>();
  }

  /** How many records are currently within the retention window. */
  async countRecent(): Promise<number> {
    await connectDB();
    return AuditLog.countDocuments({ createdAt: { $gte: cutoff() } });
  }
}

export const auditLogRepository = new AuditLogRepository();
