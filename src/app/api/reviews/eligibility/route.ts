import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { reviewService } from '@/server/services/review.service';
import { handleApiError } from '@/lib/api-errors';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId');
    if (!productId) return NextResponse.json({ success: false, error: 'productId is required' }, { status: 400 });

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json({ success: true, data: { signedIn: false, eligible: false } });
    }

    const result = await reviewService.getEligibility(session.user.id, productId);
    return NextResponse.json({ success: true, data: { signedIn: true, ...result } });
  } catch (error) {
    return handleApiError(error);
  }
}
