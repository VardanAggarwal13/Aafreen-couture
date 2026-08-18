import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { orderService } from '@/server/services/order.service';
import { handleApiError, UnauthorizedError } from '@/lib/api-errors';

interface Context { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) throw new UnauthorizedError();

    const { id } = await params;
    const order = await orderService.getOrderById(id, session.user.id);
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return handleApiError(error);
  }
}
