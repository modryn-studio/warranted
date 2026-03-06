import { createRouteLogger } from '@/lib/route-logger';
import { Resend } from 'resend';

const log = createRouteLogger('subscribe');

interface SubscribeBody {
  email?: string;
}

export async function POST(req: Request): Promise<Response> {
  const ctx = log.begin();

  try {
    const body = (await req.json()) as SubscribeBody;
    log.info(ctx.reqId, 'Request received', { email: body.email });

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || !emailRegex.test(body.email)) {
      log.warn(ctx.reqId, 'Invalid email', { email: body.email });
      return log.end(ctx, Response.json({ error: 'Valid email required' }, { status: 400 }));
    }

    const resendKey = process.env.RESEND_API_KEY;
    const segmentId = process.env.RESEND_SEGMENT_ID_FREE;

    if (!resendKey) {
      log.warn(ctx.reqId, 'RESEND_API_KEY not configured');
      return log.end(ctx, Response.json({ error: 'Email service unavailable' }, { status: 503 }));
    }

    if (!segmentId) {
      log.warn(ctx.reqId, 'RESEND_SEGMENT_ID_FREE not configured');
      return log.end(ctx, Response.json({ error: 'Email service unavailable' }, { status: 503 }));
    }

    const resend = new Resend(resendKey);

    await resend.contacts.create({
      email: body.email,
      unsubscribed: false,
      segments: [{ id: segmentId }],
    });

    log.info(ctx.reqId, 'Contact added to free segment', { segmentId });
    return log.end(ctx, Response.json({ ok: true }));
  } catch (error) {
    log.err(ctx, error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
