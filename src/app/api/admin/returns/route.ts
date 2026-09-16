import { NextRequest, NextResponse } from 'next/server';
import { returnRepository } from '@/server/repositories/return.repository';
import { returnService } from '@/server/services/return.service';
import { handleApiError } from '@/lib/api-errors';
import { requireAdmin } from '@/server/auth';
import { logAdminAction } from '@/server/services/audit-log.service';
import { CreateReturnSchema } from '@/validators/return.validators';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
    const returns = await returnRepository.findAll();
    return NextResponse.json({ success: true, data: returns });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdmin(request);
    const body = await request.json();
    const data = CreateReturnSchema.parse(body);
    const created = await returnService.logReturn(data);
    logAdminAction(session, request, 'RETURN_LOG', `Logged return for order ${created.orderNumber}`);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
