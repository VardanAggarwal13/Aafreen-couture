# Content Quality & On-Page Findings — aafreencouture.com

Audit type: source-level review (no source files edited). Date: 2026-10-30.
Note: `metadata_template.py` could not run (no Python 3.11+ on host); templating analysis below was done by manual string comparison.

## Scores

| Area | Score |
|---|---|
| **Content quality (overall)** | **54 / 100** |
| Experience (20%) | 45 |
| Expertise (25%) | 50 |
| Authoritativeness (25%) | 35 |
| Trustworthiness (30%) | 62 |
| E-E-A-T weighted | 49 |
| AI citation readiness | 38 / 100 |

Strengths: real street address + phone + hours on /contact and in policies; FAQPage schema; specific, non-generic product copy (fabric/technique names); full policy set (privacy, terms, shipping, returns) with grievance contact.

---

## CRITICAL

### C1. Category/listing pages ship almost no indexable copy; product grids are client-only
- `src/components/shop/CategoryHubView.tsx:1` and `src/components/shop/CoutureCatalogView.tsx:1` are `'use client'`; products load through `useQuery` (`CategoryHubView.tsx:55`, `CoutureCatalogView.tsx:101`). The server HTML for /bridal, /suits, /ready-to-wear, /bags, /jewellery, /occasions/*, /bridal/*, /suits/* etc. holds only the H1, a one-sentence subtitle (~15–40 words) and the hero bullets. There are no product links and no intro copy in the initial HTML.
- /bridal/bridal-lehengas (the money page for "bridal lehenga") ends up with about 20 words of unique copy. The coverage floor for a category page is about 300–500 words.
- Fix: prefetch the first page of products on the server (HydrationBoundary or props), and add a server-rendered `introHtml`/`seoCopy` block (150 words above the grid, 300–500 words plus 4–6 FAQs below it) to both views. Store it per category in the Category model so admins can edit it.

### C2. Location contradiction: "Jaipur" vs Amritsar (NAP/trust)
- `src/components/shop/CategoryHubView.tsx:383`: "Connect directly with our master atelier in **Jaipur**". Every hub page renders this line. Everywhere else, including schema, says Amritsar.
- `src/features/home/components/Testimonials.tsx:80`: "unmatched by any luxury boutique in Jaipur".
- Replace with: `Connect directly with our master atelier in Amritsar, Punjab for a private in-studio or virtual styling consultation.`

### C3. Policy facts contradict each other across pages and schema
| Fact | FAQ (`faq/page.tsx`) | PDP (`ProductDetailClient.tsx` ~656-664) | Schema (`utils/seo.ts`) | About |
|---|---|---|---|---|
| Ready-to-ship dispatch | 1–2 days | 3–5 days | handling 1–3 d | – |
| Domestic transit | 5–7 business days | – | 2–5 d | – |
| Bespoke lead time | 15–25 business days | 10–14 business days | – | – |
| Alteration window | 10 days | "minor adjustments" | – | "10-Day Fit Guarantee" |
| Returns | exchange-only, 7 days | 7-day exchange | `FreeReturn`, `ReturnByMail`, 7 days (refund implied) | – |
- Trust is the highest-weighted E-E-A-T factor, and Google cross-checks Merchant Center return/shipping data against the page. Pick one set of numbers, put it in `site.config.ts`, and reference it from all four places.

### C4. Blog is extremely thin, and its read times are inflated
- `src/data/blog.data.ts:25-78` (seeded by `scripts/seed-blog.ts:43`): the 4 posts run 3–4 sentences each (about 70–110 words) but show "6 min read" / "5 min read" (`:22`, `:56`, `:72`). A blog post should be at least 1,500 words.
- `content: string[]` is plain text, so posts cannot contain internal links. None of them link to /bridal/bridal-lehengas, products, or occasions.
- Authors "Pearl Kapoor" and "Sanya Malhotra" have no bio, photo, credentials or author page. Article JSON-LD (`blog/[slug]/page.tsx:55`) has `author` without a `url`, and `dateModified` equals `datePublished`.
- Claims like "22k gold-plated… South Sea pearls" (`:67`) cannot be verified against the catalogue.
- Fix: switch content to Markdown/MDX or HTML blocks, expand each post to 1,500+ words with first-hand atelier detail (photos of the adda, karigar names, hours per piece), add an `/about#pearl-kapoor` or `/authors/pearl-kapoor` page, and add `author.url` and `jobTitle`.

## HIGH

### H1. Double-branded / overlong titles (root template `%s | Aafreen Couture`, `config/seo.config.ts:8`)
- `bridal/[subcategory]/page.tsx:72` → "Bridal Lehengas | Aafreen Couture Bridal | Aafreen Couture"
- `blog/page.tsx:9` → "The Journal | Aafreen Couture | Aafreen Couture"
- `blog/[slug]/page.tsx:20` → "…Big Day | Aafreen Couture Journal | Aafreen Couture" (109 chars)
- `blog/[slug]/page.tsx:17` → "Article Not Found | Aafreen Couture | Aafreen Couture"
- Product seoTitles in `data/products.data.ts` already end in "| Aafreen Couture". The regex strip in `product/[slug]/page.tsx:27` handles that, but many names alone run 60–80 chars ("Mehrunissa Ivory & Silver Zardozi Open Jacket & Flared Gown Ensemble").

### H2. Templated metadata (bulk-pattern risk: high)
Descriptions built from one template with the name swapped in:
- `occasions/[subcategory]/page.tsx:53`: "Discover royal {x} couture by Aafreen Couture. Featuring artisanal zardozi embroidery, heritage silhouettes, and celebratory fabrics." The same text runs on 7 URLs, and it puts "zardozi" on haldi, which is wrong.
- `suits/[subcategory]` ~line 43, `ready-to-wear/[subcategory]` ~43, `bags/[subcategory]` ~43: the same pattern, with the stock tail "by Aafreen Couture. Featuring…" / "Impeccable tailoring…".
- `collections/[slug]/page.tsx:40`: every fallback collection description is under 120 chars, so all of them fall through to "Explore the {name} collection by Aafreen Couture. Featuring handcrafted bridal wear…". That yields "Explore the The Bag Edit collection…" and claims "bridal wear" for bags and jewellery.
- `product/[slug]/page.tsx:39`: descriptions under 120 chars all get the stock CTA "Handcrafted luxury couture with complimentary express shipping by Aafreen Couture."
- The shared CTA phrases ("by Aafreen Couture. Featuring", "Handcrafted luxury couture with complimentary express shipping") appear on more than 30 URLs. Estimated templated ratio: about 60% of indexable URLs.

### H3. Zero geo or commercial-intent keywords in titles
- "Amritsar" appears in no title or description. "online India", "buy", "price" and "for haldi/sangeet/mehendi" are missing. Occasion titles ("Mehendi Soirée — Wedding Occasions") target no search query.

### H4. Duplicate / cannibalising URLs and soft-404s
- Pairs that overlap: /bridal/bridesmaid-lehengas ↔ /collections/bridesmaid-lehengas; /bridal/reception-gowns ↔ /collections/reception-gowns ↔ /collections/reception ↔ /bridal/reception; /bridal/haldi (in sitemap) ↔ /occasions/haldi; /bridal/{sangeet,mehendi,engagement} ↔ /occasions/*; /suits/indo-western ↔ /collections/indo-western; /jewellery ↔ /collections/jewellery; /bridal ↔ /collections/bridal ↔ /collections/bridal-lehengas-suits. Choose one canonical per intent and 301 or canonicalise the rest.
- No `[subcategory]` route calls `notFound()` (bridal, suits, ready-to-wear, bags, occasions). Any slug returns 200 with a title-cased H1 and a templated description, which creates infinite thin pages.

### H5. Boilerplate repeated verbatim
- "An ode to the timeless majesty of royal Indian weddings…" appears in `bridal/page.tsx:129`, `collections/[slug]/page.tsx` (~142) and `features/shop/components/ShopClientPage.tsx:173`.
- The "Bespoke Couture Consultation" block appears on every hub page.
- PDP fallbacks invent specs when fields are empty: "Pure Raw Silk & Chanderi Lining", "Handcrafted Zardozi, Tilla & Gota Patti" (`ProductDetailClient.tsx` ~613-628, 655). A bag or jewellery item would end up described as raw silk. Hide the field instead of falling back.

### H6. Weak authority/experience signals
- About (`(info)/about/page.tsx`) names no founder, has no founding year, no team or atelier photos, and no press. "Since 2010" appears only on login/register (`LoginForm.tsx:136`, `RegisterForm.tsx:148`). "Aafreen Couture By Pearl" never says who Pearl is.
- Testimonials (`Testimonials.tsx:34-93`) are hardcoded, give no city/date/order link, and include "royal palace wedding" claims. Move them to verified reviews or add photos/dates.
- The footer has no address and no link to /blog or /contact (`Footer.tsx:160-179`).

## MEDIUM
- Home H1 is "The Bridal Edit" plus sr-only text (`HeroSection.tsx:49-50`). Make the keyword visible: "Bridal Lehengas & Designer Suits, Handcrafted in Amritsar".
- Hub H1s are brand phrases ("The Royal Bridal Edit", "The Royal Suit Atelier"). Use them as eyebrow text and make the H1 the keyword: "Bridal Lehengas & Wedding Couture".
- PDP: the H2 "Craftsmanship & Design Story" puts the description in one `<p>`, so the `\n\n` paragraph breaks collapse. Care/shipping accordions render content only when open (`accordionOpen === key`), so that text is absent from the DOM.
- Nested `<main>` in info pages (`about/page.tsx:17` inside the root layout `<main>`).
- The blog index description is 93 chars (`blog/page.tsx:10`). The contact title is 47 and shipping 44, which is fine. FAQ (61), shop (62), jewellery (62) and bridal (63) are slightly long.

---

## Proposed titles & descriptions (template suffix " | Aafreen Couture" already counted where noted)

| Page | Title | Description |
|---|---|---|
| Home (absolute) | Bridal Lehengas Online India \| Aafreen Couture Amritsar | Handcrafted bridal lehengas, designer suits & wedding couture from our Amritsar atelier. Made-to-measure, free insured shipping across India. |
| /bridal (`title`) | Designer Bridal Lehengas & Wedding Couture | Shop designer bridal lehengas, bridal suits & reception gowns hand-embroidered in zardozi and dabka in Amritsar. Custom fitting, free shipping in India. |
| /bridal/bridal-lehengas | Bridal Lehenga Online — Handcrafted in Amritsar | Buy handcrafted bridal lehengas online in India. Red, pastel & velvet designs with zardozi and dabka work, made to measure. Free insured shipping. |
| /bridal/bridesmaid-lehengas | Bridesmaid Lehengas — Coordinated Designer Sets | Coordinated bridesmaid lehengas in pastel and jewel tones, hand-embellished in our Amritsar atelier. Sizes or custom fit, free shipping across India. |
| /bridal/reception-gowns | Reception Gowns for Brides — Indian Couture | Reception gowns and Indo-western ballgowns with crystal and cutdana work, tailored in Amritsar for brides. Custom sizing and free shipping across India. |
| /occasions/haldi | Haldi Outfits for Bride — Yellow Lehengas & Suits | Haldi outfits for the bride and family: yellow and marigold lehengas, shararas and suits with gota patti. Lightweight, made to measure, shipped free. |
| /occasions/mehendi | Mehendi Outfits — Green Lehengas & Sharara Sets | Mehendi lehengas and sharara sets in lime, emerald and teal with mirror and thread work. Comfortable to dance in, custom-fit, free shipping in India. |
| /occasions/sangeet | Sangeet Lehenga & Outfits — Sequin & Mirror Work | Sangeet lehengas, cape sets and shararas with sequin and mirror work, light enough to dance in all night. Made to measure in Amritsar, free shipping. |
| /occasions/engagement | Engagement Lehenga & Outfits for Bride | Engagement lehengas and cocktail gowns in pastels with cutdana and pearl work. Handcrafted in Amritsar, custom fitting, free shipping across India. |
| /suits | Designer Punjabi Suits & Anarkalis — Amritsar | Designer Punjabi suits, anarkalis, kurta sets and unstitched party wear, hand-embroidered in Amritsar. Custom tailoring and free shipping across India. |
| /ready-to-wear | Designer Co-ord Sets, Shararas & Dresses | Ready-to-wear designer co-ords, sharara sets and festive dresses for wedding guests. Hand-finished in Amritsar, quick dispatch, free shipping in India. |
| /jewellery | Bridal Kundan & Polki Jewellery Sets | Kundan, polki and jadau bridal jewellery (chokers, necklaces and earrings) chosen to pair with our lehengas. Free insured shipping across India. |
| /bags | Designer Potlis & Bridal Clutches | Embroidered potlis, bridal clutches and handbags with zardozi, pearls and crystals to finish your wedding look. Free insured shipping across India. |
| /about | About Us — Bridal Couture Atelier in Amritsar | Meet Pearl Kapoor and the karigars behind Aafreen Couture, a bridal atelier in New Amritsar crafting hand-embroidered lehengas and suits since 2010. |
| /contact | Contact & Book a Bridal Appointment, Amritsar | Visit our New Amritsar atelier (SCO 43, B-Block Market) or book a virtual bridal consultation. Call or WhatsApp +91 95179 01117, Mon–Sat 10:30–7:30. |
| /faq | FAQs — Custom Lehengas, Shipping & Exchanges | Answers on custom bridal lehenga timelines, measurements, COD, free shipping across India, international delivery, alterations and 7-day exchanges. |
| /blog (`title`) | Bridal Style Journal — Lehenga Guides | Bridal lehenga guides, ceremony outfit ideas and zardozi craft stories from the Aafreen Couture atelier in Amritsar. Written by our designers. |
| /blog/[slug] | `${post.title}` (drop "\| Aafreen Couture Journal"; keep ≤ 55 chars) | Post-specific excerpt of 140–155 chars |
| Product | `${name} — ${categoryNoun}` e.g. "Shahi Sindoori Red Bridal Lehenga" | `${shortDescription}` trimmed to 150 chars. Drop the stock CTA and work price/fabric/lead time in naturally. |

## Blog / landing topics (target keywords)
1. **How to Choose a Bridal Lehenga: Fabric, Weight & Budget Guide (2026)**: "how to choose bridal lehenga", "bridal lehenga price"
2. **Bridal Lehenga Shopping in Amritsar: What to Expect at a Couture Fitting** (landing): "designer lehenga Amritsar", "bridal lehenga shop Amritsar"
3. **Buying a Bridal Lehenga Online in India: Measurements, Timelines & Trials**: "bridal lehenga online India", "custom lehenga online"
4. **What to Wear for Haldi: 15 Yellow Outfit Ideas for Bride & Family**: "haldi outfit for bride", "lehenga for haldi"
5. **Sangeet Outfits That Let You Dance: Lightweight Lehengas & Shararas**: "lehenga for sangeet", "sangeet outfit ideas"
6. **Mehendi Outfit Guide: Green, Mirror-Work & Comfortable Silhouettes**: "lehenga for mehendi", "mehendi outfit for bride"
7. **Anand Karaj Outfit Guide for Sikh Brides: Lehenga vs Suit**: "anand karaj bridal outfit", "Punjabi bridal suit"
8. **Zardozi vs Dabka vs Gota Patti: How to Read Lehenga Embroidery (and Price)**: "zardozi lehenga", "types of lehenga embroidery"
9. **Jago Night Outfits: Punjabi Wedding Tradition & What to Wear**: "jago outfit", "jaggo night dress"
10. **Bridal Lehenga Care & Storage: Keeping Zardozi Heirlooms Bright**: "how to store bridal lehenga"

Each post should run 1,500+ words, carry a named author with bio, have at least 3 in-content links (category, 2 products, 1 occasion), use original atelier photos, and include an FAQ block.

## Structured findings (audit-data.json, Content Quality)
```json
[
 {"id":"content-c1","severity":"critical","title":"Category pages lack indexable intro copy; product grids client-rendered","files":["src/components/shop/CategoryHubView.tsx:55","src/components/shop/CoutureCatalogView.tsx:101"]},
 {"id":"content-c2","severity":"critical","title":"Atelier location says Jaipur; business is Amritsar","files":["src/components/shop/CategoryHubView.tsx:383","src/features/home/components/Testimonials.tsx:80"]},
 {"id":"content-c3","severity":"critical","title":"Conflicting shipping/lead-time/return facts across FAQ, PDP, schema, About","files":["src/app/(info)/faq/page.tsx","src/features/product/components/ProductDetailClient.tsx:656","src/utils/seo.ts"]},
 {"id":"content-c4","severity":"critical","title":"Blog posts 70-110 words, inflated read times, no internal links, no author bios","files":["src/data/blog.data.ts:25","scripts/seed-blog.ts:43"]},
 {"id":"content-h1","severity":"high","title":"Double-branded / overlong titles","files":["src/app/(shop)/bridal/[subcategory]/page.tsx:72","src/app/(shop)/blog/page.tsx:9","src/app/(shop)/blog/[slug]/page.tsx:20"]},
 {"id":"content-h2","severity":"high","title":"templated_metadata: shared description templates and stock CTA across ~60% of URLs","files":["src/app/occasions/[subcategory]/page.tsx:53","src/app/(shop)/collections/[slug]/page.tsx:40","src/app/(shop)/product/[slug]/page.tsx:39"]},
 {"id":"content-h3","severity":"high","title":"No geo/commercial keywords (Amritsar, online India, haldi/sangeet/mehendi) in titles"},
 {"id":"content-h4","severity":"high","title":"Cannibalising duplicate category URLs; [subcategory] routes never 404"},
 {"id":"content-h5","severity":"high","title":"Verbatim boilerplate and invented PDP spec fallbacks"},
 {"id":"content-h6","severity":"high","title":"No founder/team/year on About; unverifiable hardcoded testimonials"}
]
```
