import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { orderService } from '@/server/services/order.service';
import { handleApiError, unauthorized } from '@/lib/api-errors';
import { CreateOrderSchema } from '@/validators/order.validators';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return unauthorized();

    const page = Number(request.nextUrl.searchParams.get('page') ?? 1);
    const { items, total } = await orderService.getUserOrders(session.user.id, page);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: { page, limit: 10, total, totalPages: Math.ceil(total / 10) },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return unauthorized();

    const body = await request.json();
    const input = CreateOrderSchema.parse(body);
    const order = await orderService.createOrder(session.user.id, input);

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
