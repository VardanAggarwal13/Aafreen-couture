# GEO / AI Search Readiness — aafreencouture.com (source-level audit)

Audit date: 2026-10-30. Method: static review of the Next.js source only. No live fetch, so the robots.txt and HTML that are actually deployed were not checked.

## GEO Readiness Score: 52 / 100

| Dimension | Weight | Score | Notes |
|---|---|---|---|
| Citability | 25% | 55 | FAQ and policy pages have good facts, but the facts contradict each other and the FAQ answers are hidden from the HTML |
| Structural Readability | 20% | 55 | Pages use H2 sections, but headings are not questions, and blog posts have no H2s and are only about 100–150 words |
| Multi-Modal | 15% | 60 | Has images and alt text from titles. No video, no size-chart table, no comparison tables |
| Authority & Brand | 20% | 40 | `sameAs` lists Instagram only. Schema address has no street or postcode. Author entities are not linked |
| Technical Accessibility | 20% | 50 | Info and policy pages are server-rendered. All category/product grids are fetched client-side |

Platform estimates: Google AIO 50, ChatGPT 45, Perplexity 50, Bing Copilot 45. All four are held back by the client-rendered catalog and the conflicting policy facts.

## AI crawler access (src/app/robots.ts:8-35)
There is only a `*` rule (allow `/`, disallow private routes). Every AI bot is therefore allowed implicitly, and none has an explicit rule.
- Search and citation bots: OAI-SearchBot, Claude-SearchBot, PerplexityBot, ChatGPT-User, Perplexity-User. Implicitly allowed. **Add explicit allow rules.**
- Training-only bots: GPTBot, ClaudeBot, CCBot, Applebot-Extended, cohere-ai. Implicitly allowed. This is a business choice.
- Google-Extended controls Gemini training and grounding only. Google Search and AI Overviews inclusion follows Googlebot.

Fix: add these entries before the `*` rule.
```ts
{ userAgent: ['OAI-SearchBot','ChatGPT-User','Claude-SearchBot','Claude-User','PerplexityBot','Perplexity-User','Googlebot','Bingbot'], allow: '/', disallow: PRIVATE },
{ userAgent: ['GPTBot','ClaudeBot','Google-Extended','Applebot-Extended','CCBot'], allow: '/', disallow: PRIVATE }, // or disallow:'/' to opt out of training
```
Pull the existing disallow array out into a shared `PRIVATE` constant so every rule uses it. Bots follow only the most specific user-agent group that matches them, so each group must repeat the disallows.

## llms.txt (public/llms.txt): present, now improved
Changes made:
- Removed "Complimentary express shipping across India" from the summary, because the shipping-policy page contradicts it (see C1).
- Added a "Brand facts" block: full atelier address taken from contact/page.tsx:125, service languages, techniques and fabrics.
- Added a "Key policies" block: COD limit of ₹50,000, dispatch and craft timelines, international coverage, exchange, refund and cancellation windows. Every value comes from the FAQ and policy pages.
- Completed the subcategory lists (suits: summer essentials, handcrafted luxury; RTW: new arrivals; bags: shoulder bags).
- Added links to the 4 Journal articles.

Left out on purpose: the founder name "Pearl Kapoor". It appears only in the fallback blog data (src/data/blog.data.ts:20), so it needs confirming before it is published as an entity fact.

## Findings

### Critical
**C1. Shipping facts contradict each other across 4 sources.** AI engines either drop or hedge facts that conflict.
- src/config/site.config.ts:24 and server/services/order.service.ts:117 set the threshold to 0, so shipping is free on every order.
- app/(info)/shipping-policy/page.tsx:101 and :206 say "Free above ₹5,000, flat ₹149 below".
- features/product/components/ProductDetailClient.tsx (shipping accordion, about line 661) says "Dispatch within 3-5 business days, bespoke 10-14".
- The FAQ and shipping policy say dispatch takes 1–2 days and bespoke takes 15–25 days.
- utils/seo.ts (about lines 89-100) has handlingTime 1–3 days and transitTime 2–5 days, but the policy says 5–7.

Fix: decide which values are correct and put them in one `shippingPolicy` constant in site.config.ts. Make all four places read from it.

**C2. Category and listing pages render no products in the initial HTML.** components/shop/CategoryHubView.tsx:54 and components/shop/CoutureCatalogView.tsx:100 fetch products with `useQuery`, and nothing is prefetched or hydrated from the server. AI crawlers that don't run JavaScript see empty grids on /bridal, /suits, /ready-to-wear, /occasions and every subcategory page. This also breaks CLAUDE.md §4.2 ("Never fetch data in Client Components").

Fix: in each page.tsx, call `productService` on the server and pass the result as `initialData`, or use `HydrationBoundary` with `dehydrate`.

### High
**H1. FaqAccordion only puts the first answer in the HTML.** features/faq/components/FaqAccordion.tsx:138 uses `{isOpen && (<div>…<p>{item.a}</p>)}`, and line 19 opens only the first item. That leaves 13 of the 14 answers in JSON-LD only, so the visible text and the schema don't match.

Fix: always render the answers, using `<details>/<summary>` or `hidden={!isOpen}`. The search filter can keep hiding items with the `hidden` attribute instead of unmounting them.

Same problem: ProductDetailClient.tsx:682 (`accordionOpen === key &&`) hides the care, shipping and returns text on product pages. Apply the same fix.

**H2. Thin entity graph.** app/layout.tsx:53-59.
- `sameAs` contains Instagram only.
- `address` has no `streetAddress` or `postalCode`, although contact/page.tsx:125 has the full address.
- No `telephone` at the top level, no `geo`, no `founder`, no `alternateName`.

Fix: add `alternateName: 'Aafreen Couture By Pearl'`, `streetAddress: 'SCO No. 43, 1st Floor, B-Block Market, New Amritsar'`, `postalCode: '143001'`, plus every real profile URL (Google Business Profile, YouTube, Facebook, Pinterest, WhatsApp catalogue) in `sameAs`, kept in siteConfig. The footer (components/layout/Footer.tsx, contact block about lines 185-210) has no address, so add the same NAP there.

**H3. Blog posts are too thin to cite.** src/data/blog.data.ts has 3–4 paragraphs per post (about 100–150 words) and no H2s. In app/(shop)/blog/[slug]/page.tsx:54-55, `dateModified` equals `datePublished`, and the author `Person` has no `url` or `jobTitle`.

Fix: expand each post to at least 800 words with question-style H2s, such as "What is zardozi embroidery?". Open each section with a 40–60 word direct answer. Add `author.jobTitle` from authorRole, add `publisher: {'@id': '<url>/#organization'}`, and store a real `updatedAt`.

### Medium
**M1. No FAQ or definition copy on category pages.** CategoryHubView and the bridal, suits and RTW pages have only hero copy and tagline-style subtitles.

Fix: add a server-rendered section of 4–6 FAQs per hub, such as "How long does a bridal lehenga take?" (15–25 business days) or "Can I customise measurements?". Also add a 2–3 sentence definitional intro, for example "A bridal lehenga at Aafreen Couture is…".

**M2. Headings are brand copy, not questions.** about/page.tsx:37-41 uses "The Couturier's Creed", and the policy sections use "Atelier Transit Pipeline" (shipping-policy:17-24). Rename them to plain queries, such as "How long does shipping take?" or "Who is Aafreen Couture?". Open about/page.tsx with a factual first paragraph of 40–60 words: who the brand is, where it is based, what it sells and how it sells.

**M3. Unverifiable superlatives.** Claims like "third-generation", "50+ countries", "200+ hours" and "48-point QC" have no source. Keep only the ones you can substantiate.

**M4. Sitemap dates.** app/sitemap.ts:12-28 sets `lastModified: new Date()` on every build. Use real content dates, because a timestamp that is always fresh carries no freshness signal.

### Low
- Policy pages show "Effective Season 2026" with no exact date. Add a visible "Last updated: YYYY-MM-DD" line.
- The FAQ page has no Organization `@id` reference. You could add `about: {'@id': …}`.

## Brand mention analysis
These could not be checked from source, so verify them off-site. There is no Wikipedia or Wikidata entity, and no YouTube, Reddit or LinkedIn presence is referenced anywhere in the code. YouTube mentions correlate most strongly with AI citations, so even a short atelier or craft video channel would help.

## Top 5 changes (impact, effort)
1. C1: unify the shipping and dispatch facts behind one config constant (high impact, about 2 h).
2. C2: SSR the product grids via `initialData` (high impact, 4–6 h).
3. H1: always render FAQ and product accordion answers (high impact, about 1 h).
4. Explicit AI search-bot rules in robots.ts plus a richer Organization schema (H2) (medium-high impact, about 1 h).
5. M1 and H3: category-page FAQs plus expanded blog posts with question H2s (medium-high impact, 1–2 days of content work).

## audit-data.json (AI Search Readiness)
```json
{"category":"AI Search Readiness","score":52,"findings":[
{"id":"geo-c1","severity":"critical","title":"Contradictory shipping/dispatch facts","files":["src/config/site.config.ts:24","src/app/(info)/shipping-policy/page.tsx:101","src/app/(info)/shipping-policy/page.tsx:206","src/features/product/components/ProductDetailClient.tsx:661","src/utils/seo.ts:89"]},
{"id":"geo-c2","severity":"critical","title":"Category product grids client-fetched, absent from initial HTML","files":["src/components/shop/CategoryHubView.tsx:54","src/components/shop/CoutureCatalogView.tsx:100"]},
{"id":"geo-h1","severity":"high","title":"FAQ/product accordion answers unmounted when closed","files":["src/features/faq/components/FaqAccordion.tsx:138","src/features/product/components/ProductDetailClient.tsx:682"]},
{"id":"geo-h2","severity":"high","title":"Organization schema: Instagram-only sameAs, no street/postcode","files":["src/app/layout.tsx:53"]},
{"id":"geo-h3","severity":"high","title":"Thin blog posts, no H2s, weak author entity","files":["src/data/blog.data.ts","src/app/(shop)/blog/[slug]/page.tsx:54"]},
{"id":"geo-m0","severity":"medium","title":"robots.ts has no explicit AI crawler rules","files":["src/app/robots.ts:8"]},
{"id":"geo-m1","severity":"medium","title":"No FAQ/definition content on category hubs","files":["src/components/shop/CategoryHubView.tsx"]},
{"id":"geo-m2","severity":"medium","title":"Branded rather than question-based headings","files":["src/app/(info)/about/page.tsx:37","src/app/(info)/shipping-policy/page.tsx:17"]}
]}
```
