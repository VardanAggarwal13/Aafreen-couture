import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

const BASE_URL = '/api';

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('/api/') || endpoint.startsWith('/api?') || endpoint === '/api'
    ? endpoint
    : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.error ?? data?.message ?? `Request failed with status ${res.status}`);
  }

  return data as ApiResponse<T>;
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, unknown>): Promise<ApiResponse<T>> => {
    const url = params
      ? `${endpoint}?${new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)])
        )}`
      : endpoint;
    return request<T>(url);
  },

  post: <T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  patch: <T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(endpoint: string): Promise<ApiResponse<T>> =>
    request<T>(endpoint, { method: 'DELETE' }),

  getPaginated: <T>(
    endpoint: string
  ): Promise<PaginatedResponse<T>> =>
    request<T[]>(endpoint, {}) as Promise<PaginatedResponse<T>>,
};
