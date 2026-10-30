# Schema audit (source-level), 2026-10-30

## Critical / High
1. HIGH src/utils/seo.ts ~L84-95 shippingDetails: rate 0 INR for all, handling 1-3d, transit 2-5d, domestic only. /shipping-policy says: free only >= INR 5,000, else flat INR 149; handling 1-2 bd (ready) or 15-25 bd (bespoke); transit 5-7 bd; intl 10-15 bd. Mismatch = Merchant Center/Google policy violation (misleading). Fix: derive rate from price, correct days, add intl block.
2. HIGH seo.ts ~L97-104 MerchantReturnPolicy: FreeReturn + ReturnByMail + 7 days. Policy = 7-day SIZE EXCHANGE (not refund return) for eligible RTW; first exchange free; bespoke/ineligible categories non-exchangeable; refund only on refused parcels. Fix: returnPolicyCategory MerchantReturnFiniteReturnWindow only for eligible RTW with returnFees OriginalShippingFees/ReturnShippingFees per policy; for bespoke/ineligible products use MerchantReturnNotPermitted. Add refundType ExchangeRefund and returnPolicySeasonalOverride none. Link: merchantReturnLink https://aafreencouture.com/returns-policy.
3. HIGH seo.ts L44/L69 price: basePrice/100 is correct (paise->INR) BUT variants ignored. Offers with variant prices/stock: emit AggregateOffer (lowPrice/highPrice/offerCount) or ProductGroup + hasVariant (size/color, per-variant sku/price/availability). Current: single price = basePrice while pages show variant prices -> price mismatch risk. Also comparePrice unused (optional priceSpecification with strikethrough: UnitPriceSpecification priceType ListPrice).
4. HIGH seo.ts L36: priceValidUntil = now+365d, regenerated every request; fabricated rolling date. Remove (optional property) unless a real sale end date exists.
5. MED seo.ts L53-54: sku=slug, mpn=_id are internal; mpn should be real manufacturer part no. or omit; use sku = variant/inventory sku; add gtin only if real. Remove mpn.
6. MED seo.ts L33: availability only In/OutOfStock; bespoke made-to-order -> consider PreOrder/BackOrder? (stay InStock if truthful). Dispatch 15-25bd is not reflected.
7. MED seo.ts L66 'seller' Organization lacks @id; use {"@id": ".../#organization"}. brand Organization fine.
8. MED aggregateRating: correctly gated on real reviews (good). Strings OK but use numbers. Add individual Review[] if reviews rendered visibly.
9. MED description fallback "handcrafted by master artisans" generic: fine; but product.description.slice(0,250) may include HTML - strip.

## Site graph (src/app/layout.tsx L40-85)
- MED @type ['Organization','ClothingStore'] with address lacking streetAddress/postalCode/telephone. Contact page has SCO No. 43, 1st Floor, B-Block Market, New Amritsar, Punjab 143001. Add streetAddress, postalCode, geo, openingHoursSpecification (only real hours), priceRange omitted unless real, areaServed.
- MED Organization duplicated in root layout head for every page incl. noindex/admin; acceptable, but WebSite.inLanguage 'en-IN' and Organization sameAs only Instagram (add Facebook/Pinterest/YouTube if real; don't invent).
- LOW SearchAction: Google no longer shows sitelinks search box; /search is noindex. Harmless; keep or remove. target should use EntryPoint urlTemplate form.
- LOW ContactPoint telephone "+91 95179 01117" ok; add areaServed IN, contactType 'customer support'.
- LOW logo.webp: Google logo guidelines prefer PNG/JPG/SVG/WebP ok; ensure >=112x112.
Suggested:
```json
{"@type":["Organization","ClothingStore"],"@id":"https://aafreencouture.com/#organization","name":"Aafreen Couture","url":"https://aafreencouture.com","telephone":"+91 95179 01117","address":{"@type":"PostalAddress","streetAddress":"SCO No. 43, 1st Floor, B-Block Market, New Amritsar","addressLocality":"Amritsar","addressRegion":"Punjab","postalCode":"143001","addressCountry":"IN"},"areaServed":["IN","US","GB","CA","AE"]}
```

## Pages
- Blog (blog/[slug]/page.tsx L47-62) MED: dateModified = datePublished (fake freshness) -> use real updatedAt; author Person lacks url; publisher lacks @id/url; image single (give array); headline ok (<110 chars check). Add Blog/ CollectionPage on /blog index.
- FAQ (faq/page.tsx L95-103) INFO: FAQPage rich results retired for all sites (May 2026). No SERP benefit; harmless, can keep or remove; do not expand. If kept ensure answers match visible text.
- Collections (collections/[slug]/page.tsx L96) and CategoryHubView L160, CoutureCatalogView L151: only BreadcrumbList. MED: add CollectionPage + ItemList (ItemList is not a standalone rich result for collections; use for entity clarity, list top ~24 products with url/name/image, no Offer duplication).
- Breadcrumb product (product page L108): category crumb href is /shop?category=slug (query URL; not canonical). Prefer canonical category path (/bridal etc.). Last crumb lacks item (fine). 
- About/Contact: no schema. Add AboutPage / ContactPage with mainEntity {"@id": org}.
- Returns/Shipping pages: no schema; optional none. Do not add HowTo/SpecialAnnouncement.
- JSON.stringify in dangerouslySetInnerHTML: escape '<' (replace(/</g,'\u003c')) to prevent XSS via CMS/product text (MED, all sites: layout, product, blog, faq).

## Proposed code (seo.ts)
```ts
const inr = (p:number)=> (p/100).toFixed(2);
const prices = (product.variants??[]).filter(v=>v.isActive!==false).map(v=>v.price);
const offer = prices.length>1 && Math.min(...prices)!==Math.max(...prices)
 ? {'@type':'AggregateOffer',priceCurrency:'INR',lowPrice:inr(Math.min(...prices)),highPrice:inr(Math.max(...prices)),offerCount:prices.length}
 : {'@type':'Offer',priceCurrency:'INR',price:inr(prices[0]??product.basePrice)};
// shippingRate: price>=5000_00 ? 0 : 149 ; handling 1-2 (RTW) / 15-25 (bespoke); transit 5-7 d (unitCode 'DAY')
// Remove priceValidUntil, mpn. Return policy per category (see item 2).
```
Note unitCode for days: use 'DAY' (UN/CEFACT 'DAY'), 'd' is not valid.
Collection:
```json
{"@context":"https://schema.org","@type":"CollectionPage","name":"...","url":"...","mainEntity":{"@type":"ItemList","itemListElement":[{"@type":"ListItem","position":1,"url":"https://aafreencouture.com/product/slug"}]}}
```
