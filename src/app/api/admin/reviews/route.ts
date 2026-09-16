import { NextRequest, NextResponse } from 'next/server';
import { reviewRepository } from '@/server/repositories/review.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const reviews = await reviewRepository.findAllForAdmin();
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    return handleApiError(error);
  }
}
