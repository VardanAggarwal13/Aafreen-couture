import { NextRequest, NextResponse } from 'next/server';
import { paymentService } from '@/server/services/payment.service';
import { orderRepository } from '@/server/repositories/order.repository';
import { handleApiError, UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/api-errors';
import { auth } from '@/lib/auth';
import { isAdminUser } from '@/lib/admin-access';

interface Context {
  params: Promise<{ id: string }>;
}

/**
 * Reconcile endpoint:
 * Directly checks live payment status with Razorpay servers and updates order & stock if captured.
 * Restricted to the order's own owner or an admin — this triggers a live Razorpay lookup and
 * order/stock mutation, so it must not be callable for an arbitrary order id by anyone else.
 */
export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params;

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) throw new UnauthorizedError();

    const order = await orderRepository.findById(id);
    if (!order) throw new NotFoundError('Order');

    const userEmail = session.user.email?.toLowerCase();
    const isAdmin = isAdminUser(session.user);
    const ownerId = await orderRepository.getOwnerId(id);
    const isOwner =
      (ownerId !== null && ownerId === session.user.id) ||
      Boolean(userEmail && order.shippingAddress?.email?.toLowerCase() === userEmail);

    if (!isAdmin && !isOwner) throw new ForbiddenError();

    const result = await paymentService.reconcilePayment(id);
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
