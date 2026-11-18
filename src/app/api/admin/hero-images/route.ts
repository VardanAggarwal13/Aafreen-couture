import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/server/auth';
import { handleApiError } from '@/lib/api-errors';
import { logAdminAction } from '@/server/services/audit-log.service';
import { pageImageRepository } from '@/server/repositories/page-image.repository';
import { listHeroImages } from '@/server/services/hero-image.service';
import { getHeroSlot } from '@/config/hero-images.config';
import { heroImageUpdateSchema, heroImageResetSchema } from '@/validators/hero-image.schema';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    return NextResponse.json({ success: true, data: await listHeroImages() });
  } catch (error) {
    return handleApiError(error);
  }
}

/** Save a new hero image for one nav page. */
export async function PUT(request: NextRequest) {
  try {
    const session = await requireAdmin(request);
    const { key, image, focalX, focalY } = heroImageUpdateSchema.parse(await request.json());
    const slot = getHeroSlot(key);

    await pageImageRepository.upsert(key, image, focalX, focalY);
    if (slot) revalidatePath(slot.path);
    logAdminAction(session, request, 'HERO_IMAGE_UPDATE', `Updated the ${slot?.label ?? key} page hero image`);

    return NextResponse.json({ success: true, data: { key, image, focalX, focalY } });
  } catch (error) {
    return handleApiError(error);
  }
}

/** Go back to the built-in hero image for one nav page. */
export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAdmin(request);
    const { key } = heroImageResetSchema.parse(await request.json());
    const slot = getHeroSlot(key);

    await pageImageRepository.remove(key);
    if (slot) revalidatePath(slot.path);
    logAdminAction(session, request, 'HERO_IMAGE_RESET', `Reset the ${slot?.label ?? key} page hero image to default`);

    return NextResponse.json({ success: true, data: { key, image: slot?.defaultImage ?? '' } });
  } catch (error) {
    return handleApiError(error);
  }
}
