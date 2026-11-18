import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/validators/contact.schema';
import { emailService } from '@/server/services/email.service';
import { handleApiError } from '@/lib/api-errors';

export const runtime = 'nodejs';

// Best-effort limit per visitor (resets on server restart): 5 messages every 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many messages. Please wait a few minutes or message us on WhatsApp.', code: 'RATE_LIMITED' },
        { status: 429 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'The request could not be read. Please try again.', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }
    const data = contactSchema.parse(body);

    // A filled honeypot means a bot: pretend it worked and send nothing.
    if (data.website) {
      return NextResponse.json({ success: true, data: { sent: true } }, { status: 201 });
    }

    const sent = await emailService.sendContactEnquiry({
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      subject: data.subject,
      message: data.message,
    });

    if (!sent) {
      return NextResponse.json(
        {
          success: false,
          error: 'We could not send your message right now. Please try again, or reach us on WhatsApp.',
          code: 'EMAIL_UNAVAILABLE',
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, data: { sent: true } }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
