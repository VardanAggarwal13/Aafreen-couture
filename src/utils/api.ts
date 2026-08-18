import type { ApiResponse, PaginatedResponse } from '@/types/api.types';

const BASE_URL = '/api';

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? 'Request failed');
  }

  return data;
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
