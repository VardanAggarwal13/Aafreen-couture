export interface ApiFieldError {
  path: string;
  message: string;
}

/**
 * Extracts per-field validation messages from an API error response (the `details` array
 * `handleApiError` attaches for ZodError responses) so they can be mapped onto the specific
 * form field that failed, instead of showing one generic "Validation failed" toast.
 */
export function extractFieldErrors(body: unknown): ApiFieldError[] {
  if (
    body &&
    typeof body === 'object' &&
    'details' in body &&
    Array.isArray((body as { details: unknown }).details)
  ) {
    return (body as { details: { path: (string | number)[]; message: string }[] }).details
      .filter((issue) => Array.isArray(issue.path) && issue.path.length > 0)
      .map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
  }
  return [];
}

/** Tailwind classes to append to an input's base classes when it has a validation error. */
export const FIELD_ERROR_CLASS = 'border-red-500 focus:border-red-500 ring-1 ring-red-200';
