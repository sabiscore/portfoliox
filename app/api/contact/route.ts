import { contactSchema } from '@/app/lib/validations';
import { CONTACT_EMAIL, SENDER_EMAIL } from '@/lib/config';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Lazy-initialize Resend client to avoid build-time errors when env var is missing
let resend: Resend | null = null;
function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

function getClientKey(request: Request, email: string): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';

  return `${ip}:${email.toLowerCase()}`;
}

/** Remove entries whose window has expired to prevent unbounded map growth. */
function pruneRateLimitMap(): void {
  const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS;
  for (const [key, entry] of rateLimitMap) {
    if (entry.timestamp < cutoff) rateLimitMap.delete(key);
  }
}

function isRateLimited(key: string): boolean {
  pruneRateLimitMap();
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return false;
  }

  if (now - entry.timestamp > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, timestamp: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  return false;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = contactSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    const rateKey = getClientKey(request, data.email);

    if (isRateLimited(rateKey)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    if (data.honeypot && data.honeypot.length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const client = getResendClient();
    if (!client) {
      return NextResponse.json(
        { error: 'Contact channel is temporarily unavailable.' },
        { status: 503 }
      );
    }

    const subject = `[Portfolio] ${data.inquiryType?.toUpperCase() ?? 'SYSTEM'} conversation from ${data.name}`;

    const { error } = await client.emails.send({
      from: `Oscar Portfolio <${SENDER_EMAIL}>`,
      to: CONTACT_EMAIL,
      subject,
      text: `Name: ${data.name}
Email: ${data.email}
Company: ${data.company || '-'}
Scope: ${data.scope || '-'}
Type: ${data.inquiryType || '-'}
Timeline: ${data.timeline}
Stakes: ${data.stakes || '-'}

Message:
${data.message}`,
    });

    if (error) {
      console.error('[api/contact] Resend rejected the message', {
        code: error.name,
        statusCode: error.statusCode,
      });
      return NextResponse.json(
        { error: 'Contact channel is temporarily unavailable.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
