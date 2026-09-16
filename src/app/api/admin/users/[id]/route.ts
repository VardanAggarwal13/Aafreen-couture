import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth';
import { userRepository } from '@/server/repositories/user.repository';
import { logAdminAction } from '@/server/services/audit-log.service';
import { handleApiError } from '@/lib/api-errors';

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    if (!role || !['admin', 'customer'].includes(role)) {
      return NextResponse.json({ error: 'Valid role (admin or customer) is required' }, { status: 400 });
    }

    if (session.user.id === id && role !== 'admin') {
      return NextResponse.json({ error: 'You cannot remove your own admin access' }, { status: 400 });
    }

    const updated = await userRepository.updateRole(id, role);
    if (!updated) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    logAdminAction(session, request, 'USER_ROLE_UPDATE', `Set ${updated.email ?? id} role to ${role}`);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { id } = await params;

    if (session.user.id === id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    const deleted = await userRepository.delete(id);
    if (!deleted) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    logAdminAction(session, request, 'USER_DELETE', `Deleted user account ${id}`);
    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}
