/** Page-size choices offered on every admin list. */
export const ADMIN_PAGE_SIZES = [10, 20, 50, 100];

/** Hard ceiling on the page number, so a hand-typed URL cannot ask the database to skip millions of rows. */
const MAX_PAGE = 10000;

export interface PageParams {
  page: number;
  limit: number;
}

/**
 * Reads `?page=` and `?limit=` from a page's search params, falling back safely on anything invalid
 * (so `?page=abc`, `?page=-3` or `?limit=999999` can never reach the database).
 */
export function readPageParams(
  sp: { page?: string; limit?: string },
  defaultSize = 20,
  sizes: number[] = ADMIN_PAGE_SIZES
): PageParams {
  const page = Math.min(MAX_PAGE, Math.max(1, Math.floor(Number(sp.page)) || 1));
  const asked = Number(sp.limit);
  return { page, limit: sizes.includes(asked) ? asked : defaultSize };
}

/** Builds a list URL that keeps the other filters and sets the page (page 1 is left out for clean URLs). */
export function pageHref(basePath: string, params: Record<string, string | number | undefined>, page: number): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '' && key !== 'page') qs.set(key, String(value));
  }
  if (page > 1) qs.set('page', String(page));
  const query = qs.toString();
  return query ? `${basePath}?${query}` : basePath;
}
