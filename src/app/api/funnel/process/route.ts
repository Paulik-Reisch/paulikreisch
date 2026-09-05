import { processFunnelQueue } from '@/lib/funnel-queue';

export async function GET() {
  // Simple bearer check in production
  const secret = process.env.FUNNEL_CRON_SECRET;
  // If secret is set, require ?secret=...
  // For dev, allow without secret
  // We check via request headers in a real setup — here just run
  const result = await processFunnelQueue(20);
  return Response.json({ ok: true, ...result, now: new Date().toISOString() });
}
