# Agentic readiness (source-level, 2026-10-30)
Lighthouse Agentic Browsing and agent_ux_check not run (site may not be live; source review only). No score reported.

## P1
- Nested <main>: src/app/layout.tsx:118 wraps children in <main>; 17 pages/components render another <main> (e.g. (info)/about/page.tsx:18, contact:18, faq:108, privacy-policy:30, returns-policy:32, shipping-policy:30, terms:38, (shop)/blog/page.tsx:19, blog/[slug]:65, collections:48, search:16, wishlist:12, occasions/page.tsx:95, track-order:18, CategoryHubView.tsx:314, CoutureCatalogView.tsx:435, (account)/layout.tsx:28, (auth)/layout.tsx:50). Fix: change inner <main> to <div>/<section>.
## P2
- Unlabeled controls (placeholder only or no name): SearchOverlay.tsx:98 input (add aria-label="Search products"); CoutureCatalogView.tsx:384 sort <select> (aria-label="Sort products"; the "Sort:" span is not associated); PageSizeSelect.tsx:30 (aria-label="Items per page"); Navbar.tsx:271 mobile accordion button (add aria-expanded + aria-controls); Navbar.tsx:105 uses aria-label OK but verify close button at ~Navbar:130.
- Footer.tsx:80 Subscribe button has visible text: OK. Footer newsletter form fine.
- robots.ts: only a "*" group; no explicit AI crawler policy (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Google-Extended, CCBot) and no Content-Signal (draft proposal, see vendor-matrix.md). Not a defect; add explicit groups. Next MetadataRoute.Robots cannot emit Content-Signal; serve robots via route handler (app/robots.txt/route.ts) if wanted. Also /search disallow is fine; /login etc. fine.
  Suggested lines: training (GPTBot, ClaudeBot, Google-Extended, CCBot) = decide (allow/disallow); search (OAI-SearchBot, Claude-SearchBot, PerplexityBot) = allow; user-triggered (ChatGPT-User, Claude-User) = allow.
- ProductDetailClient (src/features/product/components/ProductDetailClient.tsx): good: one <h1> (358), labelled icon buttons, alt on images. Check size/colour buttons at 426/466/475 for aria-pressed and names, and 524/533/544 (cart/buy) have text.
## P3 / opportunities
- public/llms.txt: well-formed (H1, blockquote, H2 sections, absolute URLs). Verify /bridal, /suits, /ready-to-wear, /bags, /jewellery, /collections resolve (not 404) and that /shop exists. Add top product/category links only if stable. llms.txt is a community proposal, no guaranteed effect.
- Markdown delivery: absent (opportunity). Optional: middleware Accept: text/markdown negotiation for /faq and policies.
- /.well-known: none in public/ (opportunity). ai-catalog.json draft optional; middleware.ts runs on all paths - ensure matcher doesn't redirect /.well-known.
- WebMCP: draft proposal; low applicability for a catalogue; optional later for add-to-cart/search tools. Not a defect.
- Positive: <html lang="en">, JSON-LD Organization/ClothingStore with sameAs (layout.tsx:44-53), sitemap.ts, SSR via Next. MetaPixel noscript img alt="" is decorative, fine.
