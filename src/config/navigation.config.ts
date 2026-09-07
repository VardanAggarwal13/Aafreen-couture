export interface NavLink {
  label: string;
  href: string;
  megaMenu?: MegaMenuGroup[];
  isSale?: boolean;
}

export interface MegaMenuGroup {
  title: string;
  links: { label: string; href: string }[];
}

export const navLinks: NavLink[] = [
  {
    label: 'Bridal',
    href: '/bridal',
    megaMenu: [
      {
        title: 'Bridal',
        links: [
          { label: 'Bridal Lehengas', href: '/bridal/bridal-lehengas' },
          { label: 'Bridal Suits', href: '/bridal/bridal-suits' },
          { label: 'Bridesmaid Lehengas', href: '/bridal/bridesmaid-lehengas' },
          { label: 'Reception Gowns', href: '/bridal/reception-gowns' },
          { label: 'Reception Collection', href: '/bridal/reception' },
          { label: 'Engagement Collection', href: '/bridal/engagement' },
          { label: 'Mehendi Collection', href: '/bridal/mehendi' },
          { label: 'Haldi Collection', href: '/bridal/haldi' },
          { label: 'Sangeet Collection', href: '/bridal/sangeet' },
          { label: 'View All Bridal', href: '/bridal' },
        ],
      },
    ],
  },
  {
    label: 'Suits',
    href: '/suits',
    megaMenu: [
      {
        title: 'Suits',
        links: [
          { label: 'Cotton Kurta Sets', href: '/suits/cotton-kurta-sets' },
          { label: 'Co-ord Sets', href: '/suits/co-ord-sets' },
          { label: 'Summer Essentials', href: '/suits/summer-essentials' },
          { label: 'Partywear Unstitched', href: '/suits/partywear-unstitched' },
          { label: 'Handcrafted Luxury', href: '/suits/handcrafted-luxury' },
          { label: 'Indo-Western', href: '/suits/indo-western' },
          { label: 'View All Suits', href: '/suits' },
        ],
      },
    ],
  },
  {
    label: 'Ready To Wear',
    href: '/ready-to-wear',
    megaMenu: [
      {
        title: 'Ready To Wear',
        links: [
          { label: 'New Arrivals', href: '/ready-to-wear/new-arrivals' },
          { label: 'Signature Co-Ords', href: '/ready-to-wear/signature-co-ords' },
          { label: 'Dresses', href: '/ready-to-wear/dresses' },
          { label: 'Sharara Sets', href: '/ready-to-wear/sharara-sets' },
          { label: 'Occasion Lehengas', href: '/ready-to-wear/occasion-lehengas' },
          { label: 'View All', href: '/ready-to-wear' },
        ],
      },
    ],
  },
  { label: 'Jewellery', href: '/jewellery' },
  {
    label: 'Bags',
    href: '/bags',
    megaMenu: [
      {
        title: 'Bags',
        links: [
          { label: 'Handbags', href: '/bags/handbags' },
          { label: 'Potlis', href: '/bags/potlis' },
          { label: 'Clutches', href: '/bags/clutches' },
          { label: 'Totes', href: '/bags/totes' },
          { label: 'Shoulder Bags', href: '/bags/shoulder-bags' },
          { label: 'View All Bags', href: '/bags' },
        ],
      },
    ],
  },
  {
    label: 'Occasions',
    href: '/occasions',
    megaMenu: [
      {
        title: 'Occasions',
        links: [
          { label: 'Engagement', href: '/occasions/engagement' },
          { label: 'Haldi', href: '/occasions/haldi' },
          { label: 'Mehendi', href: '/occasions/mehendi' },
          { label: 'Sangeet', href: '/occasions/sangeet' },
          { label: 'Jago Edit', href: '/occasions/jago' },
          { label: 'Wedding', href: '/occasions/wedding' },
          { label: 'Reception', href: '/occasions/reception' },
          { label: 'View All Occasions', href: '/occasions' },
        ],
      },
    ],
  },
];

export const homeCategories = [
  {
    label: 'Bridal Lehengas',
    href: '/bridal/bridal-lehengas',
    image: '/images/cats/bridal.webp',
  },
  {
    label: 'Bridesmaid Lehengas',
    href: '/bridal/bridesmaid-lehengas',
    image: '/images/cats/bridesmaid.webp',
  },
  {
    label: 'Suits',
    href: '/suits',
    image: '/images/cats/suits.webp',
  },
  {
    label: 'Co-ord Sets',
    href: '/suits/co-ord-sets',
    image: '/images/cats/coord.webp',
  },
  {
    label: 'Jewellery',
    href: '/jewellery',
    image: '/images/cats/jewellery.webp',
  },
  {
    label: 'The Bag Edit',
    href: '/bags',
    image: '/images/cats/bags.webp',
  },
] as const;

export const shopByOccasion = [
  {
    label: 'Engagement',
    href: '/occasions/engagement',
    image: '/images/occasions/engagement.webp',
  },
  {
    label: 'Haldi',
    href: '/occasions/haldi',
    image: '/images/occasions/haldi.webp',
  },
  {
    label: 'Mehendi',
    href: '/occasions/mehendi',
    image: '/images/occasions/mehendi.webp',
  },
  {
    label: 'Sangeet',
    href: '/occasions/sangeet',
    image: '/images/occasions/sangeet.webp',
  },
  {
    label: 'Jago Edit',
    href: '/occasions/jago',
    image: '/images/occasions/sangeet.webp',
  },
  {
    label: 'Wedding',
    href: '/occasions/wedding',
    image: '/images/occasions/wedding.webp',
  },
  {
    label: 'Reception',
    href: '/occasions/reception',
    image: '/images/occasions/reception.webp',
  },
] as const;

export const collections = [
  { label: 'Bridal Lehengas + Suits', href: '/collections/bridal-lehengas-suits' },
  { label: 'Bridesmaid Lehengas', href: '/collections/bridesmaid-lehengas' },
  { label: 'Formals — Cotton Kurta Set', href: '/collections/formals-cotton-kurta-set' },
  { label: 'Indo-Western', href: '/collections/indo-western' },
  { label: 'Signature Sets (Co-ord)', href: '/collections/signature-co-ord-sets' },
  { label: 'Summer Essential Cotton Suits', href: '/collections/summer-essentials' },
  { label: 'Partywear Unstitched Suits', href: '/collections/partywear-unstitched' },
  { label: 'Custom Embroidered Suits', href: '/collections/custom-embroidered-suits' },
  { label: 'Saree Edit', href: '/collections/saree-edit' },
  { label: 'Jewellery', href: '/collections/jewellery' },
  { label: 'The Bag Edit', href: '/collections/the-bag-edit' },
  { label: 'Occasion-Based Lehengas', href: '/collections/occasion-lehengas' },
] as const;

export const footerLinks = {
  shop: [
    { label: 'New Arrivals', href: '/shop?sort=newest' },
    { label: 'Bridal Lehengas', href: '/shop?category=bridal-lehengas' },
    { label: 'Suits', href: '/shop?category=suits' },
    { label: 'Jewellery', href: '/collections/jewellery' },
    { label: 'The Bag Edit', href: '/collections/the-bag-edit' },
  ],
  occasions: [
    { label: 'Wedding', href: '/shop?occasion=wedding' },
    { label: 'Reception', href: '/shop?occasion=reception' },
    { label: 'Mehendi', href: '/shop?occasion=mehendi' },
    { label: 'Sangeet', href: '/shop?occasion=sangeet' },
    { label: 'Festive', href: '/shop?occasion=festive' },
  ],
  account: [
    { label: 'My Account', href: '/dashboard' },
    { label: 'My Orders', href: '/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Track Order', href: '/track-order' },
  ],
  info: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Returns Policy', href: '/returns-policy' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ],
} as const;
