/**
 * Shared look for the sign-in and register screens, so both always use the same card, spacing,
 * type scale and controls. Type sizes follow the rest of the storefront: text-xs labels,
 * text-sm inputs and body copy.
 */

/** Outer wrapper: no floating card, the screen is split edge to edge under the header. */
export const AUTH_WRAP = 'flex-1 flex';

export const AUTH_CARD = 'w-full grid grid-cols-1 lg:grid-cols-12';

export const AUTH_PANEL =
  'lg:col-span-7 px-5 py-8 sm:px-10 sm:py-10 lg:px-14 xl:px-20 2xl:px-28 [@media(max-height:48rem)]:py-2 [@media(max-height:48rem)]:sm:py-2 flex flex-col justify-center';

export const AUTH_FORM_WIDTH = 'max-w-lg w-full mx-auto';

export const AUTH_MODE_SWITCH =
  'mb-5 [@media(max-height:48rem)]:mb-2 inline-flex rounded-full border border-border bg-surface/60 p-1 text-[0.6875rem] font-semibold uppercase tracking-[0.18em]';
export const AUTH_MODE_ACTIVE = 'rounded-full bg-heading px-4 py-1.5 text-surface';
export const AUTH_MODE_LINK = 'rounded-full px-4 py-1.5 text-text transition-colors hover:text-heading';

export const AUTH_TITLE =
  'font-serif text-3xl sm:text-[2rem] [@media(max-height:48rem)]:text-xl [@media(max-height:48rem)]:sm:text-xl leading-tight text-heading';
export const AUTH_SUBTITLE = 'mt-1 mb-5 [@media(max-height:48rem)]:hidden text-xs sm:text-sm leading-relaxed text-text';

export const AUTH_LABEL = 'mb-1.5 [@media(max-height:48rem)]:mb-1 block text-xs font-semibold text-heading';
export const AUTH_INPUT =
  'w-full h-11 [@media(max-height:48rem)]:h-9 rounded-xl border bg-surface pl-11 pr-4 text-sm text-heading placeholder:text-text/50 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/30';
export const AUTH_INPUT_OK = 'border-heading/20 focus:border-gold';
export const AUTH_INPUT_ERR = 'border-red-400';
export const AUTH_FIELD_ICON =
  'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text/70';
export const AUTH_ERROR = 'mt-1.5 text-xs text-red-700';

export const AUTH_SUBMIT =
  'group flex h-12 [@media(max-height:48rem)]:h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-heading text-xs font-semibold uppercase tracking-[0.2em] text-surface shadow-sm transition-colors duration-300 hover:bg-[#3D2E25] disabled:cursor-not-allowed disabled:opacity-60';

export const AUTH_DIVIDER =
  'my-4 [@media(max-height:48rem)]:my-2 flex items-center gap-4 text-[0.6875rem] uppercase tracking-[0.18em] text-text';

export const AUTH_GOOGLE =
  'flex h-11 [@media(max-height:48rem)]:h-9 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-heading/20 bg-transparent text-sm font-medium text-heading transition-colors hover:border-heading/50 hover:bg-heading/5 disabled:cursor-not-allowed disabled:opacity-60';

export const AUTH_SWITCH_NOTE = 'mt-4 [@media(max-height:48rem)]:mt-2 text-center text-xs sm:text-sm text-text';
export const AUTH_SWITCH_LINK =
  'font-semibold text-heading underline underline-offset-4 transition-colors hover:text-gold-ink';
