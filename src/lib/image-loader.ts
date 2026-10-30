import type { ImageLoaderProps } from 'next/image';

const CLOUDINARY_HOST = 'res.cloudinary.com';
const UNSPLASH_HOSTS = ['images.unsplash.com', 'plus.unsplash.com'];

/**
 * Serves resized, modern-format images straight from the CDN that already hosts
 * them (Cloudinary / Unsplash) instead of Next's own optimizer. Local files in
 * /public and anything unrecognised are returned untouched, so existing media
 * keeps rendering exactly as before.
 *
 * Cloudinary: `c_limit` only ever downsizes (never upscales or crops, aspect
 * ratio is preserved); `f_auto` serves AVIF/WebP where supported; `q_auto`
 * picks quality (the `best` tier is used when a component asks for quality >= 90).
 */
export default function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (/\.(svg|gif)(\?|$)/i.test(src)) return src;
  // Local files in /public are served as-is; the width query is ignored by the static
  // server and only lets Next see a width-aware loader (otherwise it warns in dev).
  if (src.startsWith('/')) return src.includes('?') ? src : `${src}?w=${width}`;
  if (!/^https?:\/\//.test(src)) return src;

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return src;
  }

  if (url.hostname === CLOUDINARY_HOST) {
    const marker = '/upload/';
    const idx = url.pathname.indexOf(marker);
    if (idx === -1) return src;
    const rest = url.pathname.slice(idx + marker.length);
    // Only touch plain `/upload/v123/...` URLs. Anything that already carries
    // transformations is the author's intent and is left alone.
    if (!/^v\d+\//.test(rest)) return src;
    const q = (quality ?? 75) >= 90 ? 'q_auto:best' : 'q_auto';
    url.pathname = `${url.pathname.slice(0, idx + marker.length)}f_auto,${q},c_limit,w_${width}/${rest}`;
    return url.toString();
  }

  if (UNSPLASH_HOSTS.includes(url.hostname)) {
    url.searchParams.set('w', String(width));
    url.searchParams.set('q', String(quality ?? 75));
    url.searchParams.set('auto', 'format');
    return url.toString();
  }

  return src;
}
