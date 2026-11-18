import { pageImageRepository, type PageImageRecord } from '@/server/repositories/page-image.repository';
import { HERO_SLOTS, getHeroSlot, type HeroSlot } from '@/config/hero-images.config';

export interface HeroImageState {
  key: string;
  label: string;
  path: string;
  hint: string;
  defaultImage: string;
  defaultFocal: { x: number; y: number };
  /** The image and focal point visitors currently see. */
  image: string;
  focal: { x: number; y: number };
  /** True when the admin has edited this page's hero. */
  isCustom: boolean;
}

export interface PublicHero {
  image: string;
  /** CSS object-position value, e.g. "60% 85%". */
  objectPosition: string;
}

function resolve(slot: HeroSlot, record: PageImageRecord | undefined): HeroImageState {
  const focal =
    record && typeof record.focalX === 'number' && typeof record.focalY === 'number'
      ? { x: record.focalX, y: record.focalY }
      : slot.defaultFocal;
  return {
    ...slot,
    image: record?.image || slot.defaultImage,
    focal: record ? focal : slot.defaultFocal,
    isCustom: !!record,
  };
}

/** Hero for a nav page. Never throws: falls back to the built-in image if the database is unreachable. */
export async function getHero(key: string): Promise<PublicHero> {
  const slot = getHeroSlot(key);
  if (!slot) return { image: '', objectPosition: '50% 50%' };
  let record: PageImageRecord | null = null;
  try {
    record = await pageImageRepository.findByKey(key);
  } catch (err) {
    console.error('[hero-image] lookup failed, using default:', key, err);
  }
  const state = resolve(slot, record ?? undefined);
  return { image: state.image, objectPosition: `${state.focal.x}% ${state.focal.y}%` };
}

export async function listHeroImages(): Promise<HeroImageState[]> {
  const records = new Map<string, PageImageRecord>();
  try {
    for (const r of await pageImageRepository.findAll()) records.set(r.key, r);
  } catch (err) {
    console.error('[hero-image] list failed, showing defaults:', err);
  }
  return HERO_SLOTS.map((slot) => resolve(slot, records.get(slot.key)));
}
