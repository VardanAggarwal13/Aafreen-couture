/**
 * Hero images of the main navigation pages that the admin can replace from
 * Admin > Hero Images. `defaultImage` / `defaultFocal` are what shows until the admin edits one.
 */
export interface HeroSlot {
  key: string;
  label: string;
  path: string;
  hint: string;
  defaultImage: string;
  /** Focal point (% from left / top) the page uses for its original photo. */
  defaultFocal: { x: number; y: number };
}

const CLOUD = 'https://res.cloudinary.com/adzbklts/image/upload';

export const HERO_SLOTS: HeroSlot[] = [
  {
    key: 'bridal',
    label: 'Bridal',
    path: '/bridal',
    hint: 'Shown beside the page heading on the Bridal page.',
    defaultImage: `${CLOUD}/v1791872394/aafreen-couture/banners/bridal-hero-wide.webp`,
    defaultFocal: { x: 60, y: 85 },
  },
  {
    key: 'suits',
    label: 'Suits',
    path: '/suits',
    hint: 'Shown beside the page heading on the Suits page.',
    defaultImage: `${CLOUD}/v1791872394/aafreen-couture/banners/suits-hero.webp`,
    defaultFocal: { x: 50, y: 18 },
  },
  {
    key: 'ready-to-wear',
    label: 'Ready to Wear',
    path: '/ready-to-wear',
    hint: 'Shown beside the page heading on the Ready to Wear page.',
    defaultImage: `${CLOUD}/v1791872394/aafreen-couture/banners/rtw-hero.webp`,
    defaultFocal: { x: 50, y: 20 },
  },
  {
    key: 'bags',
    label: 'Bags',
    path: '/bags',
    hint: 'Shown beside the page heading on the Bags page.',
    defaultImage: `${CLOUD}/v1791872395/aafreen-couture/banners/bags-hero.webp`,
    defaultFocal: { x: 50, y: 50 },
  },
  {
    key: 'occasions',
    label: 'Occasions',
    path: '/occasions',
    hint: 'Shown beside the page heading on the Occasions page.',
    defaultImage: `${CLOUD}/v1791872396/aafreen-couture/occasions/occasions-hero-stable.webp`,
    defaultFocal: { x: 50, y: 50 },
  },
];

export const HERO_SLOT_KEYS = HERO_SLOTS.map((s) => s.key) as [string, ...string[]];

export function getHeroSlot(key: string): HeroSlot | undefined {
  return HERO_SLOTS.find((s) => s.key === key);
}
