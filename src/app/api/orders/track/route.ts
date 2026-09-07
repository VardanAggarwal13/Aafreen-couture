import { NextRequest, NextResponse } from 'next/server';
import { orderRepository } from '@/server/repositories/order.repository';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawQuery = searchParams.get('orderNumber') || searchParams.get('orderId') || '';
    const query = rawQuery.trim();

    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Please provide an order number' },
        { status: 400 }
      );
    }

    const orderNumberPattern = query.replace(/^#/, '');

    let order = await orderRepository.findByOrderNumber(orderNumberPattern);

    if (!order && orderNumberPattern.length === 24) {
      order = await orderRepository.findById(orderNumberPattern);
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: `Order #${query} not found in our atelier records` },
        { status: 404 }
      );
    }

    // Return sanitized data safe for public tracking display
    return NextResponse.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
        shippingCity: order.shippingAddress?.city,
        shippingState: order.shippingAddress?.state,
        trackingNumber: order.trackingNumber,
        trackingUrl: order.trackingUrl,
        statusHistory: order.statusHistory ?? [],
        items: (order.items ?? []).map((item: { name: string; quantity: number; size?: string; color?: string; image?: string; price: number }) => ({
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.image,
          price: item.price,
        })),
        total: order.total,
      },
    });
  } catch (error) {
    console.error('[Track Order API Error]:', error);
    return NextResponse.json(
      { success: false, message: 'Unable to look up order at this moment. Please connect with our concierge.' },
      { status: 404 }
    );
  }
}
