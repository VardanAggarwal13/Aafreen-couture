import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth';
import { handleApiError } from '@/lib/api-errors';
import { getCloudinarySignature } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    if (!cloudName || !apiKey || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Cloudinary is not configured on the server.' },
        { status: 500 }
      );
    }

    const { signature, timestamp } = getCloudinarySignature('aafreen-couture/products');

    return NextResponse.json({
      success: true,
      data: {
        signature,
        timestamp,
        cloudName,
        apiKey,
        folder: 'aafreen-couture/products',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
