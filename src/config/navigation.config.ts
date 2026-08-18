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
  { label: 'New In', href: '/shop?sort=newest' },
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
          { label: 'Wedding Guest', href: '/shop?occasion=wedding-guest' },
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
          { label: 'Custom Embroidered', href: '/collections/custom-embroidered-suits' },
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
  { label: 'Occasions', href: '/occasions' },
  { label: 'Sale', href: '/shop?sale=true', isSale: true },
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
    label: 'Wedding',
    href: '/shop?occasion=wedding',
    image: 'https://images.unsplash.com/photo-1762201698238-bf412e297016?w=400&q=80',
  },
  {
    label: 'Engagement',
    href: '/shop?occasion=engagement',
    image: 'https://images.unsplash.com/photo-1742891603547-950f510710d7?w=400&q=80',
  },
  {
    label: 'Reception',
    href: '/shop?occasion=reception',
    image: 'https://images.unsplash.com/photo-1717835806988-3739f9e55926?w=400&q=80',
  },
  {
    label: 'Mehendi',
    href: '/shop?occasion=mehendi',
    image: 'https://images.unsplash.com/photo-1745482036066-5d215ed6b910?w=400&q=80',
  },
  {
    label: 'Haldi',
    href: '/shop?occasion=haldi',
    image: 'https://plus.unsplash.com/premium_photo-1682096062732-a86d39069a4a?w=400&q=80',
  },
  {
    label: 'Sangeet',
    href: '/shop?occasion=sangeet',
    image: 'https://images.unsplash.com/photo-1587012521796-6359d3678f2a?w=400&q=80',
  },
  {
    label: 'Cocktail',
    href: '/shop?occasion=cocktail',
    image: 'https://images.unsplash.com/photo-1645862755924-9f4e7f200b83?w=400&q=80',
  },
  {
    label: 'Festive',
    href: '/shop?occasion=festive',
    image: 'https://plus.unsplash.com/premium_photo-1682096159299-5e8a6d5d442b?w=400&q=80',
  },
  {
    label: 'Party Wear',
    href: '/shop?occasion=party-wear',
    image: 'https://images.unsplash.com/photo-1722952908681-944d47e45853?w=400&q=80',
  },
  {
    label: 'Formal',
    href: '/shop?occasion=formal',
    image: 'https://images.unsplash.com/photo-1743229995505-d6374996df1c?w=400&q=80',
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
