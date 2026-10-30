# E-commerce SEO findings - aafreencouture.com (source-level, static analysis)
Paths relative to src/. Data source: On-page/source analysis (static); no DataForSEO used.
Scores: Schema 62/100, Images 78/100, Content/Reviews 45/100, Listing crawlability 35/100, Overall 52/100.

## CRITICAL
1. app/robots.ts:25 `/returns` is a prefix rule and also blocks /returns-policy. Merchant Center and Google must crawl the return policy. Fix: change to `/returns$` (the account page is behind auth anyway); keep /returns-policy crawlable.
2. Listings are client-rendered. features/shop/components/ShopClientPage.tsx:94 (useQuery to /api/products), components/shop/CoutureCatalogView.tsx:100, CategoryHubView.tsx:54, features/search/components/SearchPageClient.tsx:34. app/(shop)/shop/page.tsx:22 wraps in Suspense with an empty fallback because of useSearchParams, so /shop initial HTML has no products, no h1, no product links. Same for /bridal, /suits, /ready-to-wear, /bags and subcategories (no initial data). Only /collections/[slug] is server-rendered. Fix: make each page.tsx an async server component calling productService.getProducts(...); pass `initialData` to useQuery; read category/page from the `searchParams` prop; render a server h1 and plain anchor grid; add rel prev/next or crawlable ?page=N links.
3. Fake social proof: features/product/components/ProductDetailClient.tsx:371-375 hardcodes "5.0", `reviewCount || 24 client reviews`, `averageRating || 5` stars. No reviews are rendered. Fix: render only when product.reviewCount > 0 with the real averageRating; otherwise hide. Add a visible review list (IReview exists) so AggregateRating in utils/seo.ts is backed by on-page reviews.

## HIGH
4. Return policy schema contradicts the policy page. utils/seo.ts:105-111 declares FiniteReturnWindow, 7 days, ReturnByMail, FreeReturn. Policy = 7-day SIZE EXCHANGE only; bespoke non-returnable; refund only for refused parcels. Fix: add `refundType: 'https://schema.org/ExchangeRefund'`, set returnFees to match policy, use MerchantReturnNotPermitted for made-to-measure items. Mirror in Merchant Center return settings.
5. Shipping schema contradicts policy. utils/seo.ts:92-101: handling 1-3d, transit 2-5d. Shipping policy: RTW dispatch 1-2 days, bespoke 15-25 days, domestic transit 5-7 days. PDP accordion (ProductDetailClient.tsx:661) says dispatch 3-5 / bespoke 10-14. Three sources disagree. Fix: one shared constants module; transit min 5 max 7; handling by product type. Free shipping value 0 is consistent (free above Rs 5,000; all items >= Rs 25,000). Policy also ships to 50+ countries; schema is IN only (fine if the feed matches).
6. Breadcrumb target: ProductDetailClient.tsx:188 and product/[slug]/page.tsx:112 link to `/shop?category=slug`, which canonicalizes to /shop and is client-rendered. Fix: helper mapping category slug to real hub: bridal-lehengas -> /bridal/bridal-lehengas, bridal-suits, bridesmaid-lehengas, reception-gowns -> /bridal/<slug>; cotton-kurta-sets, co-ord-sets, summer-essentials, partywear-unstitched, indo-western -> /suits/<slug>; custom-embroidered-suits -> /suits/handcrafted-luxury; dresses, occasion-lehengas -> /ready-to-wear/<slug>; sharara -> /ready-to-wear/sharara-sets; handbags, potlis, clutches, totes, shoulder-bags -> /bags/<slug>. Use for both the visible nav and BreadcrumbList.
7. Slug mismatches between sitemap and category data: sitemap lists /ready-to-wear/sharara-sets (category 'sharara-sets' vs filter slug 'sharara'), /ready-to-wear/new-arrivals, /ready-to-wear/signature-co-ords, /bridal/haldi (category vs occasion). Unknown [subcategory] slugs render 200 with an auto title (no notFound()). Fix: whitelist keys in each [subcategory] page and call notFound() otherwise; only list slugs in the sitemap that return >0 products.
8. product/[slug]/page.tsx:133 `catch { notFound() }` with revalidate=120 can cache a 404 for a live product during a DB blip. Fix: notFound() only for NotFoundError; rethrow others.
9. No per-category canonical/noindex strategy: shop/page.tsx:12 static canonical /shop. After fix #2 add generateMetadata: canonical to the matching hub path for ?category=, noindex,follow for sort/color/size/price and page>1 combinations.

## MEDIUM
10. Product schema gaps (utils/seo.ts): no gtin (add gtin13 if barcodes exist; otherwise brand+mpn is acceptable); sku = slug (use active variant sku); mpn = Mongo _id (use real design code); price from basePrice only (line 50), variant price/colour/size ignored (add AggregateOffer or one Offer per variant with sku, color, size, material); priceValidUntil rolls forward each revalidate (use fixed date or drop); add top-level color/material. Stock logic: ProductDetailClient.tsx:55 defaults `stock ?? 1`, and products without variants never show OOS; add product-level stock.
11. No ItemList schema anywhere (collections/[slug]/page.tsx, CoutureCatalogView, CategoryHubView). Fix: buildItemListJsonLd(products) with ListItem position, url /product/slug, name, image for the first 24 products, on server-rendered collection and category pages.
12. Related products (product/[slug]/page.tsx:96-105) fall back to random featured products when the category has none and show only 4. Add "More from {category}" link and link to the product's collection page.
13. Images: good overall (multiple images, descriptive alt at ProductDetailClient.tsx:224,246,902, secondary hover image, webp, priority on first image). Gaps: lightbox thumbnails alt `Thumbnail N` (:941); ProductCard.tsx:27 fallback image is another product (shahi-sindoori) used for imageless products; quality={95} on cards (use 75-80).
14. Out-of-stock: inactive products 404 (discontinued bridal pieces lose equity; consider 200 + OutOfStock + related items). OOS variants disabled in UI (:478), button label "Out of Stock" (:530). Sitemap only includes active products.
15. Search is noindex and robots-disallowed (fine; disallow hides the noindex, harmless).
16. sitemap.ts uses new Date() as lastModified for static, collection and category routes; use real updatedAt.

## LOW
17. Returns policy copy says "Aafreen Couture By Pearl", inconsistent with Brand "Aafreen Couture" in schema.
18. PDP og:type is website (page.tsx:52); consider product og tags (product:price:amount/currency).
19. Meta description padding (page.tsx:39) repeats the same shipping tail across products.

## Quick-win order
robots /returns fix, remove fake rating, server-render /shop and hubs with initialData, fix returns/shipping schema, breadcrumb targets, slug whitelist/sitemap, ItemList, gtin/variants.
