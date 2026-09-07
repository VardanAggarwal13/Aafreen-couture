import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Address from '@/models/Address';
import { handleApiError, unauthorized, notFound } from '@/lib/api-errors';
import { z } from 'zod';

const updateAddressSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  line1: z.string().min(3).optional(),
  line2: z.string().optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  pincode: z.string().regex(/^\d{6}$/).optional(),
  country: z.string().optional(),
  isDefault: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return unauthorized();

    const { id } = await params;
    const body = await request.json();
    const validated = updateAddressSchema.parse(body);

    await connectDB();

    if (validated.isDefault) {
      await Address.updateMany({ userId: session.user.id }, { isDefault: false });
    }

    const updated = await Address.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: validated },
      { new: true }
    );

    if (!updated) return notFound('Address');

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return unauthorized();

    const { id } = await params;
    await connectDB();

    const deleted = await Address.findOneAndDelete({ _id: id, userId: session.user.id });
    if (!deleted) return notFound('Address');

    // If deleted address was default, set another address as default
    if (deleted.isDefault) {
      const remaining = await Address.findOne({ userId: session.user.id }).sort({ createdAt: -1 });
      if (remaining) {
        remaining.isDefault = true;
        await remaining.save();
      }
    }

    return NextResponse.json({ success: true, message: 'Address deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
