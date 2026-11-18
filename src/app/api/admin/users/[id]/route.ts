import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/server/auth';
import { userRepository } from '@/server/repositories/user.repository';
import { logAdminAction } from '@/server/services/audit-log.service';
import { handleApiError } from '@/lib/api-errors';
import { adminUserUpdateSchema } from '@/validators/admin-user.schema';

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: Props) {
  try {
    const session = await requireAdmin(request);
    const { id } = await params;
    const parsed = adminUserUpdateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });
    }
    const { role, name, phone } = parsed.data;

    if (role !== undefined && session.user.id === id && role !== 'admin') {
      return NextResponse.json({ error: 'You cannot remove your own admin access' }, { status: 400 });
    }

    let updated = null;
    if (role !== undefined) {
      updated = await userRepository.updateRole(id, role);
      if (updated) logAdminAction(session, request, 'USER_ROLE_UPDATE', `Set ${updated.email ?? id} role to ${role}`);
    }
    if (name !== undefined || phone !== undefined) {
      updated = await userRepository.updateDetails(id, { name, phone });
      if (updated) logAdminAction(session, request, 'USER_DETAILS_UPDATE', `Updated profile details for ${updated.email ?? id}`);
    }
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
