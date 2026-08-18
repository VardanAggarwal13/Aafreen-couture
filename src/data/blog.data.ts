export interface IBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  image: string;
  author: string;
  authorRole: string;
  category: string;
  readTime: string;
  publishedAt: string;
}

export const BLOG_POSTS: IBlogPost[] = [
  {
    slug: 'choosing-the-perfect-bridal-lehenga',
    title: 'The Royal Bride: Choosing the Perfect Silhouette for Your Big Day',
    excerpt: 'From classic crimson velvet to ethereal champagne organza, discover the art of selecting a bridal lehenga tailored to your personality and ceremony.',
    image: '/images/products/noor-e-ishq.webp',
    author: 'Pearl Kapoor',
    authorRole: 'Head Designer & Founder',
    category: 'Bridal Guide',
    readTime: '6 min read',
    publishedAt: 'August 10, 2026',
    content: [
      'Your wedding day is a celebration of eternal love and cultural heritage. Selecting the bridal lehenga that represents your journey requires a balance of silhouette, craftsmanship, and comfort.',
      'For evening rituals like the Pheras and Reception, deep jewel tones such as Royal Crimson, Wine Maroon, and Emerald Green woven with authentic Zardozi and Dabka embroidery remain unmatched in their majesty.',
      'For daytime ceremonies such as Anand Karaj or Mehendi, pastel palettes like Rose Gold, Blush Lilac, and Mint Georgette create a breathtaking, romantic allure in natural daylight.',
      'Always consider the weight of the can-can and dupatta borders so you can glide effortlessly through every ritual of your celebration.'
    ]
  },
  {
    slug: 'art-of-zardozi-and-dabka-embroidery',
    title: 'Heirloom Craftsmanship: The Ancient Art of Zardozi & Dabka',
    excerpt: 'An intimate look inside the Aafreen ateliers where master karigars spend hundreds of hours hand-crafting intricate metallic threadwork.',
    image: '/images/products/zarafshan.webp',
    author: 'Aafreen Editorial',
    authorRole: 'Couture House',
    category: 'Artisanal Craft',
    readTime: '4 min read',
    publishedAt: 'August 5, 2026',
    content: [
      'Originating from royal Mughal courts, Zardozi — from the Persian words zar (gold) and dozi (embroidery) — is one of the most intricate embellishment techniques in luxury Indian fashion.',
      'Each Aafreen bridal piece begins as an artist sketch before being transferred onto pure raw silk or velvet using the traditional pricking and chalking method.',
      'Our master artisans then use wooden addas (frames) and specialized hooked needles (ari) to hand-sew coiled gold threads, badla wirework, and freshwater pearls into timeless heirloom motifs.'
    ]
  },
  {
    slug: 'styling-modern-co-ord-sets-for-festivities',
    title: 'Modern Festive Chic: How to Style Luxury Co-Ord Sets',
    excerpt: 'Effortless elegance for Sangeet, Mehendi, and Cocktail nights with contemporary peplums and flared tiered shararas.',
    image: '/images/products/roshani-coord.webp',
    author: 'Sanya Malhotra',
    authorRole: 'Senior Stylist',
    category: 'Style Edit',
    readTime: '5 min read',
    publishedAt: 'July 28, 2026',
    content: [
      'Modern couture is about versatility and fluid grace. Our signature Co-Ord Sets blend structured tailoring with ethereal Indian drapes, making them the favorite choice for bridesmaids and contemporary wedding guests.',
      'Pair our blush peach Chanderi peplum set with statement Polki earrings and a minimalist metallic clutch for a relaxed yet radiant Sangeet look.',
      'Layer with a sheer Banarasi dupatta for formal ceremonies or wear the embellished top as a statement piece with tailored silk trousers for cocktail parties.'
    ]
  },
  {
    slug: 'jadau-and-kundan-jewellery-guide',
    title: 'Royal Accents: A Guide to Jadau & Kundan Polki Jewellery',
    excerpt: 'Complete your bridal ensemble with handcrafted 22k gold-plated Jadau Kundan pieces accented by emeralds and South Sea pearls.',
    image: '/images/products/sitara-polki-choker.webp',
    author: 'Pearl Kapoor',
    authorRole: 'Head Designer',
    category: 'Jewellery',
    readTime: '5 min read',
    publishedAt: 'July 20, 2026',
    content: [
      'No bridal couture look is complete without the shimmer of authentic Jadau and Kundan polki jewellery. The contrast between deep crimson velvet and lustrous uncut polki stones creates a royal portrait.',
      'When choosing your necklace neckline, complement a deep sweetheart or sweetheart-v blouse with a tiered choker set featuring natural emerald teardrops.',
      'To preserve your heirloom pieces for generations, avoid direct contact with perfumes and moisture, and store each piece wrapped in soft velvet pouches.'
    ]
  }
];
