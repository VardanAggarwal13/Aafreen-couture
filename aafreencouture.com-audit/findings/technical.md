# Technical SEO findings (source audit, 2026-10-30)

## High
1. robots.ts:~25 `'/returns'` is a prefix match and blocks /returns-policy (a sitemap URL). Fix: `'/returns$'` and `'/returns/'` (or `/returns/*`).
2. Soft-404 on bridal|suits|bags|ready-to-wear|occasions `/[subcategory]/page.tsx` (bridal:66-95): unknown slugs render 200, self-canonical, indexable, title-cased from slug. Fix: in generateMetadata AND page, `if (!info) notFound()` (add `import { notFound } from 'next/navigation'`) and add `export const dynamicParams = false` + generateStaticParams from the map keys. Note bridal map also has slugs not in sitemap (reception, engagement, mehendi, sangeet) that duplicate /occasions/* content; canonicalise or drop.
3. CSP (next.config.ts:~54-61) blocks Google Analytics: add https://www.googletagmanager.com to script-src; https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com to connect-src; https://www.google-analytics.com https://www.googletagmanager.com to img-src. Meta Pixel scripts already allowed.
4. product/[slug]/page.tsx:132-135: `catch { notFound() }` turns DB errors into 404s, cached by ISR (revalidate 120) and may deindex products. Fix: only notFound() when the service signals not-found; rethrow other errors.
5. /shop?page=N and filters (ShopClientPage.tsx:447-465): pagination via <button>, products fetched client-side via useQuery, so no crawlable links and no SSR product HTML. Fix: render page links as <Link href="/shop?page=N"> and SSR first page (or rely on category/collection pages for discovery). shop/page.tsx canonical is `/shop` for all params: acceptable; keep, and add `robots:{index:false,follow:true}` via generateMetadata when searchParams has sort/color/size/fabric/minPrice/maxPrice/page>1.

## Medium
6. collections/[slug]/page.tsx:~40 and blog/[slug]: missing item returns metadata only (title "Not Found"); page does notFound() (good) but add `robots:{index:false}` for safety.
7. robots.ts blocks /search and /track-order while those pages carry noindex/canonical: crawlers cannot see the noindex. Prefer removing /search from Disallow (keep noindex), or keep disallow and accept. track-order page has no noindex but is disallowed: add `robots:{index:false}`.
8. (auth)/login, register, verify-email: noindex inherited from (auth)/layout (OK). (account)/orders etc. covered by layout; /checkout and /checkout/success noindex (OK but `follow` unset, fine).
9. No x-robots-tag/noindex on /admin via headers: admin layout has noindex (OK).
10. CSP keeps 'unsafe-inline' + 'unsafe-eval' in script-src: weakens XSS protection; use nonce via middleware long-term.
11. next.config.ts:~79 `/images/:path*` cache 1 day; files are unhashed so SWR is OK, but raise to `max-age=2592000, stale-while-revalidate=86400` if filenames are versioned. Since loader is custom, `/_next/image` is unused: no action. Remote Cloudinary URLs that already contain transformations bypass f_auto/w_ (image-loader.ts:~25): they are served at fixed size with no srcset benefit.
12. Sitemap: lastModified `new Date()` on all static/subcategory/collection URLs (sitemap.ts) is a false freshness signal; use fixed dates or real updatedAt. priority/changeFrequency are ignored by Google (harmless). Products limited to 5000 (fine) but sitemap isn't split; fine until >50k.

## Low / OK
- www/non-www: no redirect in code; configure at host (Vercel domain redirect www -> apex) since canonicals use apex.
- Trailing slash: Next default (308 to no-slash), consistent with canonicals. OK.
- Redirects (next.config.ts) all permanent, single hop. middleware redirects /dashboard -> /orders (307; make permanent if legacy) and auth redirects (307, correct).
- hreflang: not needed (single en-IN site); html lang="en" -> consider `en-IN`.
- not-found.tsx: has one h1, links, returns 404 status. Add `robots:{index:false}` metadata. error.tsx present.
- Headings: one h1 on home (HeroSection motion.h1), catalogs, products, blog. ShopClientPage has two h1 in mutually exclusive branches (OK). Verify bridal category in /shop does not render both.
- ProductCard uses next/image with alt and sizes; priority only on first 4: good. MetaPixel noscript <img alt=""> is fine.
- GA/Meta use next/script afterInteractive (non-blocking); GA initial config sends page_path and the effect also fires pageview on route change: good. Both live inside Suspense in body, ok.
- Navbar/Footer use next/link (crawlable). Search and account menus are buttons (fine).
- Canonicals present on all indexable pages; none on login/register (noindex; OK).
