/** Audit records are deleted automatically this many days after they are written. */
export const AUDIT_LOG_RETENTION_DAYS = 30;

export const AUDIT_LOG_RETENTION_SECONDS = AUDIT_LOG_RETENTION_DAYS * 24 * 60 * 60;

/** Name of the database index that performs the automatic deletion. */
export const AUDIT_LOG_TTL_INDEX_NAME = 'audit_createdAt_ttl';

/** Most records shown on the Audit Logs page. */
export const AUDIT_LOG_PAGE_LIMIT = 200;
