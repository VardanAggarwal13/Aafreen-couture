import { NextRequest, NextResponse } from 'next/server';
import { returnRepository } from '@/server/repositories/return.repository';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { UpdateReturnSchema } from '@/validators/return.validators';
import type { IReturn } from '@/models/Return';

interface Props { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const data = UpdateReturnSchema.parse(body);
    const updated = await returnRepository.update(id, data as unknown as Partial<IReturn>);
    if (!updated) return NextResponse.json({ error: 'Return not found' }, { status: 404 });
    logAdminAction(session, request, 'RETURN_UPDATE', `Return ${id} → ${data.status ?? updated.status}`);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { id } = await params;
    const deleted = await returnRepository.delete(id);
    if (!deleted) return NextResponse.json({ error: 'Return not found' }, { status: 404 });
    logAdminAction(session, request, 'RETURN_DELETE', `Deleted return ${id}`);
    return NextResponse.json({ success: true, deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
