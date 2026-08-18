import { NextResponse } from 'next/server';
import { collectionRepository } from '@/server/repositories/collection.repository';
import { handleApiError } from '@/lib/api-errors';

export async function GET() {
  try {
    const collections = await collectionRepository.findAll();
    return NextResponse.json({ success: true, data: collections });
  } catch (error) {
    return handleApiError(error);
  }
}
