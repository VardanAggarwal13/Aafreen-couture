import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { MongoClient, ObjectId } from 'mongodb';
import { handleApiError, unauthorized } from '@/lib/api-errors';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number').optional().or(z.literal('')),
});

let clientPromise: Promise<MongoClient> | null = null;
function getMongoClient() {
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI!);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return unauthorized();

    const client = await getMongoClient();
    const db = client.db();
    
    // Find user by _id (string or ObjectId) or email
    const query: Record<string, any> = ObjectId.isValid(session.user.id)
      ? { $or: [{ _id: new ObjectId(session.user.id) }, { _id: session.user.id }, { email: session.user.email }] }
      : { $or: [{ _id: session.user.id }, { email: session.user.email }] };

    const userDoc = await db.collection<any>('user').findOne(query);

    return NextResponse.json({
      success: true,
      data: {
        id: session.user.id,
        name: userDoc?.name ?? session.user.name,
        email: session.user.email,
        phone: userDoc?.phone ?? '',
        role: userDoc?.role ?? session.user.role ?? 'customer',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) return unauthorized();

    const body = await request.json();
    const validated = updateProfileSchema.parse(body);

    const client = await getMongoClient();
    const db = client.db();

    const query: Record<string, any> = ObjectId.isValid(session.user.id)
      ? { $or: [{ _id: new ObjectId(session.user.id) }, { _id: session.user.id }, { email: session.user.email }] }
      : { $or: [{ _id: session.user.id }, { email: session.user.email }] };

    const updateFields: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (validated.name !== undefined) updateFields.name = validated.name;
    if (validated.phone !== undefined) updateFields.phone = validated.phone;

    await db.collection<any>('user').updateOne(query, { $set: updateFields });

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        name: validated.name ?? session.user.name,
        phone: validated.phone ?? '',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
