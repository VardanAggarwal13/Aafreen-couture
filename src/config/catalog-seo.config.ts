/**
 * Search copy for every catalogue landing page. Each entry is unique to its page
 * and only states facts already published on the site (techniques, fabrics,
 * made-to-measure process, policy timelines). Keys are `${section}/${slug}`.
 */

export interface CatalogFaq {
  q: string;
  a: string;
}

export interface CatalogSeo {
  /** Short; the root layout appends " | Aafreen Couture". */
  metaTitle: string;
  metaDescription: string;
  intro: string;
  faq: CatalogFaq;
}

/** Valid subcategory slugs per section: the single source for the sitemap. */
export const SUBCATEGORY_SLUGS = {
  bridal: ['bridal-lehengas', 'bridal-suits', 'bridesmaid-lehengas', 'reception-gowns'],
  suits: ['cotton-kurta-sets', 'co-ord-sets', 'summer-essentials', 'partywear-unstitched', 'handcrafted-luxury', 'indo-western'],
  'ready-to-wear': ['new-arrivals', 'signature-co-ords', 'dresses', 'sharara-sets', 'occasion-lehengas'],
  bags: ['handbags', 'potlis', 'clutches', 'totes', 'shoulder-bags'],
  occasions: ['engagement', 'haldi', 'mehendi', 'sangeet', 'jago', 'wedding', 'reception'],
} as const;

/** /bridal/<occasion> duplicates /occasions/<occasion>; the occasion page is canonical. */
export const BRIDAL_OCCASION_ALIASES: Record<string, string> = {
  reception: 'reception',
  engagement: 'engagement',
  mehendi: 'mehendi',
  haldi: 'haldi',
  sangeet: 'sangeet',
};

/** Product category slug -> the landing page that lists it (used for breadcrumbs). */
export const CATEGORY_HUB_PATH: Record<string, { label: string; href: string }> = {
  'bridal-lehengas': { label: 'Bridal Lehengas', href: '/bridal/bridal-lehengas' },
  'bridal-suits': { label: 'Bridal Suits', href: '/bridal/bridal-suits' },
  'bridesmaid-lehengas': { label: 'Bridesmaid Lehengas', href: '/bridal/bridesmaid-lehengas' },
  'reception-gowns': { label: 'Reception Gowns', href: '/bridal/reception-gowns' },
  'cotton-kurta-sets': { label: 'Cotton Kurta Sets', href: '/suits/cotton-kurta-sets' },
  'co-ord-sets': { label: 'Co-ord Sets', href: '/suits/co-ord-sets' },
  'summer-essentials': { label: 'Summer Essentials', href: '/suits/summer-essentials' },
  'partywear-unstitched': { label: 'Partywear Unstitched', href: '/suits/partywear-unstitched' },
  'custom-embroidered-suits': { label: 'Handcrafted Luxury', href: '/suits/handcrafted-luxury' },
  'indo-western': { label: 'Indo-Western', href: '/suits/indo-western' },
  suits: { label: 'Suits', href: '/suits' },
  dresses: { label: 'Dresses', href: '/ready-to-wear/dresses' },
  'sharara-sets': { label: 'Sharara Sets', href: '/ready-to-wear/sharara-sets' },
  'occasion-lehengas': { label: 'Occasion Lehengas', href: '/ready-to-wear/occasion-lehengas' },
  handbags: { label: 'Handbags', href: '/bags/handbags' },
  potlis: { label: 'Potlis', href: '/bags/potlis' },
  clutches: { label: 'Clutches', href: '/bags/clutches' },
  totes: { label: 'Totes', href: '/bags/totes' },
  'shoulder-bags': { label: 'Shoulder Bags', href: '/bags/shoulder-bags' },
  jewellery: { label: 'Jewellery', href: '/jewellery' },
  haldi: { label: 'Haldi', href: '/occasions/haldi' },
};

export const CATALOG_SEO: Record<string, CatalogSeo> = {
  // ---------------------------------------------------------------- bridal
  'bridal/bridal-lehengas': {
    metaTitle: 'Bridal Lehengas, Handcrafted in Amritsar',
    metaDescription:
      'Shop heirloom bridal lehengas hand-embroidered with zardozi, dabka and cutdana on pure silks and velvets. Made to measure at our Amritsar atelier.',
    intro:
      'Each bridal lehenga here is built around hand embroidery rather than machine shortcuts. Our karigars work zardozi, dabka, cutdana and resham onto raw silk, velvet and organza, and a single ensemble can take over 200 hours. Pieces can be made to your measurements, so the blouse neckline, skirt flare and dupatta sit exactly as you imagined for the wedding day.',
    faq: {
      q: 'How long does a made-to-measure bridal lehenga take?',
      a: 'Bespoke bridal pieces are dispatched within 15–25 business days of confirmed payment, and delivery takes a further 5–7 business days. Share your wedding date with our stylists on WhatsApp and we will plan backwards from it.',
    },
  },
  'bridal/bridal-suits': {
    metaTitle: 'Bridal Suits & Royal Anarkalis',
    metaDescription:
      'Regal bridal suits and royal anarkalis with zardozi, gota patti and resham embroidery, made for intimate wedding rituals. From our Amritsar atelier.',
    intro:
      'A bridal suit suits ceremonies where a full lehenga is not the plan: the anarkali, the sharara suit, the Punjabi-style churidar set. Ours are embroidered by hand in zardozi, gota patti and resham on silks and velvets, and can be tailored to your measurements.',
    faq: {
      q: 'Can a bridal suit be customised to my measurements?',
      a: 'Yes. Neckline, sleeve length and fit can be adjusted to your measurements. Message our stylists on WhatsApp with your reference and wedding date before ordering.',
    },
  },
  'bridal/bridesmaid-lehengas': {
    metaTitle: 'Bridesmaid Lehengas for the Bridal Squad',
    metaDescription:
      'Coordinated luxury lehengas for bridesmaids, with lighter embroidery and graceful silhouettes, from the Aafreen Couture atelier in Amritsar.',
    intro:
      'Bridesmaid outfits should complement the bride without competing with her. This edit pairs coordinated colours and lighter hand work with silhouettes that stay comfortable through a long wedding day.',
    faq: {
      q: 'Can bridesmaid outfits follow one colour story?',
      a: 'Yes. Tell our stylists your palette and the number of outfits on WhatsApp and we will suggest pieces that work well together.',
    },
  },
  'bridal/reception-gowns': {
    metaTitle: 'Reception Gowns & Evening Couture',
    metaDescription:
      'Opulent reception gowns with crystals, sequins and dramatic capes, designed for your wedding finale. By Aafreen Couture, Amritsar.',
    intro:
      'The reception is the night many brides step away from traditional red. These gowns use crystals, sequins and sculpted drapes in contemporary silhouettes, finished to the same standard as our bridal lehengas.',
    faq: {
      q: 'Can I wear a gown instead of a lehenga for the reception?',
      a: 'Yes, many brides change into a gown for the reception. Browse here, or ask our stylists to help you choose a silhouette that suits the venue and your bridal look.',
    },
  },

  // ------------------------------------------------------------ occasions
  'occasions/engagement': {
    metaTitle: 'Engagement Outfits: Lehengas & Gowns',
    metaDescription:
      'Engagement lehengas, cocktail gowns and pastel couture with delicate cutdana shimmer for your ring ceremony. Handcrafted by Aafreen Couture, Amritsar.',
    intro:
      'An engagement outfit is photographed for years, so it should feel like you. Soft pastels, delicate cutdana and light shimmer in lehengas and modern silhouettes keep the look romantic without the weight of full bridal work.',
    faq: {
      q: 'What colours work for an engagement lehenga?',
      a: 'Pastels such as blush, powder blue and champagne are popular, as are soft metallics. If you are unsure, send us your venue and a reference photo on WhatsApp and our stylists will suggest options.',
    },
  },
  'occasions/haldi': {
    metaTitle: 'Haldi Outfits for the Bride: Yellow Lehengas',
    metaDescription:
      'Sun-bright yellow and marigold haldi outfits in lightweight silks and organza, with gota patti and floral work. Comfortable and photo-ready, from Amritsar.',
    intro:
      'Haldi is a messy, joyful ceremony, so the outfit should be light and easy to move in. Yellow, marigold and mustard shades in organza and lightweight silk, with gota patti and floral detailing, photograph beautifully in daylight.',
    faq: {
      q: 'Which fabric is best for a haldi outfit?',
      a: 'Lightweight organza and soft silk are practical for a ceremony that involves movement and turmeric. Choose a piece you are comfortable getting marked.',
    },
  },
  'occasions/mehendi': {
    metaTitle: 'Mehendi Outfits: Green & Festive Lehengas',
    metaDescription:
      'Vibrant green, teal and emerald mehendi lehengas with floral threadwork and mirror accents, made for a long day of henna. By Aafreen Couture.',
    intro:
      'Mehendi is a relaxed, colourful afternoon where you sit for hours. Greens, teals and emeralds with floral threadwork and mirror accents are the classic choice, and lighter skirts make sitting and dancing easier.',
    faq: {
      q: 'Should a mehendi outfit be heavily embroidered?',
      a: 'Usually not. Comfort matters when you are seated for henna, so lighter embroidery and a skirt that is easy to manage work best.',
    },
  },
  'occasions/sangeet': {
    metaTitle: 'Sangeet Lehengas: Sequin & Mirror Work',
    metaDescription:
      'Sangeet lehengas with mirrorwork, metallic sequins and flowing silhouettes made to dance in. Handcrafted by Aafreen Couture, Amritsar.',
    intro:
      'The sangeet is the night you will dance the most, so the outfit needs shimmer and freedom of movement. Mirrorwork, metallic sequins and flared skirts catch the light on the dance floor without weighing you down.',
    faq: {
      q: 'How do I choose a lehenga I can dance in?',
      a: 'Look for a generous flare, a manageable weight and a blouse that lets you raise your arms. Ask our stylists about weight and fit before you order.',
    },
  },
  'occasions/jago': {
    metaTitle: 'Jago Night Outfits: Punjabi Suits & Lehengas',
    metaDescription:
      'Jago night outfits in rich jewel tones with traditional Punjabi craftsmanship, including phulkari. From Aafreen Couture, a Punjab atelier in Amritsar.',
    intro:
      'Jago is a lively Punjabi pre-wedding night of dancing and traditional songs. Rich jewel tones and heritage craftsmanship, including phulkari work, suit the occasion, and our atelier is based in Amritsar, Punjab.',
    faq: {
      q: 'What do women wear for a jago night?',
      a: 'Traditional Punjabi suits, sharara sets and lehengas in rich colours are common, often with phulkari or a statement dupatta. Comfort for dancing is the main consideration.',
    },
  },
  'occasions/wedding': {
    metaTitle: 'Wedding Day Lehengas: Heirloom Bridal Couture',
    metaDescription:
      'Majestic wedding day lehengas with heirloom zardozi on velvet and silk, designed for the pheras. Made to measure at Aafreen Couture, Amritsar.',
    intro:
      'The wedding day outfit is the one that is kept for a lifetime. Deep reds and rich jewel shades, embroidered by hand with zardozi, dabka and cutdana on velvet and raw silk, are the foundation of our bridal work.',
    faq: {
      q: 'Can the lehenga be customised to my measurements?',
      a: 'Yes. Bridal pieces are made to your measurements, including blouse neckline, sleeve length and skirt flare, and we offer complimentary fit alterations within 10 days of delivery.',
    },
  },
  'occasions/reception': {
    metaTitle: 'Reception Outfits: Gowns & Contemporary Lehengas',
    metaDescription:
      'Reception outfits from sculptural gowns to contemporary lehengas with dramatic trails, designed for your wedding finale. Aafreen Couture, Amritsar.',
    intro:
      'Many brides choose something contemporary for the reception: a sculpted gown, a cape lehenga, a dramatic trail. These pieces keep the hand-finished detail of our bridal work with a modern line.',
    faq: {
      q: 'Gown or lehenga for a reception?',
      a: 'Both work. A gown suits a modern evening reception, while a lighter lehenga keeps a traditional feel. Our stylists can help you decide from the venue and your wedding look.',
    },
  },

  // ----------------------------------------------------------------- suits
  'suits/cotton-kurta-sets': {
    metaTitle: 'Cotton & Chanderi Kurta Sets for Women',
    metaDescription:
      'Breathable pure cotton and Chanderi kurta sets with delicate threadwork for daytime festivities and everyday elegance. From Aafreen Couture, Amritsar.',
    intro:
      'Cotton and Chanderi are the easy answer for daytime festivities. These kurta sets pair breathable fabric with fine threadwork, so they feel dressed up without feeling heavy.',
    faq: {
      q: 'How should I care for an embroidered kurta set?',
      a: 'Follow the care label on your piece. Embroidered sets are best dry-cleaned or washed gently by hand, and stored in a breathable garment bag.',
    },
  },
  'suits/co-ord-sets': {
    metaTitle: 'Co-ord Sets: Festive & Contemporary',
    metaDescription:
      'Signature co-ord sets with festive embroidery and modern tailoring for soirees and celebrations. Designed at Aafreen Couture in Amritsar.',
    intro:
      'A co-ord set takes the effort out of getting dressed: top and bottom are designed to be worn together, in modern cuts with festive detailing. Ours are made for soirees, family functions and wedding-week events.',
    faq: {
      q: 'Can I wear a co-ord set to a wedding?',
      a: 'Yes, particularly for pre-wedding events such as a mehendi or sangeet. Choose richer fabrics and embroidery for evening functions.',
    },
  },
  'suits/summer-essentials': {
    metaTitle: 'Summer Suits in Light Pastel Tones',
    metaDescription:
      'Lightweight summer suits in soothing pastel tones for daytime poise and warm-weather celebrations. By Aafreen Couture, Amritsar.',
    intro:
      'Indian summers are long, and weddings do not stop for them. These light suits in soft pastel tones keep you comfortable at day events while still looking considered.',
    faq: {
      q: 'Which colours suit a summer celebration?',
      a: 'Pastels and light neutrals feel cooler and photograph well in daylight.',
    },
  },
  'suits/partywear-unstitched': {
    metaTitle: 'Unstitched Partywear Suit Fabrics',
    metaDescription:
      'Opulent unstitched partywear fabric sets ready for your own tailoring and customisation, with rich embroidery from Aafreen Couture, Amritsar.',
    intro:
      'Unstitched sets give you the fabric and embroidery and leave the silhouette to you. Take it to your own tailor to get exactly the neckline, length and fit you want.',
    faq: {
      q: 'What does unstitched mean?',
      a: 'The set is supplied as fabric pieces rather than a ready-made outfit, so you can have the suit tailored to your measurements and preferred style.',
    },
  },
  'suits/handcrafted-luxury': {
    metaTitle: 'Handcrafted Luxury Suits',
    metaDescription:
      'Artisanal suits with intricate zardozi, gota patti and resham hand embroidery, prepared to order at the Aafreen Couture atelier in Amritsar.',
    intro:
      'These suits are where our karigari is most visible: zardozi, gota patti and resham worked by hand on silks and velvets. Every creation is prepared to order, so allow time for the embroidery.',
    faq: {
      q: 'How long does a handcrafted suit take to arrive?',
      a: 'Ready-to-ship styles are dispatched within 1–2 business days, while custom pieces take longer. The product page and our team on WhatsApp will confirm timing for your choice.',
    },
  },
  'suits/indo-western': {
    metaTitle: 'Indo-Western Suits & Fusion Outfits',
    metaDescription:
      'Indo-western outfits where timeless Indian artistry meets contemporary draping and structured cuts. From Aafreen Couture, Amritsar.',
    intro:
      'Indo-western pieces keep the craft of Indian embroidery and fabric while borrowing modern cuts and drapes. They suit brides and guests who want something festive but not traditional.',
    faq: {
      q: 'What counts as an indo-western outfit?',
      a: 'Outfits that combine traditional Indian craft, such as embroidery, with modern silhouettes like capes, jackets or asymmetric skirts.',
    },
  },

  // --------------------------------------------------------- ready to wear
  'ready-to-wear/new-arrivals': {
    metaTitle: 'New Arrivals: Ready-to-Wear Couture',
    metaDescription:
      'The latest ready-to-wear arrivals from Aafreen Couture: dresses, co-ords, shararas and lehengas that dispatch within 1–2 business days.',
    intro:
      'Our newest ready-to-wear pieces appear here first. Ready styles are dispatched within 1–2 business days of confirmed payment, which makes them a good choice when the event date is close.',
    faq: {
      q: 'Can ready-to-wear pieces be exchanged?',
      a: 'Eligible ready-to-wear pieces can be exchanged for size within 7 days of delivery, with original tags attached. See our returns policy for the full conditions.',
    },
  },
  'ready-to-wear/signature-co-ords': {
    metaTitle: 'Signature Co-ords: Ready to Wear',
    metaDescription:
      'Signature ready-to-wear co-ord sets with festive detailing and modern tailoring, dispatched within 1–2 business days from Amritsar.',
    intro:
      'Signature co-ords are our most wearable ready-to-ship pieces: coordinated sets in festive fabrics and contemporary cuts, easy to style for a dinner, a puja or a wedding-week function.',
    faq: {
      q: 'How do I pick my size in a ready-to-wear co-ord?',
      a: 'Check the size details on the product page and message our stylists on WhatsApp if you are between sizes. A size exchange is available within 7 days of delivery on eligible pieces.',
    },
  },
  'ready-to-wear/dresses': {
    metaTitle: 'Designer Dresses & Gowns: Ready to Wear',
    metaDescription:
      'Designer ready-to-wear dresses and gowns with festive embellishment and modern silhouettes, dispatched in 1–2 business days from Aafreen Couture.',
    intro:
      'These dresses and gowns bring the finish of our couture work to silhouettes that need no tailoring. They suit cocktail evenings, receptions and wedding-week parties.',
    faq: {
      q: 'Are ready-to-wear dresses customisable?',
      a: 'Ready-to-wear dresses are made in standard sizes. For a made-to-measure fit, look at our bespoke bridal and suit collections or ask our stylists.',
    },
  },
  'ready-to-wear/sharara-sets': {
    metaTitle: 'Sharara Sets: Festive Ready to Wear',
    metaDescription:
      'Festive sharara sets in rich fabrics with hand-finished embroidery, ready to ship from Aafreen Couture in Amritsar.',
    intro:
      'Sharara sets are a favourite for mehendi, sangeet and festive evenings: the flared bottoms move beautifully and the kurta carries the embroidery. Ours are ready to ship.',
    faq: {
      q: 'Which events suit a sharara set?',
      a: 'Mehendi, sangeet, engagement parties and festive family functions are all good fits.',
    },
  },
  'ready-to-wear/occasion-lehengas': {
    metaTitle: 'Occasion Lehengas: Ready to Wear',
    metaDescription:
      'Ready-to-wear lehengas for engagements, sangeets and festive evenings, finished by hand and dispatched in 1–2 business days from Amritsar.',
    intro:
      'Not every lehenga needs a bridal timeline. These occasion lehengas are ready to ship for events where you want a hand-finished look without waiting for a made-to-measure order.',
    faq: {
      q: 'How soon can a ready-to-wear lehenga reach me?',
      a: 'Ready styles are dispatched within 1–2 business days of confirmed payment, with domestic delivery taking 5–7 business days after dispatch.',
    },
  },

  // ------------------------------------------------------------------ bags
  'bags/handbags': {
    metaTitle: 'Luxury Handbags for Festive Wear',
    metaDescription:
      'Handcrafted luxury handbags to complete festive and bridal outfits, from the Aafreen Couture atelier in Amritsar.',
    intro:
      'A bag should belong to the outfit. These handbags are chosen to sit alongside embroidered lehengas and suits, with enough room for the essentials of a long wedding day.',
    faq: {
      q: 'Can I match a handbag to my outfit?',
      a: 'Yes. Send a photo of your outfit on WhatsApp and our stylists will suggest bags that complement the colour and embroidery.',
    },
  },
  'bags/potlis': {
    metaTitle: 'Potli Bags for Weddings & Festive Wear',
    metaDescription:
      'Handcrafted potli bags to pair with lehengas, suits and sarees for weddings and festive evenings. By Aafreen Couture, Amritsar.',
    intro:
      'The potli is the traditional companion to Indian festive wear: small, drawstring and easy to carry on the wrist. Ours are made to sit well with embroidered outfits.',
    faq: {
      q: 'What fits inside a potli?',
      a: 'A phone, lipstick and a few cards or cash fit comfortably. Check the product page for dimensions.',
    },
  },
  'bags/clutches': {
    metaTitle: 'Designer Clutches for Evening & Weddings',
    metaDescription:
      'Designer clutches for weddings, receptions and festive evenings, handcrafted to complement embroidered outfits. Aafreen Couture, Amritsar.',
    intro:
      'A clutch gives a dressed-up look a clean finish. These are designed for receptions and evening events where you want something refined rather than bulky.',
    faq: {
      q: 'Which events suit a clutch?',
      a: 'Receptions, cocktail evenings and engagement parties, where a compact bag completes a gown or lehenga.',
    },
  },
  'bags/totes': {
    metaTitle: 'Totes for Everyday Elegance',
    metaDescription:
      'Spacious totes with an elegant finish for daily use and wedding-week travel, from Aafreen Couture in Amritsar.',
    intro:
      'For days when a potli is not enough, totes carry the practical load without losing the style of the rest of your look.',
    faq: {
      q: 'Are totes suitable for wedding-week travel?',
      a: 'Their larger size makes them useful for carrying essentials between functions. See each product page for dimensions.',
    },
  },
  'bags/shoulder-bags': {
    metaTitle: 'Shoulder Bags: Elegant & Everyday',
    metaDescription:
      'Shoulder bags that pair festive and contemporary outfits, thoughtfully finished by Aafreen Couture in Amritsar.',
    intro:
      'Shoulder bags keep your hands free at a busy function. They work with indo-western outfits and contemporary festive looks.',
    faq: {
      q: 'Do shoulder bags work with traditional outfits?',
      a: 'They pair best with indo-western and contemporary festive looks; for a full bridal ensemble a potli or clutch is the more traditional choice.',
    },
  },

  // ------------------------------------------------------------- jewellery
  'jewellery/main': {
    metaTitle: 'Bridal Jewellery: Kundan, Polki & Jadau',
    metaDescription:
      'Heritage kundan, polki, jadau and cultured pearl jewellery to crown bridal lehengas and festive Indian couture. From Aafreen Couture, Amritsar.',
    intro:
      'Bridal jewellery is chosen with the outfit in mind. Kundan, polki, jadau and cultured pearl pieces here are selected to sit alongside heavy zardozi lehengas and lighter festive suits.',
    faq: {
      q: 'How do I choose jewellery for my bridal lehenga?',
      a: 'Heavier embroidery usually pairs best with a single statement piece, while lighter outfits can carry layered sets. Our stylists can advise if you share a photo of your outfit.',
    },
  },
};

/** Hub-level intro copy for the four section landing pages. */
export const HUB_SEO: Record<string, { heading: string; paragraphs: string[] }> = {
  bridal: {
    heading: 'Bridal lehengas and wedding couture from Amritsar',
    paragraphs: [
      'The bridal edit brings together lehengas, suits, bridesmaid outfits and reception gowns made at our Amritsar atelier. Embroidery is done by hand in zardozi, dabka, cutdana and resham on raw silks, velvets and organza.',
      'Bespoke bridal pieces are made to your measurements and dispatched within 15–25 business days of confirmed payment. Our stylists can help you choose a silhouette and plan around your wedding date.',
    ],
  },
  suits: {
    heading: 'Designer suits, kurta sets and co-ords',
    paragraphs: [
      'From breathable cotton and Chanderi kurta sets to handcrafted zardozi suits and unstitched partywear fabrics, this edit covers festive wear for every kind of day. Pieces are made at our Amritsar atelier.',
    ],
  },
  'ready-to-wear': {
    heading: 'Ready-to-wear dresses, co-ords and shararas',
    paragraphs: [
      'Ready-to-wear pieces are dispatched within 1–2 business days of confirmed payment, so they work well when an event date is close. Eligible pieces can be exchanged for size within 7 days of delivery.',
    ],
  },
  bags: {
    heading: 'Bags and potlis for festive and bridal wear',
    paragraphs: [
      'Handbags, potlis, clutches, totes and shoulder bags chosen to sit alongside embroidered lehengas and suits.',
    ],
  },
};

/** Real landing page for a product category, falling back to the filtered shop view. */
export function categoryCrumbHref(slug: string): string {
  return CATEGORY_HUB_PATH[slug]?.href ?? `/shop?category=${slug}`;
}
