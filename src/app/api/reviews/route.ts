import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { reviewService } from '@/server/services/review.service';
import { handleApiError } from '@/lib/api-errors';
import { requireAuth } from '@/server/auth';

export const dynamic = 'force-dynamic';

const CreateReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(100),
  body: z.string().trim().min(10).max(2000),
});

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId');
    if (!productId) return NextResponse.json({ success: false, error: 'productId is required' }, { status: 400 });
    const reviews = await reviewService.getPublicReviews(productId);
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(request);
    const input = CreateReviewSchema.parse(await request.json());
    await reviewService.submitReview({ id: session.user.id, name: session.user.name }, input);
    return NextResponse.json(
      { success: true, message: 'Thank you! Your review will appear once it has been approved.' },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
