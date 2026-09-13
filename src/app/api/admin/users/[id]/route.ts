import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth';
import { userRepository } from '@/server/repositories/user.repository';
import { handleApiError } from '@/lib/api-errors';

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    if (!role || !['admin', 'customer'].includes(role)) {
      return NextResponse.json({ error: 'Valid role (admin or customer) is required' }, { status: 400 });
    }

    const updated = await userRepository.updateRole(id, role);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    await requireAdmin(request);
    const { id } = await params;

    const deleted = await userRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
