import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Address from '@/models/Address';
import { handleApiError, unauthorized } from '@/lib/api-errors';
import { z } from 'zod';

const addressSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid mobile number'),
  line1: z.string().min(3, 'Address line is required'),
  line2: z.string().optional().default(''),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  country: z.string().optional().default('India'),
  isDefault: z.boolean().optional().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return unauthorized();

    await connectDB();
    const addresses = await Address.find({ userId: session.user.id })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: addresses });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return unauthorized();

    const body = await request.json();
    const validated = addressSchema.parse(body);

    await connectDB();

    // Check if this is user's first address
    const existingCount = await Address.countDocuments({ userId: session.user.id });
    const isFirst = existingCount === 0;

    // If marked default or first address, unset previous defaults
    if (validated.isDefault || isFirst) {
      await Address.updateMany({ userId: session.user.id }, { isDefault: false });
    }

    const newAddress = await Address.create({
      ...validated,
      userId: session.user.id,
      isDefault: validated.isDefault || isFirst,
    });

    return NextResponse.json({ success: true, data: newAddress }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
