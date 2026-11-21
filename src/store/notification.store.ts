import { create } from 'zustand';

interface NotificationStore {
  /** Live unread count, or null until a screen has reported one. */
  unread: number | null;
  setUnread: (count: number) => void;
}

/**
 * Lets the Notifications screen tell the account sidebar's badge about changes immediately, instead
 * of waiting for a server round trip. The server-rendered count is still the starting value.
 */
export const useNotificationStore = create<NotificationStore>((set) => ({
  unread: null,
  setUnread: (count) => set({ unread: count }),
}));
