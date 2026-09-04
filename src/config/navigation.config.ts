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
    href: '/collections/bridal',
    megaMenu: [
      {
        title: 'Bridal',
        links: [
          { label: 'Bridal Lehengas', href: '/collections/bridal-lehengas-suits' },
          { label: 'Bridal Suits', href: '/shop?category=bridal-suits' },
          { label: 'Bridesmaid Lehengas', href: '/collections/bridesmaid-lehengas' },
          { label: 'Reception Gowns', href: '/shop?category=gowns' },
          { label: 'Reception Collection', href: '/shop?occasion=reception' },
          { label: 'Engagement Collection', href: '/shop?occasion=engagement' },
          { label: 'Mehendi Collection', href: '/shop?occasion=mehendi' },
          { label: 'Haldi Collection', href: '/shop?occasion=haldi' },
          { label: 'Sangeet Collection', href: '/shop?occasion=sangeet' },
          { label: 'View All Bridal', href: '/collections/bridal-lehengas-suits' },
        ],
      },
    ],
  },
  {
    label: 'Suits',
    href: '/shop?category=suits',
    megaMenu: [
      {
        title: 'Suits',
        links: [
          { label: 'Cotton Kurta Sets', href: '/collections/formals-cotton-kurta-set' },
          { label: 'Co-ord Sets', href: '/collections/signature-co-ord-sets' },
          { label: 'Summer Essentials', href: '/collections/summer-essentials' },
          { label: 'Partywear Unstitched', href: '/collections/partywear-unstitched' },
          { label: 'Handcrafted Luxury', href: '/collections/custom-embroidered-suits' },
          { label: 'Indo-Western', href: '/collections/indo-western' },
          { label: 'View All Suits', href: '/shop?category=suits' },
        ],
      },
    ],
  },
  {
    label: 'Ready To Wear',
    href: '/shop?sort=newest&ready=true',
    megaMenu: [
      {
        title: 'Ready To Wear',
        links: [
          { label: 'New Arrivals', href: '/shop?sort=newest' },
          { label: 'Signature Co-Ords', href: '/collections/signature-co-ord-sets' },
          { label: 'Dresses', href: '/shop?category=dresses' },
          { label: 'Sharara Sets', href: '/shop?category=sharara' },
          { label: 'Occasion Lehengas', href: '/collections/occasion-lehengas' },
          { label: 'View All', href: '/shop' },
        ],
      },
    ],
  },
  { label: 'Jewellery', href: '/collections/jewellery' },
  {
    label: 'Bags',
    href: '/collections/the-bag-edit',
    megaMenu: [
      {
        title: 'The Bag Edit',
        links: [
          { label: 'Handbags', href: '/shop?category=handbags' },
          { label: 'Potlis', href: '/shop?category=potlis' },
          { label: 'Clutches', href: '/shop?category=clutches' },
          { label: 'Totes', href: '/shop?category=totes' },
          { label: 'Shoulder Bags', href: '/shop?category=shoulder-bags' },
          { label: 'View All Bags', href: '/collections/the-bag-edit' },
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
          { label: 'Engagement', href: '/shop?occasion=engagement' },
          { label: 'Haldi', href: '/shop?occasion=haldi' },
          { label: 'Mehendi', href: '/shop?occasion=mehendi' },
          { label: 'Sangeet', href: '/shop?occasion=sangeet' },
          { label: 'Jago Edit', href: '/shop?occasion=jago' },
          { label: 'Wedding', href: '/shop?occasion=wedding' },
          { label: 'Reception', href: '/shop?occasion=reception' },
          { label: 'View All Occasions', href: '/occasions' },
        ],
      },
    ],
  },
];

export const homeCategories = [
  {
    label: 'Bridal Lehengas',
    href: '/collections/bridal-lehengas-suits',
    image: '/images/cats/bridal.webp',
  },
  {
    label: 'Bridesmaid Lehengas',
    href: '/collections/bridesmaid-lehengas',
    image: '/images/cats/bridesmaid.webp',
  },
  {
    label: 'Suits',
    href: '/shop?category=suits',
    image: '/images/cats/suits.webp',
  },
  {
    label: 'Co-ord Sets',
    href: '/collections/signature-co-ord-sets',
    image: '/images/cats/coord.webp',
  },
  {
    label: 'Jewellery',
    href: '/collections/jewellery',
    image: '/images/cats/jewellery.webp',
  },
  {
    label: 'The Bag Edit',
    href: '/collections/the-bag-edit',
    image: '/images/cats/bags.webp',
  },
] as const;

export const shopByOccasion = [
  {
    label: 'Engagement',
    href: '/shop?occasion=engagement',
    image: '/images/occasions/engagement.webp',
  },
  {
    label: 'Haldi',
    href: '/shop?occasion=haldi',
    image: '/images/occasions/haldi.webp',
  },
  {
    label: 'Mehendi',
    href: '/shop?occasion=mehendi',
    image: '/images/occasions/mehendi.webp',
  },
  {
    label: 'Sangeet',
    href: '/shop?occasion=sangeet',
    image: '/images/occasions/sangeet.webp',
  },
  {
    label: 'Jago Edit',
    href: '/shop?occasion=jago',
    image: '/images/occasions/sangeet.webp',
  },
  {
    label: 'Wedding',
    href: '/shop?occasion=wedding',
    image: '/images/occasions/wedding.webp',
  },
  {
    label: 'Reception',
    href: '/shop?occasion=reception',
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
    { label: 'Bridal Lehengas', href: '/collections/bridal-lehengas-suits' },
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
    { label: 'Returns Policy', href: '/returns' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ],
} as const;
