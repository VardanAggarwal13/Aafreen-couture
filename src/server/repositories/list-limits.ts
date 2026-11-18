/**
 * Safety ceiling for list queries that return a whole collection (admin lists, public blog index).
 * It keeps a response and a database read bounded even if a collection grows far beyond what the
 * screen was designed for. Collections that can grow large (products, orders, users) are paginated.
 */
export const ADMIN_LIST_CAP = 500;
