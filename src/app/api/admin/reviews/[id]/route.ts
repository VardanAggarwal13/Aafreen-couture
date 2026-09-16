import { NextRequest, NextResponse } from 'next/server';
import { reviewRepository } from '@/server/repositories/review.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { z } from 'zod';

interface Props { params: Promise<{ id: string }> }

const PatchSchema = z.object({ isApproved: z.boolean() });

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const { isApproved } = PatchSchema.parse(body);
    const updated = await reviewRepository.setApproval(id, isApproved);
    if (!updated) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    logAdminAction(session, request, isApproved ? 'REVIEW_APPROVE' : 'REVIEW_UNAPPROVE', `Review ${id} for product ${updated.product}`);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { id } = await params;
    const deleted = await reviewRepository.delete(id);
    if (!deleted) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    logAdminAction(session, request, 'REVIEW_DELETE', `Deleted review ${id}`);
    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
