# Local SEO findings (source-level) - Aafreen Couture By Pearl

NAP sources: name "Aafreen Couture" (site.config.ts:13) vs "Aafreen Couture By Pearl" (contact/page.tsx:122, footer.tsx:238, terms, privacy). Phone +91 95179 01117 consistent everywhere. Address "SCO No. 43, 1st Floor, B-Block Market, New Amritsar, Amritsar, Punjab - 143001" appears in contact:125, terms:379, privacy:213; only "Amritsar, Punjab - 143001" in returns:408, shipping:365. Hours Mon-Sat 10:30-19:30 IST (contact:104, Footer.tsx:225); Sunday by appointment (contact:107). No geo, no Maps embed/link, no GBP URL in code.

| Sev | Where | Issue | Fix |
|---|---|---|---|
| High | src/app/layout.tsx:54-59 | PostalAddress lacks streetAddress/postalCode though visible on contact page | add streetAddress 'SCO No. 43, 1st Floor, B-Block Market, New Amritsar', postalCode '143001' |
| High | layout.tsx:44 | Type ['Organization','ClothingStore'] with telephone/email only inside contactPoint; no top-level telephone | add telephone: siteConfig.phone, email: siteConfig.email on the entity; keep ClothingStore |
| High | layout.tsx:48-67 | No openingHoursSpecification | add Mon-Sat opens 10:30 closes 19:30 (Sunday is appointment-only; omit or note) |
| High | site.config.ts:13 vs contact:122 | Name inconsistency | set legal/display name 'Aafreen Couture By Pearl' (or alternateName) in schema; match GBP name exactly |
| High | contact/page.tsx:125 | Address is plain text only; no Maps embed or directions link | add Google Maps link/embed (needs real GBP/maps URL from owner) and hasMap in schema |
| Med | layout.tsx | No areaServed | add areaServed: Country India + 'Punjab','Delhi','Chandigarh'; note worldwide shipping via about/seed text (50+ countries claim - verify) |
| Med | layout.tsx | No priceRange | CLAUDE.md states INR 25,000-1,00,000+; priceRange: '₹₹₹₹' or '₹25,000-₹1,00,000' |
| Med | layout.tsx:53 | sameAs has Instagram only | add GBP/Facebook/Pinterest/YouTube URLs once they exist |
| Med | Footer.tsx:224 | Footer shows email/phone/hours but no street address | add address line (or at least 'New Amritsar, Amritsar, Punjab 143001') for sitewide NAP |
| Med | llms.txt:3 / seed-cms.ts:47 | City mention exists, no LocalBusiness-focused landing copy | see location pages |
| Low | Testimonials.tsx:101 | Review location text only; no aggregateRating | add AggregateRating only if real, verifiable review data exists; otherwise omit |
| Low | geo | Not present in code | do NOT add geo until real coordinates are supplied (5-decimal) |

## Location pages
Single-location atelier: one strong page is right. Recommended: /bridal-lehenga-amritsar (real studio, appointments, karigar story, address, hours, Maps, LocalBusiness schema). Shipping/virtual pages (/bridal-lehenga-delhi, /chandigarh, /punjab) only if each has unique content (delivery times from shipping-policy, virtual appointments, real client examples); otherwise doorway risk - skip them, and avoid claiming a store in those cities. Keep them as ClothingStore areaServed, not separate addresses.

## GBP checklist (Aafreen Couture By Pearl)
- Primary category: Bridal shop (or Wedding dress store / Clothing store - choose Bridal shop); secondary: Boutique, Custom tailor
- Name exactly matches site; address SCO 43 B-Block Market, New Amritsar 143001; phone +91 95179 01117; website https://aafreencouture.com
- Hours Mon-Sat 10:30-19:30; Sunday appointment-only (use special hours/notes)
- Appointment link -> /contact; WhatsApp link; products added; services (bespoke lehenga, alterations)
- Photos: storefront, interior, work, team; logo/cover; weekly Posts
- Reviews: request via WhatsApp post-delivery, reply to all; Q&A seeded
- Verify via video; add GBP URL to sameAs and hasMap
- Citations: Justdial, Sulekha, WedMeGood, WeddingWire India, Yelp, Facebook; keep NAP identical
Limitations: no live fetch, no GBP/review/citation data, proximity not controllable.
