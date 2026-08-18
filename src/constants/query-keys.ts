export const queryKeys = {
  products: {
    all: ['products'] as const,
    list: (filters: Record<string, unknown>) => ['products', 'list', filters] as const,
    detail: (slug: string) => ['products', 'detail', slug] as const,
    variants: (id: string) => ['products', 'variants', id] as const,
    related: (id: string) => ['products', 'related', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: () => ['categories', 'list'] as const,
    detail: (slug: string) => ['categories', 'detail', slug] as const,
  },
  collections: {
    all: ['collections'] as const,
    list: () => ['collections', 'list'] as const,
    detail: (slug: string) => ['collections', 'detail', slug] as const,
  },
  cart: {
    key: ['cart'] as const,
  },
  wishlist: {
    key: ['wishlist'] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (userId: string) => ['orders', 'list', userId] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },
  reviews: {
    list: (productId: string) => ['reviews', 'list', productId] as const,
  },
  search: {
    results: (q: string) => ['search', q] as const,
    suggestions: (q: string) => ['search', 'suggestions', q] as const,
  },
  admin: {
    analytics: ['admin', 'analytics'] as const,
    orders: ['admin', 'orders'] as const,
    customers: ['admin', 'customers'] as const,
    inventory: ['admin', 'inventory'] as const,
    coupons: ['admin', 'coupons'] as const,
    banners: ['admin', 'banners'] as const,
    reviews: ['admin', 'reviews'] as const,
    returns: ['admin', 'returns'] as const,
    auditLogs: ['admin', 'audit-logs'] as const,
  },
} as const;
