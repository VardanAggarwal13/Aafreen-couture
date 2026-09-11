import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { orderService } from '@/server/services/order.service';
import { handleApiError } from '@/lib/api-errors';

interface Context {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({ headers: request.headers });

    const order = await orderService.confirmCodOrder(
      id,
      session?.user?.id,
      session?.user?.email
    );

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
